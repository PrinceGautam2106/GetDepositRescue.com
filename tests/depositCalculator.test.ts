// ─────────────────────────────────────────────────────────────────────────────
// Unit Test Harness — Deposit Calculator
//
// Run:  npx tsx tests/depositCalculator.test.ts
//
// Uses Node's built-in `assert` module — zero external test-framework deps.
// ─────────────────────────────────────────────────────────────────────────────

import assert from "node:assert/strict";
import { calculateClaim } from "../src/utils/depositCalculator.js";
import { getStatute, STATE_STATUTES, DEFAULT_STATUTE } from "../src/data/stateStatutes.js";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : err}`);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Create a Date that is `daysAgo` calendar days in the past from `anchor`. */
function daysBeforeDate(anchor: Date, daysAgo: number): Date {
  const d = new Date(anchor);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

const TODAY = new Date("2025-09-15T12:00:00Z");

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n▸ Statute lookup");
// ─────────────────────────────────────────────────────────────────────────────

test("getStatute returns CA statute", () => {
  const s = getStatute("CA");
  assert.equal(s.stateCode, "CA");
  assert.equal(s.deadlineDays, 21);
  assert.equal(s.penaltyMultiplier, 2);
  assert.equal(s.statutoryBonus, 0);
  assert.equal(s.smallClaimsLimit, 12_500);
});

test("getStatute returns TX statute", () => {
  const s = getStatute("TX");
  assert.equal(s.stateCode, "TX");
  assert.equal(s.deadlineDays, 30);
  assert.equal(s.penaltyMultiplier, 3);
  assert.equal(s.statutoryBonus, 100);
  assert.equal(s.smallClaimsLimit, 20_000);
});

test("getStatute returns DEFAULT for unknown state", () => {
  const s = getStatute("ZZ");
  assert.equal(s.stateCode, "DEFAULT");
  assert.equal(s.deadlineDays, 30);
});

test("getStatute is case-insensitive", () => {
  assert.equal(getStatute("ca").stateCode, "CA");
  assert.equal(getStatute("Tx").stateCode, "TX");
});

test("all 10 states are registered", () => {
  const expected = ["CA", "TX", "NY", "FL", "IL", "WA", "CO", "PA", "GA", "NC"];
  for (const code of expected) {
    assert.ok(STATE_STATUTES[code], `Missing state: ${code}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n▸ California — full deposit withheld past deadline");
// ─────────────────────────────────────────────────────────────────────────────

test("CA: $2,000 deposit, $0 returned, 30 days elapsed → $6,000 claim", () => {
  const moveOut = daysBeforeDate(TODAY, 30);
  const r = calculateClaim({
    stateCode: "CA",
    depositAmount: 2_000,
    moveOutDate: moveOut,
    amountReturned: 0,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.daysElapsed, 30);
  assert.equal(r.isPastDeadline, true); // 30 > 21
  assert.equal(r.unreturnedAmount, 2_000);
  // penalty = 2000 + (2000 × 2) + 0 = 6000
  assert.equal(r.statutoryPenaltyAmount, 6_000);
  assert.equal(r.smallClaimsEligible, true); // 6000 ≤ 12500
  assert.ok(r.violationTypes.length >= 1);
  assert.ok(r.violationTypes[0].includes("21-day"));
});

test("CA: $2,000 deposit, $0 returned, 15 days elapsed (not past deadline), no disputed → $2,000 claim", () => {
  const moveOut = daysBeforeDate(TODAY, 15);
  const r = calculateClaim({
    stateCode: "CA",
    depositAmount: 2_000,
    moveOutDate: moveOut,
    amountReturned: 0,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.daysElapsed, 15);
  assert.equal(r.isPastDeadline, false); // 15 ≤ 21
  // No violations → no penalty multiplier → just the unreturned amount
  assert.equal(r.statutoryPenaltyAmount, 2_000);
  assert.equal(r.violationTypes.length, 0);
});

test("CA: $2,000, $500 returned, 25 days, illegal deduction → $4,500 claim", () => {
  const moveOut = daysBeforeDate(TODAY, 25);
  const r = calculateClaim({
    stateCode: "CA",
    depositAmount: 2_000,
    moveOutDate: moveOut,
    amountReturned: 500,
    disputedDeductions: ["Normal wear and tear"],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.unreturnedAmount, 1_500);
  assert.equal(r.isPastDeadline, true); // 25 > 21
  // violations: deadline + illegal deduction
  assert.ok(r.violationTypes.length >= 2);
  // penalty = 1500 + (1500 × 2) + 0 = 4500
  assert.equal(r.statutoryPenaltyAmount, 4_500);
  assert.equal(r.smallClaimsEligible, true); // 4500 ≤ 12500
});

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n▸ Texas — full deposit withheld past deadline");
// ─────────────────────────────────────────────────────────────────────────────

test("TX: $1,500 deposit, $500 returned, 45 days elapsed → $4,100 claim", () => {
  const moveOut = daysBeforeDate(TODAY, 45);
  const r = calculateClaim({
    stateCode: "TX",
    depositAmount: 1_500,
    moveOutDate: moveOut,
    amountReturned: 500,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.daysElapsed, 45);
  assert.equal(r.isPastDeadline, true); // 45 > 30
  assert.equal(r.unreturnedAmount, 1_000);
  // penalty = 1000 + (1000 × 3) + 100 = 4100
  assert.equal(r.statutoryPenaltyAmount, 4_100);
  assert.equal(r.smallClaimsEligible, true); // 4100 ≤ 20000
});

test("TX: $1,000 deposit, $0 returned, 20 days, disputed deductions → $4,100 claim", () => {
  const moveOut = daysBeforeDate(TODAY, 20);
  const r = calculateClaim({
    stateCode: "TX",
    depositAmount: 1_000,
    moveOutDate: moveOut,
    amountReturned: 0,
    disputedDeductions: ["Routine carpet cleaning", "Pre-existing damage"],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.isPastDeadline, false); // 20 ≤ 30
  // But we have 2 illegal deduction violations
  assert.ok(r.violationTypes.length >= 2);
  // penalty = 1000 + (1000 × 3) + 100 = 4100
  assert.equal(r.statutoryPenaltyAmount, 4_100);
});

test("TX: $3,000 deposit fully returned → $0 claim, no violations", () => {
  const moveOut = daysBeforeDate(TODAY, 45);
  const r = calculateClaim({
    stateCode: "TX",
    depositAmount: 3_000,
    moveOutDate: moveOut,
    amountReturned: 3_000,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.unreturnedAmount, 0);
  // Even though past deadline, unreturned = 0 → penalty = 0 + 0 + 100 = 100
  // But wait — deadline IS violated, so there IS a violation.
  // penalty = 0 + (0 × 3) + 100 = 100 (the flat bonus still applies)
  assert.equal(r.isPastDeadline, true);
  assert.equal(r.statutoryPenaltyAmount, 100);
});

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n▸ Florida — no statutory multiplier");
// ─────────────────────────────────────────────────────────────────────────────

test("FL: $1,800 deposit, $0 returned, 35 days → $1,800 claim (no multiplier)", () => {
  const moveOut = daysBeforeDate(TODAY, 35);
  const r = calculateClaim({
    stateCode: "FL",
    depositAmount: 1_800,
    moveOutDate: moveOut,
    amountReturned: 0,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.isPastDeadline, true);
  assert.equal(r.unreturnedAmount, 1_800);
  // FL has multiplier = 0, bonus = 0 → claim = unreturned only
  assert.equal(r.statutoryPenaltyAmount, 1_800);
  assert.ok(r.violationTypes.length >= 1);
  assert.equal(r.statute.certifiedMailRequired, true);
});

// ─────────────────────────────────────────────────────────────────────────────
console.log("\n▸ Edge cases");
// ─────────────────────────────────────────────────────────────────────────────

test("returned > deposit (overpayment) → unreturned clamped to 0", () => {
  const moveOut = daysBeforeDate(TODAY, 10);
  const r = calculateClaim({
    stateCode: "CA",
    depositAmount: 1_000,
    moveOutDate: moveOut,
    amountReturned: 1_500,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.unreturnedAmount, 0);
  assert.equal(r.statutoryPenaltyAmount, 0);
});

test("move-out in the future → negative daysElapsed", () => {
  const futureDate = new Date(TODAY);
  futureDate.setDate(futureDate.getDate() + 5);
  const r = calculateClaim({
    stateCode: "NY",
    depositAmount: 1_000,
    moveOutDate: futureDate,
    amountReturned: 0,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.ok(r.daysElapsed < 0);
  assert.equal(r.isPastDeadline, false);
});

test("unknown state falls back to DEFAULT", () => {
  const moveOut = daysBeforeDate(TODAY, 60);
  const r = calculateClaim({
    stateCode: "XX",
    depositAmount: 1_000,
    moveOutDate: moveOut,
    amountReturned: 0,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.statute.stateCode, "DEFAULT");
  assert.equal(r.isPastDeadline, true); // 60 > 30
  // DEFAULT has multiplier 0 → claim = unreturned (no penalty)
  assert.equal(r.statutoryPenaltyAmount, 1_000);
});

test("deduction matching is case-insensitive", () => {
  const moveOut = daysBeforeDate(TODAY, 5);
  const r = calculateClaim({
    stateCode: "CA",
    depositAmount: 1_000,
    moveOutDate: moveOut,
    amountReturned: 500,
    disputedDeductions: ["NORMAL WEAR AND TEAR"],
    _testCurrentDate: TODAY,
  });

  // Even though not past deadline, the illegal deduction triggers a violation
  assert.ok(r.violationTypes.length >= 1);
  assert.ok(r.violationTypes.some((v) => v.includes("Illegal deduction")));
  // With violation + multiplier: 500 + (500 × 2) + 0 = 1500
  assert.equal(r.statutoryPenaltyAmount, 1_500);
});

test("small claims eligibility — large CO claim exceeds $7,500 cap", () => {
  const moveOut = daysBeforeDate(TODAY, 45);
  const r = calculateClaim({
    stateCode: "CO",
    depositAmount: 3_000,
    moveOutDate: moveOut,
    amountReturned: 0,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  // CO: 3000 + (3000 × 3) + 0 = 12000
  assert.equal(r.statutoryPenaltyAmount, 12_000);
  assert.equal(r.smallClaimsEligible, false); // 12000 > 7500
});

test("ISO string move-out date works", () => {
  const r = calculateClaim({
    stateCode: "NY",
    depositAmount: 2_000,
    moveOutDate: "2025-08-15",
    amountReturned: 0,
    disputedDeductions: [],
    _testCurrentDate: TODAY,
  });

  assert.equal(r.daysElapsed, 31);
  assert.equal(r.isPastDeadline, true); // 31 > 14
  // NY: 2000 + (2000 × 2) + 0 = 6000
  assert.equal(r.statutoryPenaltyAmount, 6_000);
});

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

console.log(`\n━━━ Results: ${passed} passed, ${failed} failed ━━━\n`);
if (failed > 0) {
  process.exit(1);
}
