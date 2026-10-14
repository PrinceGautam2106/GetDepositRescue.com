// ─────────────────────────────────────────────────────────────────────────────
// State Statute Data Model & Registry
// Security deposit return deadlines, penalties, and statutory citations for
// the ten highest-traffic US renter states, plus a conservative fallback.
//
// ⚠️  This data is provided for informational self-help calculation only.
//     It does NOT constitute legal advice.  Always verify against current
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
   * damages.  0 = no statutory multiplier (actual damages only).
   */
  penaltyMultiplier: number;

  /**
   * Flat dollar bonus added on top of the multiplier penalty (e.g. TX
   * adds $100).  Most states set this to 0.
   */
  statutoryBonus: number;

  /** Official code citation (e.g. "California Civil Code § 1950.5"). */
  legalCodeCitation: string;

  /** Whether the statute requires the landlord to use certified mail. */
  certifiedMailRequired: boolean;

  /** Dollar cap for the state's small-claims court (individual filer). */
  smallClaimsLimit: number;

  /**
   * Deductions that are almost universally disallowed as "normal wear and
   * tear" under this state's law.  Used by the calculator to flag
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

// ─────────────────────────────────────────────────────────────────────────────
// State Statute Registry  (Top 10 states + default)
// ─────────────────────────────────────────────────────────────────────────────

export const STATE_STATUTES: Record<string, StateStatute> = {
  // ── California ──────────────────────────────────────────────────────────
  CA: {
    stateCode: "CA",
    stateName: { en: "California", es: "California" },
    deadlineDays: 21,
    penaltyMultiplier: 2,
    statutoryBonus: 0,
    legalCodeCitation: "California Civil Code § 1950.5",
    certifiedMailRequired: false,
    smallClaimsLimit: 12_500,
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

  // ── Texas ───────────────────────────────────────────────────────────────
  TX: {
    stateCode: "TX",
    stateName: { en: "Texas", es: "Texas" },
    deadlineDays: 30,
    penaltyMultiplier: 3,
    statutoryBonus: 100,
    legalCodeCitation: "Texas Property Code § 92.103, § 92.109",
    certifiedMailRequired: false,
    smallClaimsLimit: 20_000,
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

  // ── New York ────────────────────────────────────────────────────────────
  NY: {
    stateCode: "NY",
    stateName: { en: "New York", es: "Nueva York" },
    deadlineDays: 14,
    penaltyMultiplier: 2,
    statutoryBonus: 0,
    legalCodeCitation: "New York General Obligations Law § 7-108",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
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

  // ── Florida ─────────────────────────────────────────────────────────────
  FL: {
    stateCode: "FL",
    stateName: { en: "Florida", es: "Florida" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    statutoryBonus: 0,
    legalCodeCitation: "Florida Statute § 83.49",
    certifiedMailRequired: true,
    smallClaimsLimit: 8_000,
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

  // ── Illinois ────────────────────────────────────────────────────────────
  IL: {
    stateCode: "IL",
    stateName: { en: "Illinois", es: "Illinois" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    statutoryBonus: 0,
    legalCodeCitation: "765 ILCS 710 (Illinois Security Deposit Return Act)",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
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

  // ── Washington ──────────────────────────────────────────────────────────
  WA: {
    stateCode: "WA",
    stateName: { en: "Washington", es: "Washington" },
    deadlineDays: 21,
    penaltyMultiplier: 2,
    statutoryBonus: 0,
    legalCodeCitation: "RCW 59.18.280",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
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

  // ── Colorado ────────────────────────────────────────────────────────────
  CO: {
    stateCode: "CO",
    stateName: { en: "Colorado", es: "Colorado" },
    deadlineDays: 30,
    penaltyMultiplier: 3,
    statutoryBonus: 0,
    legalCodeCitation: "C.R.S. § 38-12-103",
    certifiedMailRequired: false,
    smallClaimsLimit: 7_500,
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

  // ── Pennsylvania ────────────────────────────────────────────────────────
  PA: {
    stateCode: "PA",
    stateName: { en: "Pennsylvania", es: "Pensilvania" },
    deadlineDays: 30,
    penaltyMultiplier: 2,
    statutoryBonus: 0,
    legalCodeCitation: "68 Pa.C.S. § 250.512 (Landlord and Tenant Act)",
    certifiedMailRequired: false,
    smallClaimsLimit: 12_000,
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

  // ── Georgia ─────────────────────────────────────────────────────────────
  GA: {
    stateCode: "GA",
    stateName: { en: "Georgia", es: "Georgia" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    statutoryBonus: 0,
    legalCodeCitation: "O.C.G.A. § 44-7-34, § 44-7-35",
    certifiedMailRequired: false,
    smallClaimsLimit: 15_000,
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

  // ── North Carolina ──────────────────────────────────────────────────────
  NC: {
    stateCode: "NC",
    stateName: { en: "North Carolina", es: "Carolina del Norte" },
    deadlineDays: 30,
    penaltyMultiplier: 0,
    statutoryBonus: 0,
    legalCodeCitation: "N.C. Gen. Stat. § 42-52",
    certifiedMailRequired: false,
    smallClaimsLimit: 10_000,
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
};

// ─────────────────────────────────────────────────────────────────────────────
// Default / fallback for unlisted states
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_STATUTE: StateStatute = {
  stateCode: "DEFAULT",
  stateName: { en: "Your State", es: "Su Estado" },
  deadlineDays: 30,
  penaltyMultiplier: 0,
  statutoryBonus: 0,
  legalCodeCitation: "Refer to your state's landlord-tenant code",
  certifiedMailRequired: false,
  smallClaimsLimit: 10_000,
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
// Lookup helper
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
