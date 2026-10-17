// ─────────────────────────────────────────────────────────────────────────────
// State Statute Data Model & Registry
// Security deposit return deadlines, penalties, and statutory citations for
// all 50 US states + DC, plus a conservative fallback.
//
// ⚠️  This data is provided for informational self-help calculation only.
//     It does NOT constitute legal advice. Always verify against current
//     statute text before relying on any figure in a legal proceeding.
// ─────────────────────────────────────────────────────────────────────────────

/** Bilingual string pair (English / Spanish). */
export interface BilingualText {
  en: string;
  es: string;
}

/**
 * Codified representation of a single US state's security-deposit statute.
 *
 * The penalty formula used by the calculator:
 *   totalClaim = unreturnedAmount
 *              + (unreturnedAmount × penaltyMultiplier)
 *              + statutoryBonus
 */
export interface StateStatute {
  /** URL slug for the state (e.g. "california", "texas"). */
  slug: string;

  /** Two-letter USPS state code (e.g. "CA", "TX"). */
  stateCode: string;

  /** Human-readable state name in both languages. */
  stateName: BilingualText;

  /**
   * Maximum calendar days the landlord has after move-out to return the
   * deposit or provide an itemized deduction statement.
   */
  deadlineDays: number;

  /**
   * Multiplier applied to the wrongfully-withheld amount as statutory
   * damages. 0 = no statutory multiplier (actual damages only).
   */
  penaltyMultiplier: number;

  /**
   * Human-readable statutory penalty description for SEO and metadata
   * (e.g. "2x deposit", "3x withheld amount + $100", "100% refund required").
   */
  penaltyMultiplierText: string;

  /**
   * Flat dollar bonus added on top of the multiplier penalty (e.g. TX
   * adds $100). Most states set this to 0.
   */
  statutoryBonus: number;

  /** Official code citation (e.g. "California Civil Code § 1950.5"). */
  legalCodeCitation: string;

  /** Direct outbound link to official state legislature or attorney general statute page. */
  officialGovUrl: string;

  /** Whether the statute requires the landlord to use certified mail. */
  certifiedMailRequired: boolean;

  /** Whether the landlord must attach actual itemized repair receipts/invoices. */
  itemizedReceiptRequired: boolean;

  /** Dollar cap for the state's small-claims court (individual filer). */
  smallClaimsLimit: number;

  /**
   * Comprehensive ~100-word statutory summary covering return deadlines,
   * normal wear and tear protections, and bad-faith penalty clauses.
   */
  statutorySummary: string;

  /**
   * Deductions that are almost universally disallowed as "normal wear and
   * tear" under this state's law. Used by the calculator to flag
   * violations.
   */
  commonIllegalDeductions: string[];

  /**
   * Template paragraph for a demand letter, citing the exact statute,
   * statutory damages, and intent to file in small claims court.
   */
  demandLetterStatutoryClause: BilingualText;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared illegal-deduction list (most states agree on these)
// ─────────────────────────────────────────────────────────────────────────────

const COMMON_ILLEGAL_DEDUCTIONS: string[] = [
  "Normal wear and tear",
  "Repainting faded walls",
  "Pre-existing damage",
  "Routine carpet cleaning",
  "Minor scuff marks on walls",
  "Worn carpet from normal use",
  "Faded or sun-bleached paint",
  "Minor nail holes from hanging pictures",
];

// Helper to construct demand letter clauses
function createDemandClause(
  _stateName: string,
  _stateNameEs: string,
  statuteCitation: string,
  deadlineDays: number,
  courtName: string,
  courtNameEs: string,
  penaltyDesc: string,
  penaltyDescEs: string,
): BilingualText {
  return {
    en:
      `Pursuant to ${statuteCitation}, you were required to return my security deposit or provide an itemized statement of deductions within ${deadlineDays} days of my vacating the premises. ` +
      `Your failure to comply in good faith entitles me to recover the withheld balance ${penaltyDesc}. ` +
      `If full payment is not received within ten (10) business days of this letter, I intend to file suit in ${courtName} to recover all amounts owed, including statutory penalties and court costs.`,
    es:
      `De conformidad con ${statuteCitation}, usted estaba obligado a devolver mi depósito de seguridad o proporcionar un estado de cuenta detallado de deducciones dentro de ${deadlineDays} días después de mi desocupación del inmueble. ` +
      `Su incumplimiento de buena fe me da derecho a recuperar el saldo retenido ${penaltyDescEs}. ` +
      `Si no recibo el pago completo dentro de diez (10) días hábiles a partir de esta carta, tengo la intención de presentar una demanda en ${courtNameEs} para recuperar todas las cantidades adeudadas, incluidas las sanciones legales y los costos judiciales.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Complete 50 States + DC Statute Registry
// ─────────────────────────────────────────────────────────────────────────────

export const STATE_STATUTES: Record<string, StateStatute> = {
  // ── ALABAMA ──
  AL: {
    slug: "alabama",
    stateCode: "AL",
    stateName: { en: "Alabama", es: "Alabama" },
    deadlineDays: 60,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Ala. Code § 35-9A-201",
    officialGovUrl: "https://alison.legislature.state.al.us/code-of-alabama",
    certifiedMailRequired: false,
    smallClaimsLimit: 6_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under Alabama Uniform Residential Landlord and Tenant Act (Ala. Code § 35-9A-201), landlords must refund the security deposit within 60 days of lease termination. If the landlord fails to deliver an itemized list of deductions or refund the balance within 60 days, the tenant is entitled to recover double the amount wrongfully withheld. Deductions are strictly limited to unpaid rent or actual damages exceeding normal wear and tear.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Carpet cleaning without pet or smoke damage"],
    demandLetterStatutoryClause: createDemandClause(
      "Alabama", "Alabama", "Ala. Code § 35-9A-201", 60,
      "Alabama Small Claims Court", "el Tribunal de Reclamos Menores de Alabama",
      "plus statutory damages of double (2×) the amount wrongfully withheld",
      "más daños legales del doble (2×) de la cantidad retenida indebidamente"
    ),
  },

  // ── ALASKA ──
  AK: {
    slug: "alaska",
    stateCode: "AK",
    stateName: { en: "Alaska", es: "Alaska" },
    deadlineDays: 14,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Alaska Stat. § 34.03.070",
    officialGovUrl: "https://www.akleg.gov/basis/statutes.asp#34.03.070",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Alaska Stat. § 34.03.070 requires landlords to return deposits within 14 days if the tenant provided proper notice, or 30 days if proper notice was not given. Landlords must provide an itemized written notice of accrued damages. Willful bad-faith retention entitles the tenant to recover up to twice the amount withheld, plus full attorney fees and court filing costs. Ordinary deterioration and sun exposure cannot be deducted.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine turnover repainting"],
    demandLetterStatutoryClause: createDemandClause(
      "Alaska", "Alaska", "Alaska Stat. § 34.03.070", 14,
      "Alaska District Court (Small Claims)", "el Tribunal de Distrito de Alaska (Reclamos Menores)",
      "plus statutory damages up to twice (2×) the amount withheld",
      "más daños legales de hasta el doble (2×) de la cantidad retenida"
    ),
  },

  // ── ARIZONA ──
  AZ: {
    slug: "arizona",
    stateCode: "AZ",
    stateName: { en: "Arizona", es: "Arizona" },
    deadlineDays: 14,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "A.R.S. § 33-1321",
    officialGovUrl: "https://www.azleg.gov/ars/33/01321.htm",
    certifiedMailRequired: false,
    smallClaimsLimit: 3_500,
    itemizedReceiptRequired: true,
    statutorySummary: "Ariz. Rev. Stat. § 33-1321 establishes that landlords must deliver an itemized statement and refund balance within 14 business days after move-out and demand. Landlords who fail to comply in bad faith are liable to the tenant for twice the amount wrongfully withheld. The law mandates move-out walk-through inspections upon tenant request and strictly excludes ordinary wear and tear.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine professional cleaning fees"],
    demandLetterStatutoryClause: createDemandClause(
      "Arizona", "Arizona", "A.R.S. § 33-1321", 14,
      "Arizona Justice Court (Small Claims Division)", "el Tribunal de Justicia de Arizona",
      "plus statutory damages equal to twice (2×) the amount wrongfully withheld",
      "más daños legales equivalentes al doble (2×) del monto retenido indebidamente"
    ),
  },

  // ── ARKANSAS ──
  AR: {
    slug: "arkansas",
    stateCode: "AR",
    stateName: { en: "Arkansas", es: "Arkansas" },
    deadlineDays: 60,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Ark. Code § 18-16-305",
    officialGovUrl: "https://www.arkleg.state.ar.us/ArkansasCode/Section?uri=18-16-305",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under Ark. Code Ann. § 18-16-305, property owners managing 6 or more units must return deposits within 60 days with an itemized statement of deductions. If a landlord fails to return the deposit without reasonable excuse within 60 days, the tenant may sue for up to double the wrongfully retained amount plus reasonable attorney fees. Normal wear such as small nail holes and natural paint fading are non-deductible.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Non-itemized damage claims"],
    demandLetterStatutoryClause: createDemandClause(
      "Arkansas", "Arkansas", "Ark. Code § 18-16-305", 60,
      "Arkansas District Court (Small Claims)", "el Tribunal de Distrito de Arkansas",
      "plus statutory damages up to two (2×) times the amount due",
      "más daños legales de hasta dos (2×) veces la cantidad adeudada"
    ),
  },

  // ── CALIFORNIA (Preserved exact statute text & citation) ──
  CA: {
    slug: "california",
    stateCode: "CA",
    stateName: { en: "California", es: "California" },
    deadlineDays: 21,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "California Civil Code § 1950.5",
    officialGovUrl: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5",
    certifiedMailRequired: false,
    smallClaimsLimit: 12_500,
    itemizedReceiptRequired: true,
    statutorySummary: "California Civil Code § 1950.5 establishes a strict 21-calendar-day deadline for landlords to return deposits and provide itemized receipts for any deductions exceeding $125. Bad-faith retention triggers statutory damages of up to twice the deposit amount in addition to actual damages. Deductions for normal wear and tear, pre-existing flaws, or mandatory painting after ordinary tenure are strictly prohibited.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Professional cleaning when unit was left in same condition",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to California Civil Code § 1950.5, you were required to " +
        "return my security deposit, or provide an itemized statement of " +
        "deductions, within twenty-one (21) calendar days of my vacating " +
        "the premises. Your failure to comply in good faith entitles me to " +
        "recover the withheld balance plus statutory damages of up to two " +
        "(2) times the amount of the security deposit. If full payment is " +
        "not received within ten (10) business days of this letter, I " +
        "intend to file suit in California Small Claims Court to recover " +
        "all amounts owed, including statutory penalties and court costs.",
      es:
        "De conformidad con el Código Civil de California § 1950.5, usted " +
        "estaba obligado a devolver mi depósito de seguridad, o " +
        "proporcionar un estado de cuenta detallado de deducciones, dentro " +
        "de veintiún (21) días calendario después de mi desocupación del " +
        "inmueble. Su incumplimiento de buena fe me da derecho a recuperar " +
        "el saldo retenido más daños legales de hasta dos (2) veces el " +
        "monto del depósito de seguridad. Si no recibo el pago completo " +
        "dentro de diez (10) días hábiles a partir de esta carta, tengo " +
        "la intención de presentar una demanda en el Tribunal de Reclamos " +
        "Menores de California para recuperar todas las cantidades " +
        "adeudadas, incluidas las sanciones legales y los costos judiciales.",
    },
  },

  // ── COLORADO (Preserved exact statute text & citation) ──
  CO: {
    slug: "colorado",
    stateCode: "CO",
    stateName: { en: "Colorado", es: "Colorado" },
    deadlineDays: 30,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "C.R.S. § 38-12-103",
    officialGovUrl: "https://leg.colorado.gov/sites/default/files/images/olls/crs2023-title-38.pdf",
    certifiedMailRequired: false,
    smallClaimsLimit: 7_500,
    itemizedReceiptRequired: true,
    statutorySummary: "Under Colo. Rev. Stat. § 38-12-103, landlords have 30 days (extendable up to 60 days if explicitly stated in lease) to return security deposits. Willful retention past the statutory period automatically forfeits all rights to withhold any portion and subjects the landlord to treble damages (3x withheld amount) plus reasonable attorneys' fees after a 7-day formal notice.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Deductions exceeding actual cost of repair",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to C.R.S. § 38-12-103, you were required to return my " +
        "security deposit or provide a written itemized statement within " +
        "thirty (30) calendar days of my vacating the premises (or sixty " +
        "days if specified in the lease). Your willful retention of the " +
        "deposit entitles me to recover treble (3×) the amount wrongfully " +
        "withheld, plus reasonable attorney's fees and court costs. If " +
        "full payment is not received within ten (10) business days of " +
        "this letter, I intend to file suit in Colorado County Court " +
        "(Small Claims Division) to recover all amounts owed.",
      es:
        "De conformidad con C.R.S. § 38-12-103, usted estaba obligado a " +
        "devolver mi depósito de seguridad o proporcionar un estado de " +
        "cuenta detallado por escrito dentro de treinta (30) días " +
        "calendario después de mi desocupación del inmueble (o sesenta " +
        "días si se especificó en el contrato). Su retención intencional " +
        "del depósito me da derecho a recuperar el triple (3×) de la " +
        "cantidad retenida indebidamente, más honorarios razonables de " +
        "abogado y costos judiciales. Si no recibo el pago completo " +
        "dentro de diez (10) días hábiles a partir de esta carta, tengo " +
        "la intención de presentar una demanda en el Tribunal del " +
        "Condado de Colorado (División de Reclamos Menores).",
    },
  },

  // ── CONNECTICUT ──
  CT: {
    slug: "connecticut",
    stateCode: "CT",
    stateName: { en: "Connecticut", es: "Connecticut" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Conn. Gen. Stat. § 47a-21",
    officialGovUrl: "https://www.cga.ct.gov/current/pub/chap_831.htm#sec_47a-21",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Conn. Gen. Stat. § 47a-21 requires landlords to return deposits plus accrued annual interest within 30 days of lease termination (or 15 days from forwarding address receipt). Landlords who fail to comply are liable for double the security deposit amount. Landlords must hold deposits in escrow accounts and cannot deduct for minor wall blemishes or standard turnover rug cleaning.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without escrow interest accounting"],
    demandLetterStatutoryClause: createDemandClause(
      "Connecticut", "Connecticut", "Conn. Gen. Stat. § 47a-21", 30,
      "Connecticut Small Claims Court", "el Tribunal de Reclamos Menores de Connecticut",
      "plus statutory double damages (2×) for bad-faith withholding",
      "más daños dobles estatutarios (2×) por retención de mala fe"
    ),
  },

  // ── DELAWARE ──
  DE: {
    slug: "delaware",
    stateCode: "DE",
    stateName: { en: "Delaware", es: "Delaware" },
    deadlineDays: 20,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "25 Del. C. § 5514",
    officialGovUrl: "https://delcode.delaware.gov/title25/c053/index.html#5311",
    certifiedMailRequired: false,
    smallClaimsLimit: 25_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Delaware Code tit. 25, § 5311 mandates deposit return with an itemized list of damages within 20 days of lease expiration. Landlords must place deposits in an escrow account. Failure to send the itemized accounting within 20 days forfeits all deductions, and bad-faith refusal entitles the tenant to double the deposit amount in small claims court.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Charges without written itemized repair list"],
    demandLetterStatutoryClause: createDemandClause(
      "Delaware", "Delaware", "25 Del. C. § 5514", 20,
      "Delaware Justice of the Peace Court", "el Tribunal del Juez de Paz de Delaware",
      "plus double (2×) the amount wrongfully withheld",
      "más el doble (2×) de la cantidad retenida indebidamente"
    ),
  },

  // ── DISTRICT OF COLUMBIA ──
  DC: {
    slug: "district-of-columbia",
    stateCode: "DC",
    stateName: { en: "District of Columbia", es: "Distrito de Columbia" },
    deadlineDays: 45,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "14 DCMR § 309",
    officialGovUrl: "https://code.dccouncil.gov/us/dc/council/code/sections/42-3502.17",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under D.C. Municipal Regulations (14 DCMR § 309) and D.C. Code § 42-3502.17, housing providers have 45 days to return deposits with an itemized deduction notice. Failure to refund within 45 days forfeits all deductions, and bad-faith withholding subjects the landlord to treble damages (3x withheld funds) plus mandatory interest accrued over the tenancy.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Withholdings without prior move-out inspection notice"],
    demandLetterStatutoryClause: createDemandClause(
      "District of Columbia", "Distrito de Columbia", "14 DCMR § 309", 45,
      "D.C. Superior Court (Small Claims)", "el Tribunal Superior de D.C. (Reclamos Menores)",
      "plus treble (3×) damages for bad faith",
      "más el triple (3×) de daños por mala fe"
    ),
  },

  // ── FLORIDA (Preserved exact statute text & citation) ──
  FL: {
    slug: "florida",
    stateCode: "FL",
    stateName: { en: "Florida", es: "Florida" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 0,
    legalCodeCitation: "Florida Statute § 83.49",
    officialGovUrl: "https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/Sections/0083.49.html",
    certifiedMailRequired: true,
    smallClaimsLimit: 8_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Fla. Stat. § 83.49 mandates deposit return within 15 days if no claim is made, or 30 days via certified mail if deductions are claimed. Failure to send notice within 30 days forfeits all rights to make deductions. Prevailing tenants in small claims court are entitled to 100% of the deposit, court costs, and reasonable attorney fees.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Deductions without required certified-mail notice within 30 days",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to Florida Statute § 83.49, you were required to return " +
        "my security deposit within fifteen (15) days if imposing no " +
        "claim, or to provide written notice by certified mail within " +
        "thirty (30) days if you intended to impose a claim against the " +
        "deposit. Your failure to comply forfeits your right to impose " +
        "any claim and obligates you to return the deposit in full. If " +
        "full payment is not received within ten (10) business days of " +
        "this letter, I intend to file suit in Florida Small Claims Court " +
        "to recover all amounts owed, including court costs.",
      es:
        "De conformidad con el Estatuto de Florida § 83.49, usted estaba " +
        "obligado a devolver mi depósito de seguridad dentro de quince " +
        "(15) días si no imponía ningún reclamo, o a proporcionar aviso " +
        "por escrito por correo certificado dentro de treinta (30) días " +
        "si tenía la intención de imponer un reclamo contra el depósito. " +
        "Su incumplimiento anula su derecho a imponer cualquier reclamo y " +
        "lo obliga a devolver el depósito en su totalidad. Si no recibo " +
        "el pago completo dentro de diez (10) días hábiles a partir de " +
        "esta carta, tengo la intención de presentar una demanda en el " +
        "Tribunal de Reclamos Menores de Florida.",
    },
  },

  // ── GEORGIA (Preserved exact statute text & citation) ──
  GA: {
    slug: "georgia",
    stateCode: "GA",
    stateName: { en: "Georgia", es: "Georgia" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "3x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "O.C.G.A. § 44-7-34, § 44-7-35",
    officialGovUrl: "https://law.justia.com/codes/georgia/title-44/chapter-7/article-2/section-44-7-34/",
    certifiedMailRequired: false,
    smallClaimsLimit: 15_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Ga. Code Ann. § 44-7-34 requires landlords with 10 or more rental units to maintain deposits in escrow and return them within 30 days. Landlords who fail to conduct mandatory move-out inspections or wrongfully withhold funds are liable for treble (3x) the withheld amount plus full attorney fees, excluding reasonable wear and tear.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Charges without move-in inspection report",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to O.C.G.A. § 44-7-34 and § 44-7-35, you were required " +
        "to return my security deposit or provide an itemized statement " +
        "of claimed damages within thirty (30) days of my vacating the " +
        "premises. Your failure to comply forfeits your right to withhold " +
        "any portion of the deposit and entitles me to recover the full " +
        "amount plus reasonable attorney's fees. If full payment is not " +
        "received within ten (10) business days of this letter, I intend " +
        "to file suit in Georgia Magistrate Court to recover all amounts " +
        "owed, including court costs.",
      es:
        "De conformidad con O.C.G.A. § 44-7-34 y § 44-7-35, usted " +
        "estaba obligado a devolver mi depósito de seguridad o " +
        "proporcionar un estado de cuenta detallado de daños reclamados " +
        "dentro de treinta (30) días de mi desocupación del inmueble. Su " +
        "incumplimiento anula su derecho a retener cualquier porción del " +
        "depósito y me da derecho a recuperar el monto completo más " +
        "honorarios razonables de abogado. Si no recibo el pago completo " +
        "dentro de diez (10) días hábiles a partir de esta carta, tengo " +
        "la intención de presentar una demanda en el Tribunal de " +
        "Magistrado de Georgia.",
    },
  },

  // ── HAWAII ──
  HI: {
    slug: "hawaii",
    stateCode: "HI",
    stateName: { en: "Hawaii", es: "Hawái" },
    deadlineDays: 14,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "Haw. Rev. Stat. § 521-44",
    officialGovUrl: "https://www.capitol.hawaii.gov/hrscurrent/Vol11_Ch0476-0527/HRS0521/HRS_0521-0044.htm",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under Haw. Rev. Stat. § 521-44, landlords must return deposits and an itemized written explanation with receipts within 14 days of surrender. Failure to do so within 14 days forfeits the entire deposit. Wrongful bad-faith retention permits courts to award the tenant up to triple the wrongfully withheld deposit.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Withholdings without original contractor receipts"],
    demandLetterStatutoryClause: createDemandClause(
      "Hawaii", "Hawái", "Haw. Rev. Stat. § 521-44", 14,
      "Hawaii District Court (Small Claims)", "el Tribunal de Distrito de Hawái",
      "plus treble (3×) damages for wrongful retention",
      "más el triple (3×) de indemnización por retención injustificada"
    ),
  },

  // ── IDAHO ──
  ID: {
    slug: "idaho",
    stateCode: "ID",
    stateName: { en: "Idaho", es: "Idaho" },
    deadlineDays: 21,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "Idaho Code § 6-320",
    officialGovUrl: "https://legislature.idaho.gov/statutesrules/idstat/title6/t6ch3/sect6-321/",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Idaho Code § 6-321 mandates return within 21 days (or up to 30 days by explicit contractual agreement). If the landlord fails to return the deposit within the statutory window following a 3-day written demand, the tenant can recover treble damages (3x the unreturned deposit) plus court costs and attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine professional cleaning fees"],
    demandLetterStatutoryClause: createDemandClause(
      "Idaho", "Idaho", "Idaho Code § 6-320", 21,
      "Idaho Small Claims Court", "el Tribunal de Reclamos Menores de Idaho",
      "plus treble (3×) damages and reasonable attorney fees",
      "más el triple (3×) de daños y honorarios de abogado"
    ),
  },

  // ── ILLINOIS (Preserved exact statute text & citation) ──
  IL: {
    slug: "illinois",
    stateCode: "IL",
    stateName: { en: "Illinois", es: "Illinois" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "765 ILCS 710 (Illinois Security Deposit Return Act)",
    officialGovUrl: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=2202&ChapterID=62",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under the Illinois Security Deposit Return Act (765 ILCS 710/1), landlords managing 5 or more units have 30 days to furnish itemized damage receipts and 45 days for final cash refund. Landlords who refuse to supply receipts or withhold in bad faith are liable for double the deposit amount plus attorney fees.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Deductions without required itemized statement",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to the Illinois Security Deposit Return Act (765 ILCS " +
        "710), you were required to return my security deposit or provide " +
        "an itemized statement of damages within thirty (30) days of my " +
        "vacating the premises. Your failure to provide the required " +
        "itemized statement entitles me to recover up to two (2) times " +
        "the amount of the security deposit due. If full payment is not " +
        "received within ten (10) business days of this letter, I intend " +
        "to file suit in Illinois Small Claims Court to recover all " +
        "amounts owed.",
      es:
        "De conformidad con la Ley de Devolución de Depósitos de " +
        "Seguridad de Illinois (765 ILCS 710), usted estaba obligado a " +
        "devolver mi depósito de seguridad o proporcionar un estado de " +
        "cuenta detallado de daños dentro de treinta (30) días de mi " +
        "desocupación del inmueble. Su incumplimiento en proporcionar el " +
        "estado de cuenta requerido me da derecho a recuperar hasta dos " +
        "(2) veces el monto del depósito de seguridad. Si no recibo el " +
        "pago completo dentro de diez (10) días hábiles a partir de esta " +
        "carta, tengo la intención de presentar una demanda en el " +
        "Tribunal de Reclamos Menores de Illinois.",
    },
  },

  // ── INDIANA ──
  IN: {
    slug: "indiana",
    stateCode: "IN",
    stateName: { en: "Indiana", es: "Indiana" },
    deadlineDays: 45,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 0,
    legalCodeCitation: "Ind. Code § 32-31-3-12",
    officialGovUrl: "https://iga.in.gov/laws/current/ic/title/32/article/31/chapter/3#32-31-3-12",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Ind. Code § 32-31-3-12 requires landlords to return the deposit with an itemized written notice within 45 days of tenant move-out and receipt of forwarding address. Landlords who fail to provide notice forfeit all deductions and are liable for 100% of the deposit, plus tenant attorney fees and court filing expenses.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without itemized written notice within 45 days"],
    demandLetterStatutoryClause: createDemandClause(
      "Indiana", "Indiana", "Ind. Code § 32-31-3-12", 45,
      "Indiana Small Claims Court", "el Tribunal de Reclamos Menores de Indiana",
      "plus reasonable attorney's fees and court costs for failure to comply",
      "más honorarios razonables de abogado y costas judiciales por incumplimiento"
    ),
  },

  // ── IOWA ──
  IA: {
    slug: "iowa",
    stateCode: "IA",
    stateName: { en: "Iowa", es: "Iowa" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 200,
    legalCodeCitation: "Iowa Code § 562A.12",
    officialGovUrl: "https://www.legis.iowa.gov/docs/ico/section/562A.12.pdf",
    certifiedMailRequired: false,
    smallClaimsLimit: 6_500,
    itemizedReceiptRequired: true,
    statutorySummary: "Iowa Code § 562A.12 requires landlords to return security deposits with itemized damage statements within 30 days. Landlords who fail to supply an itemized statement forfeit all claims to the deposit. Bad-faith retention entitles the tenant to punitive damages up to twice the deposit amount plus attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine repainting charges"],
    demandLetterStatutoryClause: createDemandClause(
      "Iowa", "Iowa", "Iowa Code § 562A.12", 30,
      "Iowa Small Claims Court", "el Tribunal de Reclamos Menores de Iowa",
      "plus punitive damages up to twice (2×) the deposit plus $200",
      "más daños punitivos de hasta dos (2×) veces el depósito más $200"
    ),
  },

  // ── KANSAS ──
  KS: {
    slug: "kansas",
    stateCode: "KS",
    stateName: { en: "Kansas", es: "Kansas" },
    deadlineDays: 30,
    penaltyMultiplier: 1.5,
    penaltyMultiplierText: "1.5x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "Kan. Stat. § 58-2550",
    officialGovUrl: "https://www.ksrevisor.org/statutes/chapters/ch58/058_025_0050.html",
    certifiedMailRequired: false,
    smallClaimsLimit: 4_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Kan. Stat. Ann. § 58-2550 mandates that landlords mail itemized deductions and refunds within 14 days of determining deductions, and no later than 30 days after surrender. Failure to comply in bad faith entitles the tenant to recover the withheld funds plus damages equal to 1.5 times the wrongful withholding.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Unitemized repair deductions"],
    demandLetterStatutoryClause: createDemandClause(
      "Kansas", "Kansas", "Kan. Stat. § 58-2550", 30,
      "Kansas Small Claims Court", "el Tribunal de Reclamos Menores de Kansas",
      "plus statutory damages equal to one and a half (1.5×) times the amount withheld",
      "más daños estatutarios de una y media (1.5×) veces el monto retenido"
    ),
  },

  // ── KENTUCKY ──
  KY: {
    slug: "kentucky",
    stateCode: "KY",
    stateName: { en: "Kentucky", es: "Kentucky" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 0,
    legalCodeCitation: "KRS § 383.580",
    officialGovUrl: "https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=35733",
    certifiedMailRequired: false,
    smallClaimsLimit: 2_500,
    itemizedReceiptRequired: true,
    statutorySummary: "Under Ky. Rev. Stat. Ann. § 383.580 (URLTA), landlords must maintain deposits in a separate banking escrow account and provide move-in and move-out inspection checklists. Landlords who fail to maintain escrow or skip inspection checklists forfeit all rights to withhold any portion of the deposit.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without move-in and move-out checklists"],
    demandLetterStatutoryClause: createDemandClause(
      "Kentucky", "Kentucky", "KRS § 383.580", 30,
      "Kentucky Small Claims Court", "el Tribunal de Reclamos Menores de Kentucky",
      "forfeiting all claims against the deposit and mandating full refund",
      "perdiendo todo reclamo sobre el depósito y ordenando su devolución completa"
    ),
  },

  // ── LOUISIANA ──
  LA: {
    slug: "louisiana",
    stateCode: "LA",
    stateName: { en: "Louisiana", es: "Luisiana" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 300,
    legalCodeCitation: "La. R.S. § 9:3251, § 9:3252",
    officialGovUrl: "https://www.legis.la.gov/legis/Law.aspx?d=109151",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "La. Rev. Stat. § 9:3251 through § 9:3252 requires landlords to return deposits and itemized statements within 30 days. Willful failure to return or account for the deposit within 30 days allows the tenant to recover actual damages or $300 (whichever is greater), plus double damages and attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without written itemization within 1 month"],
    demandLetterStatutoryClause: createDemandClause(
      "Louisiana", "Luisiana", "La. R.S. § 9:3251", 30,
      "Louisiana City / Justice of the Peace Court", "el Tribunal de Paz de Luisiana",
      "plus statutory damages of $300 or twice (2×) the amount wrongfully retained",
      "más daños legales de $300 o el doble (2×) del monto retenido injustificadamente"
    ),
  },

  // ── MAINE ──
  ME: {
    slug: "maine",
    stateCode: "ME",
    stateName: { en: "Maine", es: "Maine" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "14 M.R.S. § 6033",
    officialGovUrl: "https://legislature.maine.gov/statutes/14/title14sec6033.html",
    certifiedMailRequired: false,
    smallClaimsLimit: 6_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Me. Rev. Stat. tit. 14, § 6033 mandates deposit return within 30 days for written leases or 21 days for tenancies at will. Landlords who fail to provide an itemized statement forfeit all claims to retain any portion. Willful failure allows recovery of double the deposit amount plus attorney fees after a 7-day notice.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine professional cleaning"],
    demandLetterStatutoryClause: createDemandClause(
      "Maine", "Maine", "14 M.R.S. § 6033", 30,
      "Maine District Court (Small Claims)", "el Tribunal de Distrito de Maine",
      "plus double (2×) the amount wrongfully withheld plus court costs",
      "más el doble (2×) de la cantidad retenida indebidamente más costos judiciales"
    ),
  },

  // ── MARYLAND ──
  MD: {
    slug: "maryland",
    stateCode: "MD",
    stateName: { en: "Maryland", es: "Maryland" },
    deadlineDays: 45,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Md. Code Real Prop. § 8-203",
    officialGovUrl: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=8-203",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Md. Code Ann., Real Prop. § 8-203 requires landlords to return deposits by first-class mail within 45 days, with itemized damage lists and costs. Failure to comply without reasonable excuse forfeits deductions and entitles the tenant to recover up to three times (3x) the deposit plus reasonable attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Charges without written itemized list sent first class"],
    demandLetterStatutoryClause: createDemandClause(
      "Maryland", "Maryland", "Md. Code Real Prop. § 8-203", 45,
      "Maryland District Court (Small Claims)", "el Tribunal de Distrito de Maryland",
      "plus statutory damages up to threefold (3×) the withheld amount",
      "más daños legales de hasta el triple (3×) de la cantidad retenida"
    ),
  },

  // ── MASSACHUSETTS ──
  MA: {
    slug: "massachusetts",
    stateCode: "MA",
    stateName: { en: "Massachusetts", es: "Massachusetts" },
    deadlineDays: 30,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Mass. Gen. Laws ch. 186 § 15B",
    officialGovUrl: "https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15B",
    certifiedMailRequired: false,
    smallClaimsLimit: 7_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under Mass. Gen. Laws ch. 186, § 15B, Massachusetts has some of the strictest tenant protections in the US. Landlords must hold deposits in interest-bearing accounts and return them within 30 days with verified receipts. Failure to comply results in mandatory treble (3x) damages plus 5% interest and attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without sworn statement and repair receipts"],
    demandLetterStatutoryClause: createDemandClause(
      "Massachusetts", "Massachusetts", "Mass. Gen. Laws ch. 186 § 15B", 30,
      "Massachusetts Small Claims Court", "el Tribunal de Reclamos Menores de Massachusetts",
      "plus triple (3×) damages, 5% interest, and reasonable attorney fees",
      "más el triple (3×) de daños, 5% de interés y honorarios razonables de abogado"
    ),
  },

  // ── MICHIGAN ──
  MI: {
    slug: "michigan",
    stateCode: "MI",
    stateName: { en: "Michigan", es: "Míchigan" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "MCL § 554.609, § 554.613",
    officialGovUrl: "https://www.legislature.mi.gov/statutes/554.609",
    certifiedMailRequired: false,
    smallClaimsLimit: 7_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Mich. Comp. Laws § 554.609 requires landlords to mail an itemized list of damages within 30 days of move-out. If a tenant contests deductions within 7 days, the landlord must sue in court within 45 days or forfeit the funds. Failure to comply constitutes waiver of deductions and double damages.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without lawsuit filing within 45 days"],
    demandLetterStatutoryClause: createDemandClause(
      "Michigan", "Míchigan", "MCL § 554.609", 30,
      "Michigan District Court (Small Claims)", "el Tribunal de Distrito de Míchigan",
      "plus double (2×) the security deposit retained",
      "más el doble (2×) del depósito de seguridad retenido"
    ),
  },

  // ── MINNESOTA ──
  MN: {
    slug: "minnesota",
    stateCode: "MN",
    stateName: { en: "Minnesota", es: "Minnesota" },
    deadlineDays: 21,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 500,
    legalCodeCitation: "Minn. Stat. § 504B.178",
    officialGovUrl: "https://www.revisor.mn.gov/statutes/cite/504B.178",
    certifiedMailRequired: false,
    smallClaimsLimit: 15_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Minn. Stat. § 504B.178 requires return of deposits plus statutory 1% interest within 3 weeks (21 days) of lease termination. Bad-faith withholding subjects landlords to punitive damages up to the amount of the deposit (effectively double recovery) plus an additional $500 penalty and legal fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without statutory interest payment"],
    demandLetterStatutoryClause: createDemandClause(
      "Minnesota", "Minnesota", "Minn. Stat. § 504B.178", 21,
      "Minnesota Conciliation Court", "el Tribunal de Conciliación de Minnesota",
      "plus statutory damages equal to the deposit plus up to $500 bad faith penalty",
      "más daños estatutarios equivalentes al depósito más hasta $500 de multa por mala fe"
    ),
  },

  // ── MISSISSIPPI ──
  MS: {
    slug: "mississippi",
    stateCode: "MS",
    stateName: { en: "Mississippi", es: "Misisipi" },
    deadlineDays: 45,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 200,
    legalCodeCitation: "Miss. Code § 89-8-21",
    officialGovUrl: "https://law.justia.com/codes/mississippi/title-89/chapter-8/section-89-8-21/",
    certifiedMailRequired: false,
    smallClaimsLimit: 3_500,
    itemizedReceiptRequired: true,
    statutorySummary: "Miss. Code Ann. § 89-8-21 mandates deposit return with an itemized statement within 45 days after move-out. Landlords who fail to return funds or account for deductions in bad faith are liable for the full deposit plus damages up to $200 and court costs.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Charges without itemized written notice"],
    demandLetterStatutoryClause: createDemandClause(
      "Mississippi", "Misisipi", "Miss. Code § 89-8-21", 45,
      "Mississippi Justice Court", "el Tribunal de Justicia de Misisipi",
      "plus statutory damages of $200 for bad-faith withholding",
      "más daños estatutarios de $200 por retención de mala fe"
    ),
  },

  // ── MISSOURI ──
  MO: {
    slug: "missouri",
    stateCode: "MO",
    stateName: { en: "Missouri", es: "Misuri" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Mo. Rev. Stat. § 535.300",
    officialGovUrl: "https://revisor.mo.gov/main/OneSection.aspx?section=535.300",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Mo. Rev. Stat. § 535.300 requires landlords to return deposits within 30 days of lease expiration and provide reasonable advance notice of move-out inspection. If the landlord wrongfully withholds the deposit without good cause, the tenant can recover twice the amount wrongfully withheld.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Charges without written notice of move-out inspection"],
    demandLetterStatutoryClause: createDemandClause(
      "Missouri", "Misuri", "Mo. Rev. Stat. § 535.300", 30,
      "Missouri Small Claims Court", "el Tribunal de Reclamos Menores de Misuri",
      "plus statutory damages of up to twice (2×) the amount wrongfully withheld",
      "más daños estatutarios de hasta dos (2×) veces la cantidad retenida indebidamente"
    ),
  },

  // ── MONTANA ──
  MT: {
    slug: "montana",
    stateCode: "MT",
    stateName: { en: "Montana", es: "Montana" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 0,
    legalCodeCitation: "Mont. Code § 70-25-202",
    officialGovUrl: "https://leg.mt.gov/bills/mca/title_0700/chapter_0250/part_0020/section_0020/0700-0250-0020-0020.html",
    certifiedMailRequired: false,
    smallClaimsLimit: 7_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Mont. Code Ann. § 70-25-202 provides a rapid 10-day return window if no damages are claimed, or 30 days with itemized damage lists. Landlords who fail to provide required notice of cleaning and move-out inspections forfeit all deduction rights and must refund 100% plus legal costs.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without written notice of cleaning needs"],
    demandLetterStatutoryClause: createDemandClause(
      "Montana", "Montana", "Mont. Code § 70-25-202", 30,
      "Montana Small Claims Court", "el Tribunal de Reclamos Menores de Montana",
      "forfeiting deduction rights and entitling me to full refund plus attorney fees",
      "perdiendo el derecho a deducciones y ordenando reembolso completo más honorarios"
    ),
  },

  // ── NEBRASKA ──
  NE: {
    slug: "nebraska",
    stateCode: "NE",
    stateName: { en: "Nebraska", es: "Nebraska" },
    deadlineDays: 14,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Neb. Rev. Stat. § 76-1416",
    officialGovUrl: "https://nebraskalegislature.gov/laws/statutes.php?statute=76-1416",
    certifiedMailRequired: false,
    smallClaimsLimit: 3_900,
    itemizedReceiptRequired: true,
    statutorySummary: "Neb. Rev. Stat. § 76-1416 mandates that the landlord mail the balance and an itemized accounting within 14 days of tenant demand. Landlords acting in bad faith are liable for the amount wrongfully withheld plus statutory damages equal to up to one month's rent or double the deposit and attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Unitemized damage estimates"],
    demandLetterStatutoryClause: createDemandClause(
      "Nebraska", "Nebraska", "Neb. Rev. Stat. § 76-1416", 14,
      "Nebraska Small Claims Court", "el Tribunal de Reclamos Menores de Nebraska",
      "plus statutory damages equal to one month's rent plus attorney fees",
      "más daños estatutarios de un mes de renta más honorarios de abogado"
    ),
  },

  // ── NEVADA ──
  NV: {
    slug: "nevada",
    stateCode: "NV",
    stateName: { en: "Nevada", es: "Nevada" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "NRS § 118A.242",
    officialGovUrl: "https://www.leg.state.nv.us/nrs/nrs-118a.html#NRS118ASec242",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Nev. Rev. Stat. § 118A.242 requires landlords to deliver an itemized accounting and refund within 30 days. Landlords who fail to return funds or account for deductions in bad faith may be held liable by the court for statutory damages up to the full deposit amount (totaling double recovery).",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine carpet cleaning without excessive staining"],
    demandLetterStatutoryClause: createDemandClause(
      "Nevada", "Nevada", "NRS § 118A.242", 30,
      "Nevada Justice Court (Small Claims)", "el Tribunal de Justicia de Nevada",
      "plus statutory damages up to the amount of the deposit (double recovery)",
      "más daños estatutarios de hasta el monto del depósito (recuperación doble)"
    ),
  },

  // ── NEW HAMPSHIRE ──
  NH: {
    slug: "new-hampshire",
    stateCode: "NH",
    stateName: { en: "New Hampshire", es: "Nuevo Hampshire" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "N.H. Rev. Stat. § 540-A:7",
    officialGovUrl: "https://www.gencourt.state.nh.us/rsa/html/LV/540-A/540-A-7.htm",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "N.H. Rev. Stat. Ann. § 540-A:7 requires landlords to return deposits and itemized damage lists within 30 days (or 20 days if sharing a residence). Willful failure to return the deposit results in statutory damages of double the deposit amount plus court costs and attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without detailed proof of repair costs"],
    demandLetterStatutoryClause: createDemandClause(
      "New Hampshire", "Nuevo Hampshire", "N.H. Rev. Stat. § 540-A:7", 30,
      "New Hampshire District Court (Small Claims)", "el Tribunal de Distrito de Nuevo Hampshire",
      "plus double (2×) the amount of the deposit plus court costs",
      "más el doble (2×) del monto del depósito más costos de corte"
    ),
  },

  // ── NEW JERSEY ──
  NJ: {
    slug: "new-jersey",
    stateCode: "NJ",
    stateName: { en: "New Jersey", es: "Nueva Jersey" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "N.J.S.A. § 46:8-21.1",
    officialGovUrl: "https://law.justia.com/codes/new-jersey/title-46/section-46-8-21-1/",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "N.J. Stat. Ann. § 46:8-21.1 requires deposit return with interest within 30 days of lease expiration (or 5 days in flood/fire displacements). Failure to return funds within 30 days entitles the tenant to recover double the wrongfully withheld amount, plus 100% of legal fees and filing costs.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without certified mail notice within 30 days"],
    demandLetterStatutoryClause: createDemandClause(
      "New Jersey", "Nueva Jersey", "N.J.S.A. § 46:8-21.1", 30,
      "New Jersey Special Civil Part (Small Claims)", "el Tribunal Especial Civil de Nueva Jersey",
      "plus double (2×) the amount wrongfully withheld plus full attorney fees",
      "más el doble (2×) de la cantidad retenida indebidamente más honorarios legales"
    ),
  },

  // ── NEW MEXICO ──
  NM: {
    slug: "new-mexico",
    stateCode: "NM",
    stateName: { en: "New Mexico", es: "Nuevo México" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 250,
    legalCodeCitation: "N.M. Stat. § 47-8-18",
    officialGovUrl: "https://nmonesource.com/nmos/nmsa/en/item/4392/index.do#47-8-18",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "N.M. Stat. Ann. § 47-8-18 mandates return within 30 days with itemized damage accounting. Landlords who fail to provide the written statement within 30 days forfeit all rights to withhold any portion of the deposit and are liable for a $250 civil penalty, court costs, and attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without written itemization within 30 days"],
    demandLetterStatutoryClause: createDemandClause(
      "New Mexico", "Nuevo México", "N.M. Stat. § 47-8-18", 30,
      "New Mexico Magistrate Court", "el Tribunal Magistrado de Nuevo México",
      "plus a statutory civil penalty of $250 plus attorney fees and costs",
      "más una sanción civil estatutaria de $250 más honorarios de abogado"
    ),
  },

  // ── NEW YORK (Preserved exact statute text & citation) ──
  NY: {
    slug: "new-york",
    stateCode: "NY",
    stateName: { en: "New York", es: "Nueva York" },
    deadlineDays: 14,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "New York General Obligations Law § 7-108",
    officialGovUrl: "https://www.nysenate.gov/legislation/laws/GOB/7-108",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under New York General Obligations Law § 7-108 (HSTPA), landlords must return deposits and an itemized accounting within 14 calendar days. Landlords who fail to provide the itemized receipt within 14 days forfeit all deduction rights. Willful violations carry punitive damages up to double the deposit.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Last month's rent applied without prior written agreement",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to New York General Obligations Law § 7-108, you were " +
        "required to return my security deposit or provide an itemized " +
        "statement within fourteen (14) days of my vacating the premises. " +
        "Your failure to comply entitles me to recover the withheld " +
        "balance plus punitive damages of up to two (2) times the deposit " +
        "amount. If full payment is not received within ten (10) business " +
        "days of this letter, I intend to file suit in New York Small " +
        "Claims Court to recover all amounts owed.",
      es:
        "De conformidad con la Ley de Obligaciones Generales de Nueva " +
        "York § 7-108, usted estaba obligado a devolver mi depósito de " +
        "seguridad o proporcionar un estado de cuenta detallado dentro de " +
        "catorce (14) días de mi desocupación del inmueble. Su " +
        "incumplimiento me da derecho a recuperar el saldo retenido más " +
        "daños punitivos de hasta dos (2) veces el monto del depósito. " +
        "Si no recibo el pago completo dentro de diez (10) días hábiles " +
        "a partir de esta carta, tengo la intención de presentar una " +
        "demanda en el Tribunal de Reclamos Menores de Nueva York.",
    },
  },

  // ── NORTH CAROLINA (Preserved exact statute text & citation) ──
  NC: {
    slug: "north-carolina",
    stateCode: "NC",
    stateName: { en: "North Carolina", es: "Carolina del Norte" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 0,
    legalCodeCitation: "N.C. Gen. Stat. § 42-52",
    officialGovUrl: "https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_42/Section_42-52.html",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "N.C. Gen. Stat. § 42-52 provides an interim or final accounting within 30 days of surrender (and no later than 60 days for final costs). Willful failure to return deposits forfeits the landlord's right to retain any funds and subjects them to tenant attorney fee awards in small claims court.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Deductions without itemized accounting within 30 days",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to N.C. Gen. Stat. § 42-52, you were required to " +
        "provide an itemized accounting of any deposit deductions and " +
        "return the remaining balance within thirty (30) days of the " +
        "termination of my tenancy. Your failure to comply entitles me " +
        "to recover the full deposit amount. If full payment is not " +
        "received within ten (10) business days of this letter, I intend " +
        "to file suit in North Carolina Small Claims Court to recover " +
        "all amounts owed, including court costs.",
      es:
        "De conformidad con N.C. Gen. Stat. § 42-52, usted estaba " +
        "obligado a proporcionar un estado de cuenta detallado de " +
        "cualquier deducción del depósito y devolver el saldo restante " +
        "dentro de treinta (30) días de la terminación de mi arrendamiento. " +
        "Su incumplimiento me da derecho a recuperar el monto completo " +
        "del depósito. Si no recibo el pago completo dentro de diez (10) " +
        "días hábiles a partir de esta carta, tengo la intención de " +
        "presentar una demanda en el Tribunal de Reclamos Menores de " +
        "Carolina del Norte.",
    },
  },

  // ── NORTH DAKOTA ──
  ND: {
    slug: "north-dakota",
    stateCode: "ND",
    stateName: { en: "North Dakota", es: "Dakota del Norte" },
    deadlineDays: 30,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "N.D. Cent. Code § 47-16-07.1",
    officialGovUrl: "https://ndlegis.gov/cencode/t47c16.pdf#nameddest=47-16-07-1",
    certifiedMailRequired: false,
    smallClaimsLimit: 15_000,
    itemizedReceiptRequired: true,
    statutorySummary: "N.D. Cent. Code § 47-16-07.1 requires landlords to return deposits within 30 days with itemized statements. Landlords who fail to comply without reasonable cause are liable for treble damages (up to three times the amount withheld) plus court costs.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine repainting charges"],
    demandLetterStatutoryClause: createDemandClause(
      "North Dakota", "Dakota del Norte", "N.D. Cent. Code § 47-16-07.1", 30,
      "North Dakota Small Claims Court", "el Tribunal de Reclamos Menores de Dakota del Norte",
      "plus treble (3×) damages for wrongful withholding",
      "más el triple (3×) de daños por retención injustificada"
    ),
  },

  // ── OHIO ──
  OH: {
    slug: "ohio",
    stateCode: "OH",
    stateName: { en: "Ohio", es: "Ohio" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Ohio Rev. Code § 5321.16",
    officialGovUrl: "https://codes.ohio.gov/ohio-revised-code/section-5321.16",
    certifiedMailRequired: false,
    smallClaimsLimit: 6_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Ohio Rev. Code Ann. § 5321.16 requires landlords to return deposits within 30 days with an itemized written list of deductions. Landlords who fail to return funds or account for deductions in bad faith are liable for double the amount wrongfully withheld plus reasonable attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine turnover cleaning"],
    demandLetterStatutoryClause: createDemandClause(
      "Ohio", "Ohio", "Ohio Rev. Code § 5321.16", 30,
      "Ohio Small Claims Court", "el Tribunal de Reclamos Menores de Ohio",
      "plus double (2×) the amount wrongfully withheld plus reasonable attorney fees",
      "más el doble (2×) del monto retenido indebidamente más honorarios de abogado"
    ),
  },

  // ── OKLAHOMA ──
  OK: {
    slug: "oklahoma",
    stateCode: "OK",
    stateName: { en: "Oklahoma", es: "Oklahoma" },
    deadlineDays: 45,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "41 Okla. Stat. § 115",
    officialGovUrl: "https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=71775",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Okla. Stat. tit. 41, § 115 requires deposits to be held in an escrow account. The landlord must return the balance within 45 days after the tenant delivers a written demand. Landlords who fail to return funds are liable for the amount withheld plus statutory damages and reasonable attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Charges without written itemization sent via certified mail"],
    demandLetterStatutoryClause: createDemandClause(
      "Oklahoma", "Oklahoma", "41 Okla. Stat. § 115", 45,
      "Oklahoma Small Claims Court", "el Tribunal de Reclamos Menores de Oklahoma",
      "plus statutory double (2×) damages for wrongful withholding",
      "más el doble (2×) de daños estatutarios por retención injustificada"
    ),
  },

  // ── OREGON ──
  OR: {
    slug: "oregon",
    stateCode: "OR",
    stateName: { en: "Oregon", es: "Oregón" },
    deadlineDays: 31,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "ORS § 90.300",
    officialGovUrl: "https://www.oregonlegislature.gov/bills_laws/ors/ors090.html",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Or. Rev. Stat. § 90.300 requires delivery of deposit balances and itemized accounting within 31 days. Deductions cannot be made for normal wear and tear or carpet cleaning without pet damage. Landlords who fail to comply in bad faith are liable for twice the amount wrongfully withheld.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Carpet cleaning without specialized pet damage receipts"],
    demandLetterStatutoryClause: createDemandClause(
      "Oregon", "Oregón", "ORS § 90.300", 31,
      "Oregon Small Claims Court", "el Tribunal de Reclamos Menores de Oregón",
      "plus twice (2×) the amount wrongfully withheld",
      "más dos veces (2×) la cantidad retenida indebidamente"
    ),
  },

  // ── PENNSYLVANIA (Preserved exact statute text & citation) ──
  PA: {
    slug: "pennsylvania",
    stateCode: "PA",
    stateName: { en: "Pennsylvania", es: "Pensilvania" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "68 Pa.C.S. § 250.512 (Landlord and Tenant Act)",
    officialGovUrl: "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=68&div=0&chpt=250&sctn=512&subsctn=0",
    certifiedMailRequired: false,
    smallClaimsLimit: 12_000,
    itemizedReceiptRequired: true,
    statutorySummary: "68 Pa. Stat. Ann. § 250.512 mandates that landlords provide a written itemized list of damages within 30 days. Landlords who fail to deliver the accounting within 30 days forfeit all deduction rights and are liable for double the amount of the deposit.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Deductions without written list sent to last known address",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to 68 Pa.C.S. § 250.512 of the Pennsylvania Landlord " +
        "and Tenant Act, you were required to return my security deposit " +
        "or provide a written list of damages within thirty (30) days of " +
        "the termination of the lease or my surrender of the premises. " +
        "Your failure to comply entitles me to recover double (2×) the " +
        "amount of the deposit wrongfully withheld. If full payment is " +
        "not received within ten (10) business days of this letter, I " +
        "intend to file suit in Pennsylvania Magisterial District Court " +
        "to recover all amounts owed.",
      es:
        "De conformidad con 68 Pa.C.S. § 250.512 de la Ley de " +
        "Propietarios e Inquilinos de Pensilvania, usted estaba obligado " +
        "a devolver mi depósito de seguridad o proporcionar una lista " +
        "escrita de daños dentro de treinta (30) días de la terminación " +
        "del contrato o mi entrega del inmueble. Su incumplimiento me da " +
        "derecho a recuperar el doble (2×) del monto del depósito " +
        "retenido indebidamente. Si no recibo el pago completo dentro de " +
        "diez (10) días hábiles a partir de esta carta, tengo la " +
        "intención de presentar una demanda en el Tribunal de Distrito " +
        "Magistrado de Pensilvania.",
    },
  },

  // ── RHODE ISLAND ──
  RI: {
    slug: "rhode-island",
    stateCode: "RI",
    stateName: { en: "Rhode Island", es: "Rhode Island" },
    deadlineDays: 20,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "R.I. Gen. Laws § 34-18-19",
    officialGovUrl: "https://webserver.rilegislature.gov/Statutes/TITLE34/34-18/34-18-19.htm",
    certifiedMailRequired: false,
    smallClaimsLimit: 2_500,
    itemizedReceiptRequired: true,
    statutorySummary: "R.I. Gen. Laws § 34-18-19 requires return of deposits with an itemized statement within 20 days of move-out. Landlords who fail to comply without reasonable cause are liable for twice the amount wrongfully withheld plus reasonable attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine cleaning fees"],
    demandLetterStatutoryClause: createDemandClause(
      "Rhode Island", "Rhode Island", "R.I. Gen. Laws § 34-18-19", 20,
      "Rhode Island District Court (Small Claims)", "el Tribunal de Distrito de Rhode Island",
      "plus statutory damages equal to twice (2×) the amount wrongfully withheld",
      "más daños estatutarios del doble (2×) del monto retenido indebidamente"
    ),
  },

  // ── SOUTH CAROLINA ──
  SC: {
    slug: "south-carolina",
    stateCode: "SC",
    stateName: { en: "South Carolina", es: "Carolina del Sur" },
    deadlineDays: 30,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "S.C. Code § 27-40-410",
    officialGovUrl: "https://www.scstatehouse.gov/code/t27c040.php",
    certifiedMailRequired: false,
    smallClaimsLimit: 7_500,
    itemizedReceiptRequired: true,
    statutorySummary: "S.C. Code Ann. § 27-40-410 requires landlords to return deposits and itemized accounting within 30 days of tenant demand. Landlords who fail to comply in bad faith are liable for up to three times (3x) the amount wrongfully withheld plus attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Charges without written itemization within 30 days"],
    demandLetterStatutoryClause: createDemandClause(
      "South Carolina", "Carolina del Sur", "S.C. Code § 27-40-410", 30,
      "South Carolina Magistrate Court", "el Tribunal de Magistrado de Carolina del Sur",
      "plus three times (3×) the amount wrongfully withheld plus attorney fees",
      "más tres veces (3×) la cantidad retenida indebidamente más honorarios"
    ),
  },

  // ── SOUTH DAKOTA ──
  SD: {
    slug: "south-dakota",
    stateCode: "SD",
    stateName: { en: "South Dakota", es: "Dakota del Sur" },
    deadlineDays: 14,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 200,
    legalCodeCitation: "S.D. Codified Laws § 43-32-24",
    officialGovUrl: "https://sdlegislature.gov/Statutes/43-32-24",
    certifiedMailRequired: false,
    smallClaimsLimit: 12_000,
    itemizedReceiptRequired: true,
    statutorySummary: "S.D. Codified Laws § 43-32-24 requires deposit return within two weeks (14 days) of lease termination. If deductions are made, an itemized statement must be provided within 45 days. Landlords who withhold in bad faith forfeit deduction rights and face punitive damages.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Unitemized repair deductions"],
    demandLetterStatutoryClause: createDemandClause(
      "South Dakota", "Dakota del Sur", "S.D. Codified Laws § 43-32-24", 14,
      "South Dakota Small Claims Court", "el Tribunal de Reclamos Menores de Dakota del Sur",
      "plus punitive damages up to $200 for bad-faith withholding",
      "más daños punitivos de hasta $200 por retención de mala fe"
    ),
  },

  // ── TENNESSEE ──
  TN: {
    slug: "tennessee",
    stateCode: "TN",
    stateName: { en: "Tennessee", es: "Tennessee" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 0,
    legalCodeCitation: "Tenn. Code § 66-28-301",
    officialGovUrl: "https://law.justia.com/codes/tennessee/title-66/chapter-28/part-3/section-66-28-301/",
    certifiedMailRequired: false,
    smallClaimsLimit: 25_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Tenn. Code Ann. § 66-28-301 (URLTA) mandates deposits be kept in a dedicated banking escrow account. Landlords must conduct a joint move-out inspection and provide an itemized damage list within 30 days. Landlords who fail to maintain escrow forfeit all rights to withhold any deposit.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Deductions without joint move-out inspection opportunity"],
    demandLetterStatutoryClause: createDemandClause(
      "Tennessee", "Tennessee", "Tenn. Code § 66-28-301", 30,
      "Tennessee General Sessions Court", "el Tribunal de Sesiones Generales de Tennessee",
      "forfeiting all rights to retain the deposit and mandating full refund",
      "perdiendo todo derecho a retener el depósito y exigiendo su restitución"
    ),
  },

  // ── TEXAS (Preserved exact statute text & citation) ──
  TX: {
    slug: "texas",
    stateCode: "TX",
    stateName: { en: "Texas", es: "Texas" },
    deadlineDays: 30,
    penaltyMultiplier: 3,
    penaltyMultiplierText: "3x withheld amount + $100",
    statutoryBonus: 100,
    legalCodeCitation: "Texas Property Code § 92.103, § 92.109",
    officialGovUrl: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm#92.109",
    certifiedMailRequired: false,
    smallClaimsLimit: 20_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Texas Property Code § 92.109 strictly enforces a 30-day deposit return window. Bad-faith retention is presumed if the landlord fails to provide an itemized statement within 30 days. Landlords face mandatory statutory damages of $100 plus three times (3x) the withheld amount, plus attorney fees.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Charges without written itemization sent to forwarding address",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to Texas Property Code § 92.103 and § 92.109, you were " +
        "required to return my security deposit or provide a written " +
        "description of damages and charges within thirty (30) days of my " +
        "surrendering the premises. Your bad-faith retention of the " +
        "deposit entitles me to recover three (3) times the portion of " +
        "the deposit wrongfully withheld, plus a statutory penalty of " +
        "$100, plus reasonable attorney's fees. If full payment is not " +
        "received within ten (10) business days of this letter, I intend " +
        "to file suit in Texas Justice Court to recover all amounts owed.",
      es:
        "De conformidad con el Código de Propiedad de Texas § 92.103 y " +
        "§ 92.109, usted estaba obligado a devolver mi depósito de " +
        "seguridad o proporcionar una descripción escrita de daños y " +
        "cargos dentro de treinta (30) días de mi entrega del inmueble. " +
        "Su retención de mala fe del depósito me da derecho a recuperar " +
        "tres (3) veces la porción del depósito retenida indebidamente, " +
        "más una penalidad legal de $100, más honorarios razonables de " +
        "abogado. Si no recibo el pago completo dentro de diez (10) días " +
        "hábiles a partir de esta carta, tengo la intención de presentar " +
        "una demanda en el Tribunal de Justicia de Texas para recuperar " +
        "todas las cantidades adeudadas.",
    },
  },

  // ── UTAH ──
  UT: {
    slug: "utah",
    stateCode: "UT",
    stateName: { en: "Utah", es: "Utah" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 100,
    legalCodeCitation: "Utah Code § 57-17-3",
    officialGovUrl: "https://le.utah.gov/xcode/Title57/Chapter17/57-17-S3.html",
    certifiedMailRequired: false,
    smallClaimsLimit: 15_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Utah Code Ann. § 57-17-3 mandates return within 30 days (or 15 days from notice). If the landlord fails to return the deposit after receiving a 5-day tenant demand notice, the tenant is entitled to recover the entire deposit plus a $100 statutory civil penalty and court costs.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine cleaning fees"],
    demandLetterStatutoryClause: createDemandClause(
      "Utah", "Utah", "Utah Code § 57-17-3", 30,
      "Utah Small Claims Court", "el Tribunal de Reclamos Menores de Utah",
      "plus a $100 civil penalty and full deposit recovery",
      "más una sanción civil de $100 y recuperación total del depósito"
    ),
  },

  // ── VERMONT ──
  VT: {
    slug: "vermont",
    stateCode: "VT",
    stateName: { en: "Vermont", es: "Vermont" },
    deadlineDays: 14,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "9 V.S.A. § 4461",
    officialGovUrl: "https://legislature.vermont.gov/statutes/section/09/137/04461",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Vt. Stat. Ann. tit. 9, § 4461 requires landlords to return deposits and itemized damage statements within 14 days of move-out. Landlords who willfully fail to return deposits forfeit all deduction rights and are liable for double the deposit amount plus attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine repainting charges"],
    demandLetterStatutoryClause: createDemandClause(
      "Vermont", "Vermont", "9 V.S.A. § 4461", 14,
      "Vermont Superior Court (Small Claims)", "el Tribunal Superior de Vermont",
      "plus double (2×) the amount wrongfully withheld plus attorney fees",
      "más el doble (2×) del monto retenido indebidamente más honorarios"
    ),
  },

  // ── VIRGINIA ──
  VA: {
    slug: "virginia",
    stateCode: "VA",
    stateName: { en: "Virginia", es: "Virginia" },
    deadlineDays: 45,
    penaltyMultiplier: 0,
    penaltyMultiplierText: "100% refund required",
    statutoryBonus: 0,
    legalCodeCitation: "Va. Code § 55.1-1226",
    officialGovUrl: "https://law.lis.virginia.gov/vacode/title55.1/chapter12/section55.1-1226/",
    certifiedMailRequired: false,
    smallClaimsLimit: 5_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Va. Code Ann. § 55.1-1226 (VRLTA) requires return of deposits and itemized deductions within 45 days. Landlords must give tenants notice of their right to be present at the move-out inspection. Willful failure to return funds constitutes a statutory violation subject to actual damages and attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Charges without written itemization within 45 days"],
    demandLetterStatutoryClause: createDemandClause(
      "Virginia", "Virginia", "Va. Code § 55.1-1226", 45,
      "Virginia General District Court (Small Claims)", "el Tribunal General de Distrito de Virginia",
      "forfeiting deduction rights and entitling me to full refund plus attorney fees",
      "anulando deducciones y exigiendo la devolución total más honorarios"
    ),
  },

  // ── WASHINGTON (Preserved exact statute text & citation) ──
  WA: {
    slug: "washington",
    stateCode: "WA",
    stateName: { en: "Washington", es: "Washington" },
    deadlineDays: 21,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "RCW 59.18.280",
    officialGovUrl: "https://app.leg.wa.gov/rcw/default.aspx?cite=59.18.280",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Wash. Rev. Code § 59.18.280 mandates that landlords return deposits with itemized deduction receipts within 30 days of surrender. Failure to provide a move-in condition checklist or timely accounting forfeits all deductions, and bad-faith refusal triggers double (2x) damages.",
    commonIllegalDeductions: [
      ...COMMON_ILLEGAL_DEDUCTIONS,
      "Deductions without required written checklist at move-in and move-out",
    ],
    demandLetterStatutoryClause: {
      en:
        "Pursuant to RCW 59.18.280, you were required to return my " +
        "security deposit or provide a full and specific statement of the " +
        "basis for retaining any portion within twenty-one (21) days of " +
        "my vacating the premises. Your failure to comply entitles me to " +
        "recover the withheld balance plus a penalty of up to two (2) " +
        "times the amount of the deposit. If full payment is not received " +
        "within ten (10) business days of this letter, I intend to file " +
        "suit in Washington Small Claims Court to recover all amounts " +
        "owed, including statutory penalties and court costs.",
      es:
        "De conformidad con RCW 59.18.280, usted estaba obligado a " +
        "devolver mi depósito de seguridad o proporcionar una declaración " +
        "completa y específica de la base para retener cualquier porción " +
        "dentro de veintiún (21) días de mi desocupación del inmueble. " +
        "Su incumplimiento me da derecho a recuperar el saldo retenido " +
        "más una penalidad de hasta dos (2) veces el monto del depósito. " +
        "Si no recibo el pago completo dentro de diez (10) días hábiles " +
        "a partir de esta carta, tengo la intención de presentar una " +
        "demanda en el Tribunal de Reclamos Menores de Washington.",
    },
  },

  // ── WEST VIRGINIA ──
  WV: {
    slug: "west-virginia",
    stateCode: "WV",
    stateName: { en: "West Virginia", es: "Virginia Occidental" },
    deadlineDays: 60,
    penaltyMultiplier: 1.5,
    penaltyMultiplierText: "1.5x withheld amount",
    statutoryBonus: 0,
    legalCodeCitation: "W. Va. Code § 37-6A-2",
    officialGovUrl: "https://www.wvlegislature.gov/wvcode/ChapterEntire.cfm?chap=37&art=6A&section=2",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "W. Va. Code § 37-6A-2 requires landlords to return deposits within 60 days (or 45 days if new tenants occupy). Failure to provide an itemized statement or refund within the deadline entitles the tenant to recover up to 1.5 times the amount wrongfully withheld plus attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Non-itemized deduction charges"],
    demandLetterStatutoryClause: createDemandClause(
      "West Virginia", "Virginia Occidental", "W. Va. Code § 37-6A-2", 60,
      "West Virginia Magistrate Court", "el Tribunal de Magistrado de Virginia Occidental",
      "plus statutory damages equal to one and a half times (1.5×) the withheld amount",
      "más daños estatutarios de una y media veces (1.5×) la cantidad retenida"
    ),
  },

  // ── WISCONSIN ──
  WI: {
    slug: "wisconsin",
    stateCode: "WI",
    stateName: { en: "Wisconsin", es: "Wisconsin" },
    deadlineDays: 21,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Wis. Stat. § 704.28",
    officialGovUrl: "https://docs.legis.wisconsin.gov/code/admin_code/atcp/090/134/06",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Under Wis. Stat. § 704.28 and Wis. Admin. Code ATCP 134.06, landlords have 21 days to return deposits with an itemized accounting. Failure to comply violates unfair trade practice laws, subjecting landlords to double (2x) pecuniary damages and mandatory attorney fees.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine carpet cleaning without separate tenant agreement"],
    demandLetterStatutoryClause: createDemandClause(
      "Wisconsin", "Wisconsin", "Wis. Stat. § 704.28", 21,
      "Wisconsin Small Claims Court", "el Tribunal de Reclamos Menores de Wisconsin",
      "plus double (2×) damages plus reasonable attorney fees",
      "más el doble (2×) de daños más honorarios razonables de abogado"
    ),
  },

  // ── WYOMING ──
  WY: {
    slug: "wyoming",
    stateCode: "WY",
    stateName: { en: "Wyoming", es: "Wyoming" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    penaltyMultiplierText: "2x deposit",
    statutoryBonus: 0,
    legalCodeCitation: "Wyo. Stat. § 1-21-1208",
    officialGovUrl: "https://wyoleg.gov/statutes/compress/title01.pdf",
    certifiedMailRequired: false,
    smallClaimsLimit: 6_000,
    itemizedReceiptRequired: true,
    statutorySummary: "Wyo. Stat. Ann. § 1-21-1208 requires landlords to return deposits within 30 days of lease expiration (or 15 days after forwarding address receipt). Landlords who fail to provide itemized notices forfeit all deductions and can be held liable for double the wrongfully withheld amount.",
    commonIllegalDeductions: [...COMMON_ILLEGAL_DEDUCTIONS, "Routine repainting charges"],
    demandLetterStatutoryClause: createDemandClause(
      "Wyoming", "Wyoming", "Wyo. Stat. § 1-21-1208", 30,
      "Wyoming Circuit Court (Small Claims)", "el Tribunal de Circuito de Wyoming",
      "plus double (2×) the amount withheld plus court costs",
      "más el doble (2×) del monto retenido más costos judiciales"
    ),
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Default / fallback for unlisted territories
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_STATUTE: StateStatute = {
  slug: "us-default",
  stateCode: "DEFAULT",
  stateName: { en: "Your State", es: "Su Estado" },
  deadlineDays: 30,
  penaltyMultiplier: 0,
  penaltyMultiplierText: "Actual unreturned deposit",
  statutoryBonus: 0,
  legalCodeCitation: "Refer to your state's landlord-tenant code",
  officialGovUrl: "https://www.usa.gov/housing",
  certifiedMailRequired: false,
  itemizedReceiptRequired: true,
  smallClaimsLimit: 10_000,
  statutorySummary:
    "Under general US landlord-tenant jurisprudence and common law principles, property owners must return tenant security deposits within a reasonable timeframe (typically 30 days) and supply itemized receipts for lawful deductions. Landlords cannot deduct for normal wear and tear.",
  commonIllegalDeductions: COMMON_ILLEGAL_DEDUCTIONS,
  demandLetterStatutoryClause: {
    en:
      "Pursuant to applicable state landlord-tenant law, you were required " +
      "to return my security deposit or provide an itemized statement of " +
      "deductions within the statutory deadline. Your failure to comply " +
      "may entitle me to recover the withheld balance plus any statutory " +
      "damages provided under state law. If full payment is not received " +
      "within ten (10) business days of this letter, I intend to file " +
      "suit in the appropriate court to recover all amounts owed.",
    es:
      "De conformidad con la ley estatal aplicable de propietarios e " +
      "inquilinos, usted estaba obligado a devolver mi depósito de " +
      "seguridad o proporcionar un estado de cuenta detallado de " +
      "deducciones dentro del plazo legal. Su incumplimiento puede darme " +
      "derecho a recuperar el saldo retenido más cualquier daño legal " +
      "previsto por la ley estatal. Si no recibo el pago completo dentro " +
      "de diez (10) días hábiles a partir de esta carta, tengo la " +
      "intención de presentar una demanda en el tribunal correspondiente " +
      "para recuperar todas las cantidades adeudadas.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retrieve the statute for a given two-letter state code.
 * Falls back to `DEFAULT_STATUTE` for unlisted states.
 */
export function getStatute(stateCode: string): StateStatute {
  return STATE_STATUTES[stateCode.toUpperCase()] ?? DEFAULT_STATUTE;
}

/** All supported state codes (excludes DEFAULT). */
export const SUPPORTED_STATE_CODES = Object.keys(STATE_STATUTES);
