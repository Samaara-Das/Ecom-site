# Frontend Debugging Playbook

Systematic approaches to common frontend debugging scenarios.

## The Universal Frontend Debugging Framework

### Step 1: Reproduce

Before anything else, reliably reproduce the bug.

```
Questions to answer:
- Can I reproduce it consistently?
- Does it happen in all browsers?
- Does it happen on all devices/viewports?
- Does it happen in incognito mode?
- What are the exact steps to trigger it?
- Does it happen in development and production?
```

If you cannot reproduce it, gather more information before proceeding.

### Step 2: Isolate

Narrow down where the bug lives.

```
Frontend isolation checklist:
1. Browser console errors?
2. Network tab - failed requests?
3. React DevTools - unexpected state?
4. Elements panel - wrong DOM structure?
5. Styles panel - CSS conflicts?
6. Which component is affected?
7. Which user interaction triggers it?
```

### Step 3: Hypothesize and Test

Form a specific hypothesis, test it.

```
Bad hypothesis: "Something is wrong with the styling"
Good hypothesis: "The modal z-index is lower than the header because
                  the modal is in a different stacking context"

Test ONE thing at a time. Change one variable, observe result.
```

### Step 4: Fix and Verify

Apply fix, verify it works, ensure no regressions.

```
Checklist:
[ ] Fix addresses root cause, not symptom
[ ] Tested in all affected browsers
[ ] Tested on mobile viewport
[ ] No visual regression elsewhere
[ ] Added test to prevent recurrence
```

---

## Scenario-Specific Playbooks

### Blank Screen / White Screen of Death

```
Step 1: Check browser console
- Look for red errors
- Note the file and line number
- Read the full error message

Step 2: Common causes
[ ] JavaScript syntax error preventing render
[ ] Missing error boundary catching crash
[ ] Component throwing during render
[ ] Missing required prop
[ ] Undefined access (x.y when x is undefined)

Step 3: Quick fixes
// Add error boundary to catch render errors
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}

Step 4: Debug approach
- Comment out components until screen renders
- Binary search: remove half the code, see if it renders
- Add console.log at component top to trace render
```

### Hydration Mismatch (SSR/SSG)

```
Step 1: Identify the mismatch
- Console shows: "Text content did not match"
- Or: "Expected server HTML to contain..."

Step 2: Common causes
[ ] Using `Date.now()` or `Math.random()` in render
[ ] Browser-only APIs in initial render (window, localStorage)
[ ] Different data on server vs client
[ ] Extensions modifying DOM

Step 3: Fix patterns

// Bad: Uses browser API during SSR
function Component() {
  const width = window.innerWidth; // Error on server!
  return <div style={{ width }} />;
}

// Good: Check for browser environment
function Component() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  return <div style={{ width: width || '100%' }} />;
}

// Good: Use dynamic import with ssr: false (Next.js)
const BrowserOnlyComponent = dynamic(
  () => import('./BrowserOnly'),
  { ssr: false }
);

Step 4: Debug approach
- Disable JS in browser, compare HTML
- Check if any data differs between server/client
- Look for date/time/locale formatting differences
```

### Component Not Updating / Stale State

```
Step 1: Verify state is changing
- Add console.log to see state values
- Use React DevTools to inspect state
- Check if component is actually re-rendering

Step 2: Common causes
[ ] Stale closure (callback references old state)
[ ] Missing dependency in useEffect/useCallback
[ ] Mutating state instead of creating new object
[ ] Key prop not changing when data changes

Step 3: Fix patterns

// Bad: Stale closure
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // Always uses initial count!
    }, 1000);
    return () => clearInterval(id);
  }, []); // Missing count dependency
}

// Good: Use functional update
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1); // Always uses latest
  }, 1000);
  return () => clearInterval(id);
}, []);

// Bad: Mutating state
const [items, setItems] = useState([1, 2, 3]);
items.push(4); // Mutation!
setItems(items); // Same reference, no update

// Good: Create new array
setItems([...items, 4]);

Step 4: Force re-render to test
- Change key prop to force remount
- Use React DevTools to trigger state change
```

### CSS Not Applying / Wrong Styles

```
Step 1: Inspect with DevTools
- Select element in Elements panel
- Check Styles panel for the rule
- Look for strikethrough (overridden) styles
- Check Computed tab for final values

Step 2: Common causes
[ ] Specificity conflict (another rule wins)
[ ] Selector not matching element
[ ] Style applied to wrong element
[ ] CSS not loaded (check Network tab)
[ ] Typo in class name
[ ] Tailwind class not included in content paths

Step 3: Specificity debugging
// Check specificity order (higher wins):
// 1. !important
// 2. Inline styles
// 3. IDs (#id)
// 4. Classes, attributes, pseudo-classes (.class, [attr], :hover)
// 5. Elements, pseudo-elements (div, ::before)

// Quick fix: be more specific
.container .card .title { } // More specific
.title { } // Less specific

Step 4: Tailwind-specific issues
// Check tailwind.config.js content paths
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Make sure your files are included
  ],
}

// Check for conflicting classes
<div className="text-red-500 text-blue-500" /> // Last one wins
```

### Z-Index Not Working

```
Step 1: Understand stacking contexts
- Each stacking context is independent
- Z-index only works within same context
- These create new stacking context:
  - position: fixed/sticky
  - opacity < 1
  - transform, filter, perspective
  - will-change: transform

Step 2: Debug approach
// Find parent creating stacking context
// In DevTools console:
let el = document.querySelector('.problem-element');
while (el) {
  const style = getComputedStyle(el);
  if (style.position !== 'static' ||
      style.opacity !== '1' ||
      style.transform !== 'none') {
    console.log('Stacking context:', el);
  }
  el = el.parentElement;
}

Step 3: Fix patterns
// Bad: Modal inside sidebar with z-index
<Sidebar style={{ zIndex: 10, position: 'relative' }}>
  <Modal style={{ zIndex: 9999 }} /> // Still under sidebar!
</Sidebar>

// Good: Modal at body level (portal)
<Sidebar style={{ zIndex: 10 }}>
  <ModalTrigger />
</Sidebar>
{createPortal(<Modal style={{ zIndex: 9999 }} />, document.body)}
```

### Layout Shift (CLS Issues)

```
Step 1: Identify shifting elements
- Use Lighthouse to measure CLS
- Use Layout Shift regions in DevTools Performance
- Watch for content jumping on load

Step 2: Common causes
[ ] Images without width/height
[ ] Fonts loading and changing text size
[ ] Dynamic content inserted above fold
[ ] Ads or embeds loading late
[ ] Animations using top/left instead of transform

Step 3: Fix patterns

// Bad: Image without dimensions
<img src="/hero.jpg" alt="Hero" />

// Good: Explicit dimensions
<img src="/hero.jpg" alt="Hero" width={1200} height={600} />

// Good: Aspect ratio box
<div style={{ aspectRatio: '16/9' }}>
  <img src="/hero.jpg" alt="Hero" style={{ width: '100%' }} />
</div>

// Bad: Animation with layout properties
@keyframes slideIn {
  from { left: -100px; }
  to { left: 0; }
}

// Good: Animation with transform
@keyframes slideIn {
  from { transform: translateX(-100px); }
  to { transform: translateX(0); }
}

Step 4: Reserve space for dynamic content
// Skeleton loader with fixed height
<div style={{ minHeight: 200 }}>
  {loading ? <Skeleton /> : <Content />}
</div>
```

### Performance Issues / Slow Rendering

```
Step 1: Profile with DevTools
- Open Performance tab
- Record user interaction
- Look for long tasks (> 50ms)
- Check flame chart for bottlenecks

Step 2: React-specific profiling
- Use React DevTools Profiler
- Record interaction
- Look for:
  - Components rendering too often
  - Long render times
  - Wasted renders (no visual change)

Step 3: Common causes and fixes

// Unnecessary re-renders
// Use React.memo for expensive components
const ExpensiveList = React.memo(({ items }) => {
  return items.map(item => <Item key={item.id} {...item} />);
});

// Missing key or wrong key
// Bad: Using index as key
{items.map((item, i) => <Item key={i} {...item} />)}

// Good: Stable unique key
{items.map(item => <Item key={item.id} {...item} />)}

// Expensive calculation on every render
// Bad:
function Component({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
  return <List items={sorted} />;
}

// Good:
function Component({ items }) {
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );
  return <List items={sorted} />;
}

Step 4: Bundle size issues
# Analyze bundle
npx vite-bundle-visualizer
# or
npx @next/bundle-analyzer

# Look for:
- Large dependencies
- Duplicate code
- Unneeded polyfills
```

### Forms Not Submitting / Validation Issues

```
Step 1: Check form structure
- Is button type="submit"?
- Is form element present?
- Is onSubmit handler attached to form?

Step 2: Common causes
[ ] Button not inside form
[ ] Button type is "button" not "submit"
[ ] Event.preventDefault() blocking submission
[ ] Validation failing silently
[ ] Form submitted but no visual feedback

Step 3: Debug approach
<form onSubmit={(e) => {
  console.log('Form submitted');
  console.log('Form data:', new FormData(e.target));
  e.preventDefault(); // For testing
}}>
  <input name="email" />
  <button type="submit">Submit</button>
</form>

Step 4: React Hook Form debugging
const { handleSubmit, formState: { errors, isSubmitting } } = useForm();

// Log all errors
console.log('Form errors:', errors);

// Check if submitting
console.log('Is submitting:', isSubmitting);

// Validate on change to see issues immediately
useForm({ mode: 'onChange' });
```

### API Data Not Showing

```
Step 1: Check Network tab
- Is request being made?
- What status code?
- What does response contain?
- Are request headers correct?

Step 2: Debug data flow
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    console.log('Fetching users...');
    const res = await fetch('/api/users');
    console.log('Response status:', res.status);
    const json = await res.json();
    console.log('Response data:', json);
    return json;
  }
});

console.log('Query state:', { data, isLoading, error });

Step 3: Common causes
[ ] CORS blocking request
[ ] Wrong API URL (check environment)
[ ] Auth token not being sent
[ ] Response format different than expected
[ ] Cache returning stale data

Step 4: CORS debugging
// Check if CORS error in console
// If so, the issue is server-side

// Verify request headers are being sent
fetch('/api/users', {
  credentials: 'include', // For cookies
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Mobile-Specific Issues

```
Step 1: Reproduce on mobile
- Use real device if possible
- Chrome DevTools device emulation
- Test both iOS Safari and Android Chrome

Step 2: Common mobile issues
[ ] Viewport not set correctly
[ ] Touch targets too small (< 44px)
[ ] Hover styles causing issues
[ ] Fixed positioning breaking
[ ] Safe area not respected (notch)
[ ] Keyboard covering inputs

Step 3: Fix patterns

// Viewport meta tag (required)
<meta name="viewport" content="width=device-width, initial-scale=1" />

// Handle iOS safe areas
.container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

// Touch-friendly targets
.button {
  min-height: 44px;
  min-width: 44px;
}

// Handle hover on touch devices
@media (hover: hover) {
  .button:hover {
    background: blue;
  }
}

// Fix iOS input zoom
input, select, textarea {
  font-size: 16px; // Prevents zoom on iOS
}
```

---

## Quick Debug Commands

### Browser Console

```javascript
// Find element causing horizontal scroll
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > document.documentElement.clientWidth) {
    console.log('Overflow:', el);
  }
});

// Check all event listeners on element
getEventListeners(document.querySelector('.button'));

// Monitor all events on element
monitorEvents(document.querySelector('.button'));

// Find elements by text content
$$('*').filter(el => el.textContent.includes('search text'));

// Take screenshot of element
const el = document.querySelector('.component');
const { x, y, width, height } = el.getBoundingClientRect();
// Use screenshot capture in DevTools

// Check computed styles
getComputedStyle(document.querySelector('.element'));
```

### React DevTools

```
1. Components tab:
   - Search for component by name
   - Click component to see props/state
   - Edit props/state to test changes

2. Profiler tab:
   - Record interactions
   - See render times
   - Find unnecessary renders

3. Settings:
   - Enable "Highlight updates when components render"
   - Filter by component name
```

### Performance

```javascript
// Measure render time
console.time('render');
// ... render happens
console.timeEnd('render');

// Check FPS
const fps = new class {
  constructor() {
    this.frames = 0;
    this.lastTime = performance.now();
    requestAnimationFrame(() => this.tick());
  }
  tick() {
    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      console.log('FPS:', this.frames);
      this.frames = 0;
      this.lastTime = now;
    }
    requestAnimationFrame(() => this.tick());
  }
};

// Log long tasks
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('Long task:', entry.duration, 'ms');
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

---

## Debugging Mindset for Frontend

1. **Open DevTools first**: Console and Network tabs reveal 80% of issues
2. **Isolate the layer**: Is it CSS, JS, data, or browser-specific?
3. **Check the obvious**: Is the class name spelled right? Is the element visible?
4. **Binary search**: Comment out half, see if issue persists
5. **Compare environments**: Works locally but not prod? Check build/env
6. **Test incognito**: Extensions cause mysterious bugs
7. **Check mobile early**: Don't wait until the end
