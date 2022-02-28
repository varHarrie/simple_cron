import { assertEquals } from "https://deno.land/std@0.127.0/testing/asserts.ts";
import {
  convertMonth,
  convertWeekday,
  longMonths,
  longWeekdays,
  parseExpression,
  parseValues,
  shortMonths,
  shortWeekdays,
} from "./parse.ts";
import { createRange } from "./utils.ts";

Deno.test("scheduler", async (t) => {
  await t.step("convertMonth", () => {
    assertEquals(convertMonth("march", longMonths), "3");
    assertEquals(convertMonth("may,june,december", longMonths), "5,6,12");
    assertEquals(convertMonth("may,6,december", longMonths), "5,6,12");

    assertEquals(convertMonth("mar", shortMonths), "3");
    assertEquals(convertMonth("may,jun,dec", shortMonths), "5,6,12");
    assertEquals(convertMonth("may,6,dec", shortMonths), "5,6,12");
  });

  await t.step("convertWeekday", () => {
    assertEquals(convertWeekday("tuesday", longWeekdays), "2");
    assertEquals(
      convertWeekday("sunday,wednesday,friday", longWeekdays),
      "0,3,5"
    );
    assertEquals(convertWeekday("sunday,3,friday", longWeekdays), "0,3,5");

    assertEquals(convertWeekday("tue", shortWeekdays), "2");
    assertEquals(convertWeekday("sun,wed,fri", shortWeekdays), "0,3,5");
    assertEquals(convertWeekday("sun,3,fri", shortWeekdays), "0,3,5");
  });

  await t.step("parseValues.asterisk", () => {
    assertEquals(parseValues("*", 0), createRange(0, 59));
    assertEquals(parseValues("*", 1), createRange(0, 59));
    assertEquals(parseValues("*", 2), createRange(0, 23));
    assertEquals(parseValues("*", 3), createRange(1, 31));
    assertEquals(parseValues("*", 4), createRange(1, 12));
    assertEquals(parseValues("*", 5), createRange(0, 6));
  });

  await t.step("parseValues.range", () => {
    assertEquals(parseValues("0-5", 0), createRange(0, 5));
    assertEquals(parseValues("5-10", 1), createRange(5, 10));
  });

  await t.step("parseValues.step", () => {
    assertEquals(parseValues("5-10/2", 0), [5, 7, 9]);
    assertEquals(parseValues("5/2", 4), [5, 7, 9, 11]);
    assertEquals(parseValues("*/2", 4), [1, 3, 5, 7, 9, 11]);
    assertEquals(parseValues("0/2", 5), [0, 2, 4, 6]);
  });

  await t.step("parseValues.value", () => {
    assertEquals(parseValues("0", 0), [0]);
    assertEquals(parseValues("5", 0), [5]);
  });

  await t.step("parseExpression", () => {
    assertEquals(parseExpression("0 0 0 0 0"), [[0], [0], [0], [0], [0], [0]]);

    assertEquals(parseExpression("0 0 0 0 0 0"), [
      [0],
      [0],
      [0],
      [0],
      [0],
      [0],
    ]);

    assertEquals(parseExpression("0 0 0 0 january,feb sunday,mon"), [
      [0],
      [0],
      [0],
      [0],
      [1, 2],
      [0, 1],
    ]);

    assertEquals(parseExpression("* * * * * *"), [
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59,
      ],
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59,
      ],
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
      [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      [0, 1, 2, 3, 4, 5, 6],
    ]);

    assertEquals(parseExpression("1-5 2-6 3-7 0 0 0"), [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 6],
      [3, 4, 5, 6, 7],
      [0],
      [0],
      [0],
    ]);

    assertEquals(parseExpression("0-10/2 2-8/3 2,3,4,5,6,7,8/3 */5 0 0"), [
      [0, 2, 4, 6, 8, 10],
      [2, 5, 8],
      [2, 3, 4, 5, 6, 7, 8, 11, 14, 17, 20, 23],
      [1, 6, 11, 16, 21, 26, 31],
      [0],
      [0],
    ]);
  });
});
