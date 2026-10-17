// ─────────────────────────────────────────────────────────────────────────────
// Calculator Wizard i18n Dictionary
// All UI copy in English and Spanish for the 4-step deposit recovery wizard.
// ─────────────────────────────────────────────────────────────────────────────

export type Locale = "en" | "es";

export interface WizardStrings {
  // ── Global ───────────────────────────────────────────────────────────────
  stepOf: string; // "Step {current} of {total}"
  next: string;
  back: string;
  restart: string;

  // ── Step Names for Stepper / Progress ────────────────────────────────────
  step1Name: string;
  step2Name: string;
  step3Name: string;
  step4Name: string;

  // ── Step 1: Location & Lease ─────────────────────────────────────────────
  step1Title: string;
  step1Subtitle: string;
  stateLabel: string;
  statePlaceholder: string;
  autoDetectedHint: string;
  moveOutLabel: string;
  moveOutPlaceholder: string;
  moveOutHelp: string;

  // ── Step 2: Financials & Deductions ──────────────────────────────────────
  step2Title: string;
  step2Subtitle: string;
  depositLabel: string;
  depositPlaceholder: string;
  returnedLabel: string;
  returnedPlaceholder: string;
  deductionsLabel: string;
  deductionPainting: string;
  deductionCarpet: string;
  deductionCleaning: string;
  deductionNoReceipt: string;
  deductionsHelp: string;

  // ── Step 3: Violation Assessment ─────────────────────────────────────────
  step3Title: string;
  step3Subtitle: string;
  daysElapsedLabel: string;
  deadlineLabel: string;
  violationBadge: string; // "Statutory Deadline Violated! ..."
  noViolationBadge: string;
  originalOwed: string;
  penaltyEntitlement: string;
  totalRecovery: string;
  smallClaimsEligible: string;
  smallClaimsIneligible: string;
  violationsDetected: string;
  statutoryCodeCitations: string;

  // ── Step 4: Demand Letter & Action ───────────────────────────────────────
  step4Title: string;
  step4Subtitle: string;
  demandLetterPreview: string;
  tenantDetailsToggle: string;
  yourNameLabel: string;
  yourNamePlaceholder: string;
  landlordNameLabel: string;
  landlordNamePlaceholder: string;
  propertyAddressLabel: string;
  propertyAddressPlaceholder: string;
  downloadDraft: string;
  sendCertifiedMail: string;
  certifiedMailNote: string;
  demandLetterGreeting: string;
  demandLetterIntro: string;
  demandLetterClosing: string;
  demandLetterSignoff: string;
  demandLetterDate: string;
  demandLetterTo: string;
  demandLetterFrom: string;
  demandLetterSubject: string;

  // ── Certified Mail Modal ─────────────────────────────────────────────────
  certifiedModalTitle: string;
  certifiedModalBadge: string;
  certifiedModalDesc: string;
  certifiedFeature1: string;
  certifiedFeature2: string;
  certifiedFeature3: string;
  certifiedPrice: string;
  certifiedCta: string;
  close: string;
}

const en: WizardStrings = {
  stepOf: "Step {current} of {total}",
  next: "Continue",
  back: "Back",
  restart: "Start Over",

  step1Name: "Location",
  step2Name: "Financials",
  step3Name: "Assessment",
  step4Name: "Demand Letter",

  step1Title: "Location & Lease Details",
  step1Subtitle: "Select where you rented and when you returned the keys to calculate statutory deadlines.",
  stateLabel: "State",
  statePlaceholder: "Select your state",
  autoDetectedHint: "Auto-detected from timezone",
  moveOutLabel: "Date You Moved Out / Returned Keys",
  moveOutPlaceholder: "Select date",
  moveOutHelp: "Statutory deadlines begin the day you vacate and return the keys.",

  step2Title: "Financials & Deductions",
  step2Subtitle: "Enter deposit figures and check any deductions your landlord withheld.",
  depositLabel: "Original Deposit Paid ($)",
  depositPlaceholder: "e.g. 2,000",
  returnedLabel: "Amount Landlord Actually Returned ($)",
  returnedPlaceholder: "0",
  deductionsLabel: "Deductions Landlord Claimed",
  deductionPainting: "Painting / Wall Scuffs",
  deductionCarpet: "Carpet / Floor Normal Wear",
  deductionCleaning: "General Deep Cleaning Fee",
  deductionNoReceipt: "Unspecified / Missing Itemized Receipt",
  deductionsHelp: "Most state statutes explicitly forbid withholding for wear-and-tear or unitemized charges.",

  step3Title: "Violation & Damage Assessment",
  step3Subtitle: "Your landlord's statutory violations, calculated instantly.",
  daysElapsedLabel: "Days Since Move-Out",
  deadlineLabel: "Statutory Return Deadline",
  violationBadge:
    "Statutory Deadline Violated! Your landlord may owe you up to {multiplier} your deposit under {code}.",
  noViolationBadge:
    "No deadline violation detected. Your landlord returned the deposit within the statutory window.",
  originalOwed: "Original Balance Owed",
  penaltyEntitlement: "Statutory Penalty Entitlement",
  totalRecovery: "Total Court Recovery Target",
  smallClaimsEligible: "Eligible for Small Claims Court",
  smallClaimsIneligible: "Exceeds Small Claims Limit — Consider Superior Court",
  violationsDetected: "Statutory Violations Detected",
  statutoryCodeCitations: "Statutory Legal Authority",

  step4Title: "Demand Letter & Action Bar",
  step4Subtitle: "Review your attorney-grade demand letter with statutory citations pre-filled.",
  demandLetterPreview: "Official Demand Letter Preview",
  tenantDetailsToggle: "Customize letter details (Optional)",
  yourNameLabel: "Your Full Name",
  yourNamePlaceholder: "e.g. Jane Doe",
  landlordNameLabel: "Landlord / Management Name",
  landlordNamePlaceholder: "e.g. Acme Properties LLC",
  propertyAddressLabel: "Rental Property Address",
  propertyAddressPlaceholder: "e.g. 123 Main St, Apt 4B, City, State ZIP",
  downloadDraft: "Download Free Draft PDF",
  sendCertifiedMail: "Send Legally Binding Certified Mail ($29.99)",
  certifiedMailNote:
    "Certified mail with USPS tracking is legally required for court proof in most jurisdictions.",
  demandLetterGreeting: "Dear Former Landlord / Property Manager,",
  demandLetterIntro:
    "I am writing to formally demand the return of my security deposit. The details of my claim are as follows:",
  demandLetterClosing:
    "Please remit payment within ten (10) business days of receipt of this letter to avoid formal court proceedings.",
  demandLetterSignoff: "Respectfully,",
  demandLetterDate: "Date:",
  demandLetterTo: "To:",
  demandLetterFrom: "From:",
  demandLetterSubject: "RE: Formal Demand for Return of Security Deposit",

  certifiedModalTitle: "Send USPS Certified Mail with Tracking",
  certifiedModalBadge: "Court-Admissible Legal Proof",
  certifiedModalDesc:
    "Judges in small claims court frequently dismiss claims if you cannot prove when the landlord received your formal demand. We print, package, and send your notice via USPS Certified Mail with electronic tracking.",
  certifiedFeature1: "Official USPS Certified Mail tracking number assigned instantly",
  certifiedFeature2: "Electronic Return Receipt with recipient signature & timestamp",
  certifiedFeature3: "Complete PDF proof-of-delivery certificate ready for court filing",
  certifiedPrice: "$29.99 One-time",
  certifiedCta: "Complete Certified Mail Order",
  close: "Close",
};

const es: WizardStrings = {
  stepOf: "Paso {current} de {total}",
  next: "Continuar",
  back: "Atrás",
  restart: "Empezar de Nuevo",

  step1Name: "Ubicación",
  step2Name: "Finanzas",
  step3Name: "Evaluación",
  step4Name: "Carta Demanda",

  step1Title: "Ubicación y Detalles del Arrendamiento",
  step1Subtitle: "Seleccione dónde alquiló y cuándo entregó las llaves para calcular los plazos legales.",
  stateLabel: "Estado",
  statePlaceholder: "Seleccione su estado",
  autoDetectedHint: "Detectado por zona horaria",
  moveOutLabel: "Fecha de Mudanza / Entrega de Llaves",
  moveOutPlaceholder: "Seleccione fecha",
  moveOutHelp: "El plazo legal comienza el día en que desocupa y entrega las llaves.",

  step2Title: "Finanzas y Deducciones",
  step2Subtitle: "Ingrese las cifras de su depósito y marque cualquier deducción retenida.",
  depositLabel: "Depósito Original Pagado ($)",
  depositPlaceholder: "ej. 2,000",
  returnedLabel: "Monto Devuelto por el Arrendador ($)",
  returnedPlaceholder: "0",
  deductionsLabel: "Deducciones Reclamadas por el Arrendador",
  deductionPainting: "Pintura / Marcas en Paredes",
  deductionCarpet: "Alfombra / Desgaste Normal del Piso",
  deductionCleaning: "Cargo por Limpieza Profunda General",
  deductionNoReceipt: "No Especificado / Sin Recibo Detallado",
  deductionsHelp: "La mayoría de las leyes estatales prohíben deducir desgaste normal o cargos sin recibos detallados.",

  step3Title: "Evaluación de Violaciones y Daños",
  step3Subtitle: "Las violaciones legales de su arrendador, calculadas al instante.",
  daysElapsedLabel: "Días Desde la Mudanza",
  deadlineLabel: "Plazo Legal de Devolución",
  violationBadge:
    "¡Plazo Legal Violado! Su arrendador puede deberle hasta {multiplier} de su depósito bajo {code}.",
  noViolationBadge:
    "No se detectó violación de plazo. Su arrendador devolvió el depósito dentro del plazo legal.",
  originalOwed: "Saldo Original Adeudado",
  penaltyEntitlement: "Derecho a Penalidad Legal",
  totalRecovery: "Objetivo Total de Recuperación en Corte",
  smallClaimsEligible: "Elegible para Corte de Reclamos Menores",
  smallClaimsIneligible:
    "Excede el Límite de Reclamos Menores — Considere Corte Superior",
  violationsDetected: "Violaciones Estatutarias Detectadas",
  statutoryCodeCitations: "Autoridad Legal Estatutaria",

  step4Title: "Carta de Demanda y Panel de Acción",
  step4Subtitle: "Revise su carta de demanda profesional con las citas legales estatales completadas.",
  demandLetterPreview: "Vista Previa de Carta Oficial de Demanda",
  tenantDetailsToggle: "Personalizar detalles de la carta (Opcional)",
  yourNameLabel: "Su Nombre Completo",
  yourNamePlaceholder: "ej. Juan Pérez",
  landlordNameLabel: "Nombre del Arrendador / Administrador",
  landlordNamePlaceholder: "ej. Propiedades Acme LLC",
  propertyAddressLabel: "Dirección de la Propiedad Alquilada",
  propertyAddressPlaceholder: "ej. 123 Main St, Apt 4B, Ciudad, Estado ZIP",
  downloadDraft: "Descargar Borrador Gratuito PDF",
  sendCertifiedMail: "Enviar Correo Certificado Vinculante ($29.99)",
  certifiedMailNote:
    "El correo certificado con rastreo USPS es legalmente requerido como prueba judicial en la mayoría de jurisdicciones.",
  demandLetterGreeting:
    "Estimado Antiguo Arrendador / Administrador de Propiedad,",
  demandLetterIntro:
    "Le escribo para exigir formalmente la devolución de mi depósito de seguridad. Los detalles de mi reclamación son los siguientes:",
  demandLetterClosing:
    "Por favor remita el pago dentro de diez (10) días hábiles a partir de la recepción de esta carta para evitar acciones judiciales formales.",
  demandLetterSignoff: "Respetuosamente,",
  demandLetterDate: "Fecha:",
  demandLetterTo: "Para:",
  demandLetterFrom: "De:",
  demandLetterSubject:
    "RE: Demanda Formal de Devolución de Depósito de Seguridad",

  certifiedModalTitle: "Enviar Correo Certificado USPS con Rastreo",
  certifiedModalBadge: "Prueba Legal Admisible en Corte",
  certifiedModalDesc:
    "Los jueces en cortes de reclamos menores a menudo desestiman casos si usted no puede probar la fecha de entrega de la demanda. Nosotros imprimimos, empaquetamos y enviamos su notificación por Correo Certificado USPS con rastreo electrónico.",
  certifiedFeature1: "Número de seguimiento oficial de USPS asignado al instante",
  certifiedFeature2: "Acuse de recibo electrónico con firma del destinatario y sello de fecha/hora",
  certifiedFeature3: "Certificado de prueba de entrega en PDF listo para presentar ante el juez",
  certifiedPrice: "$29.99 Pago único",
  certifiedCta: "Completar Orden de Correo Certificado",
  close: "Cerrar",
};

export const WIZARD_STRINGS: Record<Locale, WizardStrings> = { en, es };

export function getStrings(locale: Locale): WizardStrings {
  return WIZARD_STRINGS[locale] ?? WIZARD_STRINGS.en;
}
