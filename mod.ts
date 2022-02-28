import { ScheduledTask, ScheduledTaskOptions } from "./scheduled-task.ts";

export function cron(
  expression: string,
  handler: () => void,
  options?: ScheduledTaskOptions
) {
  return new ScheduledTask(expression, handler, options);
}
