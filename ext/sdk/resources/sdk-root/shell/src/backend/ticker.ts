export class Ticker {
  private microtask: (() => void) | void;
  private microtaskScheduled = false;

  whenTickEnds(fn: () => void) {
    this.microtask = fn;

    if (!this.microtaskScheduled) {
      this.microtaskScheduled = true;

      Promise.resolve().then(() => {
        this.microtaskScheduled = false;

        if (this.microtask) {
          this.microtask();
        }
      });
    }
  }
}
