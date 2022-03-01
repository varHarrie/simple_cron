import { assertEquals } from "https://deno.land/std@0.127.0/testing/asserts.ts";
import { createRange, toInteger } from "./utils.ts";

Deno.test("utils", async (t) => {
  await t.step("createRange", () => {
    assertEquals(createRange(1, 5), [1, 2, 3, 4, 5]);
    assertEquals(createRange(2, 8), [2, 3, 4, 5, 6, 7, 8]);
    assertEquals(createRange(5, 1), [1, 2, 3, 4, 5]);
    assertEquals(createRange(8, 2), [2, 3, 4, 5, 6, 7, 8]);
  });

  await t.step("toInteger", () => {
    assertEquals(toInteger(5), 5);
    assertEquals(toInteger("5"), 5);
  });
});
