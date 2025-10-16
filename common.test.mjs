import { getGreeting } from "./common.mjs";
import { getDaysInMonth } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";

test("Greeting is correct", () => {
  assert.equal(getGreeting(), "Hello");
});

test("January 2025 has 31 days", () => {
  assert.strictEqual(getDaysInMonth(2025, 0), 31);
});

test("February 2025 (no leap year) has 28 days", () => {
  assert.strictEqual(getDaysInMonth(2025, 1), 28);
});

test("February 2024 (leap year) has 29 days", () => {
  assert.strictEqual(getDaysInMonth(2024, 1), 29);
});

test("April 2030 has 30 days", () => {
  assert.strictEqual(getDaysInMonth(2030, 3), 30);
});
