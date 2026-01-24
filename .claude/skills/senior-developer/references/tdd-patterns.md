# TDD Patterns for Frontend Development

Comprehensive Test-Driven Development patterns and examples.

## The TDD Mindset

### Why TDD Works

1. **Better Design**: Writing tests first forces you to think about the API from the consumer's perspective
2. **Fewer Bugs**: Tests catch issues before they reach production
3. **Confidence to Refactor**: Green tests mean you can change implementation safely
4. **Living Documentation**: Tests document expected behavior
5. **Faster Development**: Sounds counterintuitive, but TDD reduces debugging time

### The Rules of TDD

1. Write a failing test before writing any production code
2. Write only enough of a test to fail (compilation failures count)
3. Write only enough production code to make the failing test pass
4. Refactor only when tests are green

## Component TDD Patterns

### Pattern 1: Basic Component

```tsx
// 1. RED - Start with the simplest test
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});

// Component doesn't exist yet - test fails ✓

// 2. GREEN - Minimal implementation
function Button({ children }) {
  return <button>{children}</button>;
}

// Test passes ✓

// 3. RED - Add next behavior
it('calls onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

// 4. GREEN - Add onClick
function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// 5. RED - Add variant support
it('applies primary styles when variant is primary', () => {
  render(<Button variant="primary">Primary</Button>);
  expect(screen.getByRole('button')).toHaveClass('bg-blue-500');
});

// 6. GREEN - Add variant
function Button({ children, onClick, variant = 'default' }) {
  const styles = {
    default: 'bg-gray-200',
    primary: 'bg-blue-500 text-white',
  };
  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  );
}

// 7. REFACTOR - Clean up, add types, etc.
```

### Pattern 2: Form Component

```tsx
describe('LoginForm', () => {
  // Start with the happy path
  it('submits email and password', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    });
  });

  // Then add validation tests
  it('shows error when email is invalid', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), '123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  // Test loading state
  it('disables submit button while submitting', async () => {
    const onSubmit = vi.fn(() => new Promise(() => {})); // Never resolves
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });
});
```

### Pattern 3: Component with Data Fetching

```tsx
// Using MSW for API mocking
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('UserList', () => {
  it('displays loading state initially', () => {
    render(<UserList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays users after loading', async () => {
    render(<UserList />);

    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('displays error when API fails', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<UserList />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('displays empty state when no users', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    render(<UserList />);

    expect(await screen.findByText(/no users found/i)).toBeInTheDocument();
  });
});
```

## Custom Hook TDD Patterns

### Pattern 1: Simple State Hook

```tsx
describe('useCounter', () => {
  it('starts with initial value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('defaults to 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('respects minimum value', () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(0); // Doesn't go below min
  });
});

// Implementation
function useCounter(initialValue = 0, { min = -Infinity, max = Infinity } = {}) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(c => Math.min(c + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount(c => Math.max(c - 1, min));
  }, [min]);

  return { count, increment, decrement };
}
```

### Pattern 2: Async Hook

```tsx
describe('useFetch', () => {
  it('returns loading state initially', () => {
    const { result } = renderHook(() => useFetch('/api/data'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('returns data on success', async () => {
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.json({ message: 'Hello' }));
      })
    );

    const { result } = renderHook(() => useFetch('/api/data'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ message: 'Hello' });
    expect(result.current.error).toBeUndefined();
  });

  it('returns error on failure', async () => {
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useFetch('/api/data'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('refetches when url changes', async () => {
    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/api/users' } }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    rerender({ url: '/api/posts' });

    expect(result.current.isLoading).toBe(true);
  });
});
```

### Pattern 3: LocalStorage Hook

```tsx
describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('theme', 'light')
    );

    expect(result.current[0]).toBe('light');
  });

  it('returns stored value from localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));

    const { result } = renderHook(() =>
      useLocalStorage('theme', 'light')
    );

    expect(result.current[0]).toBe('dark');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('theme', 'light')
    );

    act(() => {
      result.current[1]('dark');
    });

    expect(result.current[0]).toBe('dark');
    expect(JSON.parse(localStorage.getItem('theme')!)).toBe('dark');
  });

  it('handles function updater', () => {
    const { result } = renderHook(() =>
      useLocalStorage('count', 0)
    );

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });
});
```

## Integration Test Patterns

### Pattern 1: User Flow

```tsx
describe('Checkout Flow', () => {
  it('completes purchase successfully', async () => {
    // Setup: User has items in cart
    server.use(
      rest.get('/api/cart', (req, res, ctx) => {
        return res(ctx.json({
          items: [{ id: 1, name: 'Product', price: 99, quantity: 1 }],
          total: 99
        }));
      }),
      rest.post('/api/orders', (req, res, ctx) => {
        return res(ctx.json({ orderId: 'ORD-123' }));
      })
    );

    render(<App />, { route: '/checkout' });

    // Step 1: Review cart
    expect(await screen.findByText('Product')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();

    // Step 2: Enter shipping info
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.type(screen.getByLabelText(/address/i), '123 Main St');
    await user.type(screen.getByLabelText(/city/i), 'New York');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 3: Enter payment
    await user.type(screen.getByLabelText(/card number/i), '4242424242424242');
    await user.type(screen.getByLabelText(/expiry/i), '12/25');
    await user.type(screen.getByLabelText(/cvc/i), '123');

    // Step 4: Place order
    await user.click(screen.getByRole('button', { name: /place order/i }));

    // Verify success
    expect(await screen.findByText(/order confirmed/i)).toBeInTheDocument();
    expect(screen.getByText('ORD-123')).toBeInTheDocument();
  });

  it('shows validation errors for invalid card', async () => {
    // ... similar setup ...

    await user.type(screen.getByLabelText(/card number/i), '1234');
    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(screen.getByText(/invalid card number/i)).toBeInTheDocument();
  });
});
```

### Pattern 2: Authentication Flow

```tsx
describe('Authentication', () => {
  it('logs in and redirects to dashboard', async () => {
    server.use(
      rest.post('/api/login', (req, res, ctx) => {
        return res(ctx.json({ user: { id: 1, name: 'John' } }));
      })
    );

    render(<App />, { route: '/login' });

    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Should redirect to dashboard
    expect(await screen.findByText(/welcome, john/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('shows error for invalid credentials', async () => {
    server.use(
      rest.post('/api/login', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
      })
    );

    render(<App />, { route: '/login' });

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login'); // Still on login page
  });

  it('logs out and redirects to login', async () => {
    // Start logged in
    render(<App />, { route: '/dashboard', user: { id: 1, name: 'John' } });

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(await screen.findByText(/sign in/i)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/login');
  });
});
```

## Accessibility TDD Patterns

### Pattern 1: Form Accessibility

```tsx
describe('ContactForm accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('associates labels with inputs', () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');

    const messageInput = screen.getByLabelText(/message/i);
    expect(messageInput.tagName).toBe('TEXTAREA');
  });

  it('shows accessible error messages', async () => {
    render(<ContactForm />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    expect(emailInput).toHaveAccessibleDescription(/required/i);
  });

  it('announces submission result to screen readers', async () => {
    server.use(
      rest.post('/api/contact', (req, res, ctx) => res(ctx.json({ ok: true })))
    );

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/message sent/i);
  });
});
```

### Pattern 2: Modal Accessibility

```tsx
describe('Modal accessibility', () => {
  it('traps focus within modal', async () => {
    render(<Modal isOpen={true} onClose={vi.fn()}>Content</Modal>);

    const closeButton = screen.getByRole('button', { name: /close/i });
    const confirmButton = screen.getByRole('button', { name: /confirm/i });

    // Focus should be trapped
    closeButton.focus();
    await user.tab();
    expect(confirmButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus(); // Wraps back
  });

  it('closes on Escape key', async () => {
    const onClose = vi.fn();
    render(<Modal isOpen={true} onClose={onClose}>Content</Modal>);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Confirm Action">
        Are you sure?
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Confirm Action');
  });

  it('returns focus to trigger on close', async () => {
    function TestComponent() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Open</button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            Content
          </Modal>
        </>
      );
    }

    render(<TestComponent />);

    const openButton = screen.getByRole('button', { name: /open/i });
    await user.click(openButton);

    await user.keyboard('{Escape}');

    expect(openButton).toHaveFocus();
  });
});
```

## Testing Utilities

### Custom Render

```tsx
// test-utils.tsx
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          {children}
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { route?: string }
) {
  if (options?.route) {
    window.history.pushState({}, 'Test page', options.route);
  }

  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
export { customRender as render };
```

### User Event Setup

```tsx
// Always use userEvent over fireEvent
import userEvent from '@testing-library/user-event';

// Setup in test file
const user = userEvent.setup();

// Use in tests
await user.click(button);
await user.type(input, 'text');
await user.keyboard('{Enter}');
await user.tab();
```

### MSW Setup

```tsx
// mocks/handlers.ts
export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json(mockUsers));
  }),
  rest.post('/api/users', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.json({ id: 1, ...body }));
  }),
];

// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// vitest.setup.ts
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## TDD Anti-Patterns to Avoid

### 1. Testing Implementation Details

```tsx
// BAD - Testing internal state
expect(component.state.isLoading).toBe(true);

// GOOD - Testing behavior
expect(screen.getByText(/loading/i)).toBeInTheDocument();
```

### 2. Too Many Mocks

```tsx
// BAD - Mocking everything
jest.mock('./useAuth');
jest.mock('./useCart');
jest.mock('./useProducts');

// GOOD - Use real implementations, mock only boundaries
// Mock only: API calls, timers, browser APIs
```

### 3. Testing Third-Party Code

```tsx
// BAD - Testing React Query works
it('caches data', async () => {
  // This tests React Query, not your code
});

// GOOD - Test YOUR behavior
it('shows cached data while refetching', async () => {
  // Test the user sees data immediately
});
```

### 4. Writing Tests After Code

```tsx
// If you write code first, you'll:
// - Write tests that pass by coincidence
// - Miss edge cases
// - Have tests coupled to implementation
// - Lose the design benefits of TDD

// Always: RED → GREEN → REFACTOR
```
