import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.127.0/testing/asserts.ts";
import { format } from "https://deno.land/std@0.127.0/datetime/mod.ts";
import { convertTimezone, isMatched } from "./scheduler.ts";

Deno.test("scheduler", async (t) => {
  await t.step("convertTimezone(Date, number)", () => {
    const utcTime = Date.UTC(2022, 1, 25, 12, 3, 21, 0);
    const result = convertTimezone(new Date(utcTime), 8 * 60);
    assertEquals(format(result, "yyyy-MM-dd HH:mm:ss"), "2022-02-25 20:03:21");
  });

  await t.step("convertTimezone(Date, string)", () => {
    const utcTime = Date.UTC(2022, 1, 25, 12, 3, 21, 0);
    const result = convertTimezone(new Date(utcTime), "Asia/Shanghai");
    assertEquals(format(result, "yyyy-MM-dd HH:mm:ss"), "2022-02-25 20:03:21");
  });

  await t.step("isMatched", () => {
    assert(
      isMatched(
        [[5], [4], [3], [2], [2], [0, 1, 2, 3, 4, 5, 6]],
        new Date(2022, 1, 2, 3, 4, 5)
      )
    );
  });
});
