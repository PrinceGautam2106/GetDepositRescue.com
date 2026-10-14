// ─────────────────────────────────────────────────────────────────────────────
// Deposit Recovery Calculation Engine
//
// Pure, side-effect-free functions.  Every computation is deterministic when
// `_testCurrentDate` is supplied, making this module fully unit-testable.
// ─────────────────────────────────────────────────────────────────────────────

import {
  type StateStatute,
  getStatute,
} from "../data/stateStatutes";

// ─── Input / Output Types ────────────────────────────────────────────────────

export interface CalculatorInput {
  /** Two-letter USPS state code (e.g. "CA"). */
  stateCode: string;

  /** Total security deposit originally paid, in dollars. */
  depositAmount: number;

  /**
   * Date the tenant vacated the unit (ISO 8601 string or Date object).
   * The statutory clock starts on this date.
   */
  moveOutDate: Date | string;

  /** Dollar amount already returned by the landlord (0 if nothing). */
  amountReturned: number;

  /**
   * Free-text descriptions of deductions the tenant believes are
   * illegitimate (matched against the state's `commonIllegalDeductions`).
   */
  disputedDeductions: string[];

  /**
   * Override "today" for deterministic unit tests.
   * @internal
   */
  _testCurrentDate?: Date;
}

export interface CalculatorResult {
  /** Calendar days elapsed since move-out. */
  daysElapsed: number;

  /** `true` if the landlord has exceeded the statutory return deadline. */
  isPastDeadline: boolean;

  /**
   * Maximum recovery amount the tenant can sue for:
   *   unreturnedAmount + (unreturnedAmount × penaltyMultiplier) + statutoryBonus
   *
   * When no violations are detected the value equals `unreturnedAmount`
   * (no penalty is layered on).
   */
  statutoryPenaltyAmount: number;

  /**
   * Human-readable list of detected violations.
   * Examples:
   *   - "Missed 21-day statutory return deadline (California Civil Code § 1950.5)"
   *   - "Illegal deduction: \"Normal wear and tear\""
   */
  violationTypes: string[];

  /** `true` when `statutoryPenaltyAmount` ≤ the state's small-claims cap. */
  smallClaimsEligible: boolean;

  // ── Supplementary fields (useful for UI rendering) ──────────────────────

  /** Deposit minus whatever was returned (never negative). */
  unreturnedAmount: number;

  /** The resolved statute record used for this calculation. */
  statute: StateStatute;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Whole calendar days between two dates (ignores clock time).
 * Returns a negative number if `to` is before `from`.
 */
function calendarDaysBetween(from: Date, to: Date): number {
  // Normalise to midnight UTC to prevent DST / timezone drift.
  const utcFrom = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const utcTo = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.floor((utcTo - utcFrom) / 86_400_000);
}

/**
 * Case-insensitive containment check.  Returns `true` if `candidate`
 * appears as a substring of any entry in `pool`, or vice-versa.
 */
function matchesIllegalDeduction(
  candidate: string,
  pool: string[],
): boolean {
  const lower = candidate.toLowerCase().trim();
  return pool.some((entry) => {
    const entryLower = entry.toLowerCase();
    return entryLower.includes(lower) || lower.includes(entryLower);
  });
}

// ─── Core Calculator ─────────────────────────────────────────────────────────

/**
 * Calculate the tenant's maximum statutory recovery claim.
 *
 * This is a **pure function** — it reads no global state and produces no
 * side-effects.  Supply `_testCurrentDate` in the input to freeze "today"
 * for unit testing.
 *
 * @example
 * ```ts
 * const result = calculateClaim({
 *   stateCode: "CA",
 *   depositAmount: 2_000,
 *   moveOutDate: "2025-06-01",
 *   amountReturned: 0,
 *   disputedDeductions: ["Normal wear and tear"],
 * });
 * console.log(result.statutoryPenaltyAmount); // up to $6,000
 * ```
 */
export function calculateClaim(input: CalculatorInput): CalculatorResult {
  // ── Resolve statute ────────────────────────────────────────────────────
  const statute = getStatute(input.stateCode);

  // ── Compute elapsed time ───────────────────────────────────────────────
  const today = input._testCurrentDate ?? new Date();
  const moveOut =
    typeof input.moveOutDate === "string"
      ? new Date(input.moveOutDate)
      : input.moveOutDate;

  const daysElapsed = calendarDaysBetween(moveOut, today);
  const isPastDeadline = daysElapsed > statute.deadlineDays;

  // ── Financial base ─────────────────────────────────────────────────────
  const unreturnedAmount = Math.max(
    0,
    input.depositAmount - input.amountReturned,
  );

  // ── Violation detection ────────────────────────────────────────────────
  const violationTypes: string[] = [];

  if (isPastDeadline) {
    violationTypes.push(
      `Missed ${statute.deadlineDays}-day statutory return deadline ` +
        `(${statute.legalCodeCitation})`,
    );
  }

  for (const deduction of input.disputedDeductions) {
    if (matchesIllegalDeduction(deduction, statute.commonIllegalDeductions)) {
      violationTypes.push(`Illegal deduction: "${deduction}"`);
    }
  }

  // ── Penalty calculation ────────────────────────────────────────────────
  // Penalties apply only when at least one violation is detected AND the
  // state provides a statutory multiplier.
  let statutoryPenaltyAmount: number;

  const hasViolations = violationTypes.length > 0;
  const hasMultiplier = statute.penaltyMultiplier > 0;

  if (hasViolations && hasMultiplier) {
    statutoryPenaltyAmount =
      unreturnedAmount +
      unreturnedAmount * statute.penaltyMultiplier +
      statute.statutoryBonus;
  } else if (hasViolations) {
    // Violations exist but the state has no multiplier (e.g. FL, GA, NC).
    // Tenant can still recover the unreturned amount + any flat bonus.
    statutoryPenaltyAmount = unreturnedAmount + statute.statutoryBonus;
  } else {
    // No violations detected — claim is just the unreturned balance.
    statutoryPenaltyAmount = unreturnedAmount;
  }

  // ── Small-claims eligibility ───────────────────────────────────────────
  const smallClaimsEligible =
    statutoryPenaltyAmount <= statute.smallClaimsLimit;

  return {
    daysElapsed,
    isPastDeadline,
    statutoryPenaltyAmount,
    violationTypes,
    smallClaimsEligible,
    unreturnedAmount,
    statute,
  };
}
