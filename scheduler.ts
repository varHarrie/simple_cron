import { parseExpression } from "./parse.ts";

export function convertTimezone(
  date: Date,
  timezone: number | string | undefined
) {
  if (timezone === undefined) {
    return date;
  }

  if (typeof timezone === "number") {
    const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utcTime + timezone * 60000);
  }

  const localTime = date.toLocaleString("en-US", { timeZone: timezone });
  return new Date(localTime);
}

export function isMatched(values: number[][], date: Date) {
  return (
    values[0].includes(date.getSeconds()) &&
    values[1].includes(date.getMinutes()) &&
    values[2].includes(date.getHours()) &&
    values[3].includes(date.getDate()) &&
    values[4].includes(date.getMonth() + 1) &&
    values[5].includes(date.getDay())
  );
}

export class Scheduler extends EventTarget {
  #values: number[][];
  #timezone: number | string | undefined;
  #recover: boolean;

  #timer: number | undefined;

  constructor(
    expression: string,
    timezone?: number | string,
    recover?: boolean
  ) {
    super();

    this.#values = parseExpression(expression);
    this.#timezone = timezone;
    this.#recover = recover ?? false;
  }

  start() {
    this.stop();

    let lastTime = performance.now();

    const matchTime = () => {
      const interval = 1000;
      const now = performance.now();
      const missed = Math.floor((now - lastTime) / 1000);

      for (let i = missed; i > 0; i--) {
        const date = convertTimezone(
          new Date(Date.now() - i * interval),
          this.#timezone
        );

        if ((i === 1 || this.#recover) && isMatched(this.#values, date)) {
          this.dispatchEvent(new Event("matched"));
        }
      }

      lastTime = now;
      this.#timer = setTimeout(matchTime, interval);
    };

    matchTime();
  }

  stop() {
    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = undefined;
  }
}
