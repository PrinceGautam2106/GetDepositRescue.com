/**
 * checkout.ts
 * Dual-Tier Checkout Session Generator ($14.99 PDF Package vs $29.99 USPS Certified Mail)
 *
 * Integrates Stripe Checkout with automatic fallback to high-fidelity simulation
 * in local development or static deployment mode.
 */

import type { APIRoute } from "astro";

export interface CheckoutPayload {
  tier: "pdf" | "mail";
  stateCode?: string;
  tenantName?: string;
  tenantEmail?: string;
  landlordName?: string;
  totalClaimAmount?: number;
  letterContent?: string;
  origin?: string;
  locale?: "en" | "es";
}

export interface CheckoutResponse {
  success: boolean;
  mode: "live" | "simulated";
  tier: "pdf" | "mail";
  checkoutUrl?: string;
  redirectUrl?: string;
  amountUsd: number;
  message: string;
}

export const GET: APIRoute = async () => {
  const isLive = typeof process !== "undefined" && Boolean(process.env?.STRIPE_SECRET_KEY);
  return new Response(
    JSON.stringify({
      service: "DepositRescue Dual-Tier Monetization Engine",
      status: "operational",
      mode: isLive ? "production" : "simulation",
      tiers: {
        pdf: {
          name: "Official Legal PDF Package",
          priceUsd: 14.99,
          features: [
            "Instant PDF download",
            "State statute citation clause",
            "Small claims court checklist",
            "Itemized dispute ledger",
          ],
        },
        mail: {
          name: "USPS Certified Mail Delivery",
          priceUsd: 29.99,
          recommended: true,
          features: [
            "Print, package & dispatch via USPS Certified Mail",
            "Official USPS tracking number",
            "Legal signature receipt for court evidence",
            "Saves you a trip to the post office",
          ],
        },
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    const tier = payload.tier === "pdf" ? "pdf" : "mail";
    const origin = payload.origin || url.origin || "https://getdepositrescue.com";
    const isEs = payload.locale === "es";

    const config = tier === "pdf"
      ? {
          amountCents: 1499,
          amountUsd: 14.99,
          productName: isEs ? "Paquete Legal PDF Oficial" : "Official Legal PDF Package",
          productDesc: isEs
            ? "Descarga inmediata de carta de demanda con citación legal y lista de verificación judicial"
            : "Immediate demand letter PDF download with statutory citation clause & court checklist",
        }
      : {
          amountCents: 2999,
          amountUsd: 29.99,
          productName: isEs ? "Entrega por Correo Certificado USPS" : "USPS Certified Mail Delivery",
          productDesc: isEs
            ? "Impresión y despacho oficial con número de rastreo y acuse de recibo para la corte"
            : "Turnkey printing, packaging, and dispatch with USPS tracking & court-admissible signature receipt",
        };

    const stripeSecretKey = typeof process !== "undefined" ? process.env?.STRIPE_SECRET_KEY : undefined;

    // ── LIVE STRIPE CHECKOUT SESSION ──────────────────────────────────────────
    if (stripeSecretKey) {
      const successUrl = `${origin}/${isEs ? "es/" : ""}success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`;
      const cancelUrl = `${origin}/${isEs ? "es/" : ""}calculator?payment=cancelled`;

      const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "payment_method_types[0]": "card",
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][unit_amount]": String(config.amountCents),
          "line_items[0][price_data][product_data][name]": config.productName,
          "line_items[0][price_data][product_data][description]": config.productDesc,
          "line_items[0][quantity]": "1",
          mode: "payment",
          success_url: successUrl,
          cancel_url: cancelUrl,
          "metadata[tier]": tier,
          "metadata[stateCode]": payload.stateCode || "",
          "metadata[tenantName]": payload.tenantName || "",
          "metadata[tenantEmail]": payload.tenantEmail || "",
          "metadata[landlordName]": payload.landlordName || "",
        }).toString(),
      });

      const sessionData = await stripeResponse.json();
      if (!stripeResponse.ok) {
        throw new Error(sessionData.error?.message || "Failed to create Stripe Checkout session");
      }

      const res: CheckoutResponse = {
        success: true,
        mode: "live",
        tier,
        amountUsd: config.amountUsd,
        checkoutUrl: sessionData.url,
        message: "Stripe checkout session initialized.",
      };

      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── SIMULATION / DEV MODE ────────────────────────────────────────────────
    const randDigits = () => Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `7023 ${randDigits()} ${randDigits()} ${randDigits()} ${randDigits()}`;
    const redirectUrl = `${origin}/${isEs ? "es/" : ""}success?tier=${tier}&mode=simulated&tracking=${encodeURIComponent(trackingCode)}&state=${payload.stateCode || "CA"}`;

    const res: CheckoutResponse = {
      success: true,
      mode: "simulated",
      tier,
      amountUsd: config.amountUsd,
      redirectUrl,
      message: "Simulation checkout generated. Redirecting to success fulfillment.",
    };

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Failed to initialize checkout session",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
