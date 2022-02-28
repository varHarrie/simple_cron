import { createRange, toInteger } from "./utils.ts";

export const longMonths = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const shortMonths = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const longWeekdays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const shortWeekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function convertMonth(element: string, names: string[]) {
  names.forEach((name, index) => {
    element = element.toLowerCase().replaceAll(name, (index + 1).toString());
  });

  return element;
}

export function convertWeekday(element: string, names: string[]) {
  names.forEach((name, index) => {
    element = element.toLowerCase().replaceAll(name, index.toString());
  });

  return element;
}

const ranges = [
  [0, 59],
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 6],
];

const rangeReg = /^(\d+)-(\d+)$/;

const stepReg = /^(\d+|\*)\/(\d+)|(\d+)-(\d+)\/(\d+)$/;

export function parseValues(element: string, index: number) {
  const numbers = new Set<number>();

  element.split(",").forEach((fragment) => {
    // Asterisk to range
    if (fragment === "*") {
      createRange(ranges[index][0], ranges[index][1]).forEach(
        numbers.add,
        numbers
      );
      return;
    }

    // Parse range
    const rangeMatch = fragment.match(rangeReg);
    if (rangeMatch) {
      const [, n, m] = rangeMatch;
      createRange(parseInt(n), parseInt(m)).forEach(numbers.add, numbers);
      return;
    }

    // Parse step
    const stepMatch = fragment.match(stepReg);
    if (stepMatch) {
      const n = toInteger(
        stepMatch[3] ?? (stepMatch[1] !== "*" ? stepMatch[1] : ranges[index][0])
      );
      const m = toInteger(stepMatch[4] ?? ranges[index][1]);

      const step = stepMatch[2]
        ? parseInt(stepMatch[2])
        : parseInt(stepMatch[5]);

      createRange(n, m).forEach((num, _, list) => {
        if ((num - list[0]) % step === 0) {
          numbers.add(num);
        }
      });

      return;
    }

    // Parse single value
    const num = parseInt(fragment);
    if (Number.isInteger(num)) {
      numbers.add(num);
    }
  });

  return Array.from(numbers);
}

export function parseExpression(expression: string) {
  const pattern = expression.split(" ");
  if (pattern.length === 5) pattern.push("0");

  // Month name to integer
  pattern[4] = convertMonth(pattern[4], longMonths);
  pattern[4] = convertMonth(pattern[4], shortMonths);

  // Weekday to integer
  pattern[5] = pattern[5].replaceAll("7", "0");
  pattern[5] = convertWeekday(pattern[5], longWeekdays);
  pattern[5] = convertWeekday(pattern[5], shortWeekdays);

  // parse values
  return pattern.map((el, i) => parseValues(el, i));
}
