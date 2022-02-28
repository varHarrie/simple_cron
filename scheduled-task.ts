import { Scheduler } from "./scheduler.ts";

export type ScheduledTaskOptions = {
  /** If the created task is scheduled */
  scheduled?: boolean;
  /** Should handler runs after creation */
  immediate?: boolean;
  /** Should recover missed period */
  recover?: boolean;
  /** Timezone offset minutes */
  timezone?: number;
};

export class ScheduledTask {
  #scheduler: Scheduler;

  constructor(
    expression: string,
    handler: () => void,
    options?: ScheduledTaskOptions
  ) {
    this.#scheduler = new Scheduler(
      expression,
      options?.timezone,
      options?.recover
    );
    this.#scheduler.addEventListener("matched", handler);

    if (options?.scheduled !== false) {
      this.start();
    }

    if (options?.immediate) {
      handler();
    }
  }

  start() {
    this.#scheduler.start();
  }

  stop() {
    this.#scheduler.stop();
  }
}
