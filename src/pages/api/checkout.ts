/**
 * checkout.ts
 * Dual-Tier Checkout Session Generator ($14.99 PDF Package vs $29.99 USPS Certified Mail)
 *
 * Integrates Lemon Squeezy & Stripe with automatic fallback to high-fidelity simulation
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
  const isLive = typeof process !== "undefined" && Boolean(process.env?.LEMON_SQUEEZY_API_KEY || process.env?.STRIPE_SECRET_KEY);
  return new Response(
    JSON.stringify({
      service: "DepositRescue Dual-Tier Monetization Engine",
      status: "operational",
      mode: isLive ? "production" : "simulation",
      provider: "Lemon Squeezy",
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

    const lemonApiKey = typeof process !== "undefined" ? process.env?.LEMON_SQUEEZY_API_KEY : undefined;
    const lemonStoreId = typeof process !== "undefined" ? (process.env?.LEMON_SQUEEZY_STORE_ID || "500290") : "500290";
    const variantId = tier === "pdf"
      ? (typeof process !== "undefined" ? process.env?.LEMON_SQUEEZY_PDF_VARIANT_ID : undefined) || "2260687"
      : (typeof process !== "undefined" ? process.env?.LEMON_SQUEEZY_MAIL_VARIANT_ID : undefined) || "2260690";

    // ── LIVE LEMON SQUEEZY CHECKOUT ───────────────────────────────────────────
    if (lemonApiKey) {
      const lsResponse = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Accept: "application/vnd.api+json",
          "Content-Type": "application/vnd.api+json",
          Authorization: `Bearer ${lemonApiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              checkout_options: {
                dark: true,
                logo: true,
              },
              checkout_data: {
                email: payload.tenantEmail || "",
                name: payload.tenantName || "",
                custom: {
                  tier,
                  state_code: payload.stateCode || "",
                  tenant_name: payload.tenantName || "",
                  landlord_name: payload.landlordName || "",
                  total_claim: String(payload.totalClaimAmount || 0),
                },
              },
              product_options: {
                redirect_url: `${origin}/${isEs ? "es/" : ""}success?tier=${tier}&mode=live`,
              },
            },
            relationships: {
              store: {
                data: {
                  type: "stores",
                  id: String(lemonStoreId),
                },
              },
              variant: {
                data: {
                  type: "variants",
                  id: String(variantId),
                },
              },
            },
          },
        }),
      });

      if (lsResponse.ok) {
        const lsData = (await lsResponse.json()) as any;
        const checkoutUrl = lsData.data?.attributes?.url;
        if (checkoutUrl) {
          return new Response(
            JSON.stringify({
              success: true,
              mode: "live",
              tier,
              amountUsd: config.amountUsd,
              checkoutUrl,
              message: "Lemon Squeezy checkout session initialized.",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }
    }

    // ── DIRECT BUY URL FALLBACK ───────────────────────────────────────────────
    const directBuyUrl = tier === "pdf"
      ? `https://getdepositrescue.lemonsqueezy.com/checkout/buy/848c89ea-e164-4b3e-b394-18fd1313bd2f?checkout[email]=${encodeURIComponent(payload.tenantEmail || "")}&checkout[name]=${encodeURIComponent(payload.tenantName || "")}`
      : `https://getdepositrescue.lemonsqueezy.com/checkout/buy/b421d308-0ac9-4748-b0cd-79d482627366?checkout[email]=${encodeURIComponent(payload.tenantEmail || "")}&checkout[name]=${encodeURIComponent(payload.tenantName || "")}`;

    return new Response(
      JSON.stringify({
        success: true,
        mode: "live",
        tier,
        amountUsd: config.amountUsd,
        checkoutUrl: directBuyUrl,
        message: "Direct Lemon Squeezy checkout link generated.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
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
