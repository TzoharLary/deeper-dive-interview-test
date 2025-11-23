/**
 * Base class for stateful UI components.
 * Implements a simplified React-like lifecycle: mount -> render -> update -> unmount.
 */
export abstract class Component<P = {}, S = {}> {
  protected props: P;
  protected state: S;
  protected container: HTMLElement;
  protected isMounted: boolean = false;

  constructor(container: HTMLElement, props: P) {
    this.container = container;
    this.props = props;
    this.state = this.getInitialState();
  }

  /**
   * Define the initial state of the component.
   */
  protected abstract getInitialState(): S;

  /**
   * Update state and trigger a re-render (or update).
   * Only triggers update if state has shallowly changed (via JSON stringify check for now).
   */
  protected setState(partialState: Partial<S>) {
    const nextState = { ...this.state, ...partialState };
    if (JSON.stringify(this.state) !== JSON.stringify(nextState)) {
      this.state = nextState;
      if (this.isMounted) {
        this.update();
      }
    }
  }

  /**
   * Initial render method. Should create the DOM structure.
   */
  abstract render(): void;

  /**
   * Called when state changes.
   * Default implementation calls render() (destructive).
   * Override this to implement smart DOM patching (non-destructive).
   */
  protected update(): void {
    this.render();
  }

  /**
   * Mounts the component to the container.
   */
  mount() {
    if (!this.isMounted) {
      this.render();
      this.isMounted = true;
      this.onMount();
    }
  }

  /**
   * Unmounts the component and cleans up.
   */
  unmount() {
    if (this.isMounted) {
      this.onUnmount();
      this.isMounted = false;
      this.container.innerHTML = "";
    }
  }

  /**
   * Lifecycle hook called after mount.
   * Use this to set up subscriptions or event listeners.
   */
  protected onMount() {}

  /**
   * Lifecycle hook called before unmount.
   * Use this to clean up subscriptions or timers.
   */
  protected onUnmount() {}
}
