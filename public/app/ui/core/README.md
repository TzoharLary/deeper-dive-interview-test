# Vanilla Component Architecture

This project uses a lightweight, class-based component system to manage UI state and DOM updates without external frameworks.

## Core Concepts

### `Component<P, S>`
The base class for all UI components.
- **Props (`P`)**: Immutable configuration passed from parent.
- **State (`S`)**: Mutable internal state.
- **Lifecycle**:
  - `mount()`: Initial render. Calls `onMount()`.
  - `update()`: Called when state changes. Default implementation re-renders, but can be overridden for smart patching.
  - `unmount()`: Cleanup. Calls `onUnmount()`.

### State Management
- Components subscribe to the `PublisherStore`.
- Store updates trigger `setState()`.
- `setState()` triggers `update()`.

### Smart Updates
To avoid losing focus or scroll position, components like `GeneralInfo` and `PageList` override `update()` to patch the DOM instead of destroying it.

## Example

```typescript
class MyComponent extends Component<Props, State> {
  protected getInitialState() { return { count: 0 }; }

  render() {
    this.container.innerHTML = `Count: ${this.state.count}`;
  }
  
  // Optional: Smart update
  protected update() {
    this.container.firstChild.textContent = `Count: ${this.state.count}`;
  }
}
```
