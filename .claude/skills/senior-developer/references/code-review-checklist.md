# Frontend Code Review Checklist

Comprehensive review criteria for maintaining frontend code quality.

## Review Process

### Before Reviewing

```
[ ] Understand the context (read PR description, linked issues)
[ ] Check the scope (is this the right size for a single PR?)
[ ] Pull branch and run locally if needed
[ ] Check it on mobile viewport
```

### During Review

Focus on these areas in order of importance:

1. **Accessibility** - Can all users use it?
2. **Correctness** - Does it work as expected?
3. **Performance** - Is it fast enough?
4. **Maintainability** - Can others understand and modify it?
5. **Style** - Does it follow conventions?

### After Review

```
[ ] Summarize feedback clearly
[ ] Distinguish blockers from suggestions
[ ] Approve, request changes, or comment
[ ] Follow up on addressed feedback
```

---

## Detailed Checklists

### Accessibility (a11y) - BLOCK if missing

```
Semantic HTML:
[ ] Using correct HTML elements (<button>, <nav>, <main>, <article>)
[ ] Not using <div> for interactive elements
[ ] Headings in logical order (h1 → h2 → h3)
[ ] Lists use <ul>/<ol>/<li>

Keyboard:
[ ] All interactive elements are focusable
[ ] Focus order is logical (follows visual order)
[ ] Focus is visible (focus-visible styles)
[ ] No keyboard traps
[ ] Custom components handle Enter/Space/Escape

Screen Readers:
[ ] Images have meaningful alt text (or alt="" if decorative)
[ ] Form inputs have associated labels
[ ] Icon buttons have aria-label
[ ] Dynamic content announced (aria-live regions)
[ ] Modals trap focus and announce properly

Visual:
[ ] Color contrast meets WCAG AA (4.5:1 for text)
[ ] Color is not the only indicator
[ ] Text is resizable without breaking layout
[ ] Touch targets are at least 44x44px
```

### Component Design

```
Structure:
[ ] Single responsibility (component does one thing)
[ ] Props are typed with TypeScript interface
[ ] Reasonable prop count (< 10, prefer composition)
[ ] No prop drilling (use context or composition)
[ ] Component is in the right folder

Composition:
[ ] Using children prop for flexibility
[ ] Compound components for complex UI
[ ] Render props or hooks for shared logic
[ ] Not passing too many boolean props

// Bad: Boolean prop explosion
<Button primary large disabled loading outlined />

// Good: Variant pattern
<Button variant="primary" size="lg" disabled loading />

State:
[ ] Minimal state (derived values computed)
[ ] State at the right level (local vs lifted)
[ ] No redundant state
[ ] Controlled vs uncontrolled is intentional

// Bad: Redundant state
const [items, setItems] = useState([]);
const [count, setCount] = useState(0); // Just use items.length!

// Good: Derive from source of truth
const count = items.length;
```

### React Patterns

```
Hooks:
[ ] useEffect has correct dependencies
[ ] useEffect cleanup function when needed
[ ] useMemo/useCallback only when necessary
[ ] Custom hooks for reusable logic
[ ] No hooks in conditionals or loops

// Bad: Missing cleanup
useEffect(() => {
  const id = setInterval(() => {}, 1000);
  // Missing: return () => clearInterval(id);
}, []);

// Bad: Missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // Should include userId

Rendering:
[ ] Keys are stable and unique (not array index)
[ ] No inline object/array creation in JSX
[ ] Expensive components use React.memo
[ ] Lists are virtualized if long (> 100 items)

// Bad: Inline object creates new reference each render
<Component style={{ color: 'red' }} />

// Good: Define outside or useMemo
const style = useMemo(() => ({ color: 'red' }), []);
<Component style={style} />

Error Handling:
[ ] Error boundaries wrap risky components
[ ] Loading states are handled
[ ] Error states are handled
[ ] Empty states are handled
```

### TypeScript

```
Types:
[ ] No 'any' types (use 'unknown' if needed)
[ ] Props interfaces are defined
[ ] Return types explicit for complex functions
[ ] Utility types used appropriately (Partial, Pick, Omit)

// Bad
const handleClick = (e: any) => { ... }

// Good
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }

Strictness:
[ ] Null checks are proper
[ ] Optional chaining used correctly
[ ] Type guards for narrowing

// Bad: Unsafe access
const name = user.profile.name;

// Good: Safe access
const name = user?.profile?.name ?? 'Unknown';
```

### CSS & Styling

```
Tailwind:
[ ] Using design tokens (colors, spacing from theme)
[ ] Responsive classes in correct order (mobile-first)
[ ] No conflicting utility classes
[ ] Complex styles extracted to component

// Bad: Conflicting classes
<div className="text-red-500 text-blue-500" />

// Bad: Too many classes (extract to component)
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200" />

// Good: Extracted
<Card variant="elevated" />

CSS Modules / CSS:
[ ] No !important (fix specificity instead)
[ ] Using CSS variables for theming
[ ] Animations use transform/opacity (not layout props)
[ ] No magic numbers (use tokens)

Layout:
[ ] Flexbox/Grid used appropriately
[ ] No fixed heights that break with content
[ ] Responsive at all breakpoints
[ ] Safe area insets handled (mobile)
```

### Performance

```
Rendering:
[ ] No unnecessary re-renders (check React DevTools)
[ ] Heavy components lazy loaded
[ ] Expensive calculations memoized
[ ] Virtualization for long lists

// Check: Does parent re-render cause child re-render?
// Fix with React.memo if child doesn't need new props

Bundle:
[ ] No giant dependencies imported whole
[ ] Dynamic imports for route-based splitting
[ ] Images optimized (WebP, correct size)
[ ] Fonts subset and preloaded

// Bad: Imports entire library
import _ from 'lodash';

// Good: Import only what's needed
import debounce from 'lodash/debounce';

Core Web Vitals:
[ ] Images have width/height (prevents CLS)
[ ] No layout shifts on load
[ ] Largest contentful paint is fast
[ ] Interactions feel instant (< 100ms)
```

### Forms

```
Structure:
[ ] Form uses <form> element with onSubmit
[ ] Submit button has type="submit"
[ ] Inputs have proper types (email, tel, number)
[ ] Inputs have autocomplete attributes

Validation:
[ ] Schema-based validation (Zod, Yup)
[ ] Error messages are helpful and specific
[ ] Validation runs on blur or submit (not on every keystroke)
[ ] Server errors are displayed

// Good: React Hook Form + Zod
const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

UX:
[ ] Loading state during submission
[ ] Success feedback after submission
[ ] Form doesn't reset on error
[ ] Labels associated with inputs
[ ] Required fields marked
```

### Data Fetching

```
TanStack Query / SWR:
[ ] Query keys are descriptive and complete
[ ] Error states handled
[ ] Loading states handled
[ ] Proper stale/cache time configured

// Good: Complete query key
useQuery({
  queryKey: ['users', { page, sort, filter }],
  queryFn: () => fetchUsers({ page, sort, filter })
});

Mutations:
[ ] Optimistic updates where appropriate
[ ] Error rollback handled
[ ] Cache invalidation after mutation
[ ] Loading state shown during mutation

Error Handling:
[ ] Network errors caught and displayed
[ ] Retry logic configured
[ ] Fallback UI for failures
```

### Security

```
XSS Prevention:
[ ] No dangerouslySetInnerHTML with user content
[ ] User input sanitized before display
[ ] URLs validated before navigation

// Bad: XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// Good: Sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />

Data:
[ ] No sensitive data in localStorage
[ ] No secrets in client-side code
[ ] API keys in environment variables
[ ] Auth tokens in httpOnly cookies

Links:
[ ] External links have rel="noopener noreferrer"
[ ] No javascript: URLs
[ ] User-generated URLs validated
```

### Testing

```
Component Tests:
[ ] Tests user behavior, not implementation
[ ] Using Testing Library best practices
[ ] Testing accessibility (e.g., getByRole)
[ ] Not testing internal state

// Bad: Testing implementation
expect(component.state.count).toBe(1);

// Good: Testing behavior
await user.click(screen.getByRole('button', { name: /increment/i }));
expect(screen.getByText('Count: 1')).toBeInTheDocument();

Coverage:
[ ] Happy path tested
[ ] Error states tested
[ ] Edge cases tested
[ ] Loading states tested
```

---

## Review Communication

### Comment Types

**Blocker** (must fix):
```
[BLOCKER] This button is not keyboard accessible. Add an onClick handler
and ensure it can be activated with Enter/Space keys, or use a <button> element.
```

**Accessibility Issue** (usually a blocker):
```
[A11Y] Missing alt text on product image. Add descriptive alt text:
alt="Red Nike running shoes, side view"
```

**Performance** (depends on severity):
```
[PERF] This component re-renders on every parent update.
Consider wrapping with React.memo since props rarely change.
```

**Suggestion** (nice to have):
```
[Suggestion] Could extract this into a custom hook for reuse.
Not blocking.
```

**Question**:
```
[Question] What's the expected behavior when the API returns an empty array?
Should we show "No results" or hide the section entirely?
```

**Nitpick**:
```
[Nit] Prefer const over let since this isn't reassigned.
```

### Giving Effective Feedback

**Be specific with examples:**
```
// Instead of
"This could cause performance issues"

// Say
"This useEffect runs on every render because `options` is a new object
each time. Either move the object outside the component or wrap in useMemo:

const options = useMemo(() => ({ limit: 10 }), []);"
```

**Explain accessibility impact:**
```
// Instead of
"Add aria-label"

// Say
"Screen reader users won't know what this button does. Add aria-label:
<button aria-label='Close modal'>×</button>"
```

### Receiving Feedback

```
[ ] Read all comments before responding
[ ] Ask for clarification if needed
[ ] Test suggested changes locally
[ ] Respond to every comment (even "Done")
[ ] Don't take feedback personally
[ ] Learn from the feedback
```

---

## Quick Reference: Red Flags

Stop and request changes if you see:

```
Critical:
[ ] No keyboard support for interactive elements
[ ] Missing alt text on meaningful images
[ ] XSS vulnerability (dangerouslySetInnerHTML with user input)
[ ] Secrets or API keys in client code
[ ] No error boundary around risky components

Serious:
[ ] Missing loading/error states for async operations
[ ] Images without dimensions (causes layout shift)
[ ] useEffect with missing dependencies
[ ] Inline functions in render causing re-renders
[ ] No TypeScript types (using 'any' everywhere)

Worth Mentioning:
[ ] Inconsistent naming conventions
[ ] Overly complex component (should be split)
[ ] Missing tests for critical functionality
[ ] Hardcoded strings that should be i18n
```

---

## Automated Checks

These should be automated (don't review manually):

```
[ ] ESLint passes
[ ] TypeScript compiles
[ ] Prettier formatting
[ ] Tests pass
[ ] Build succeeds
[ ] Bundle size within limits
[ ] Lighthouse scores acceptable
```

Set up CI to catch these automatically so reviews focus on logic and design.
