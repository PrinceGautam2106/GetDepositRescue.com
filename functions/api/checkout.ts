/**
 * functions/api/checkout.ts
 * Cloudflare Pages Serverless Function for Lemon Squeezy & Stripe Checkouts.
 */

interface Env {
  LEMON_SQUEEZY_API_KEY?: string;
  LEMON_SQUEEZY_STORE_ID?: string;
  LEMON_SQUEEZY_PDF_VARIANT_ID?: string;
  LEMON_SQUEEZY_MAIL_VARIANT_ID?: string;
  STRIPE_SECRET_KEY?: string;
}

export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({
      status: "operational",
      service: "DepositRescue Cloudflare Edge Checkout Engine",
      provider: "Lemon Squeezy & Stripe",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const payload = (await request.json()) as {
      tier: "pdf" | "mail";
      stateCode?: string;
      tenantName?: string;
      tenantEmail?: string;
      landlordName?: string;
      totalClaimAmount?: number;
      origin?: string;
      locale?: "en" | "es";
    };

    const tier = payload.tier === "pdf" ? "pdf" : "mail";
    const origin = payload.origin || "https://getdepositrescue.com";
    const isEs = payload.locale === "es";

    const lemonApiKey = env.LEMON_SQUEEZY_API_KEY;
    const storeId = env.LEMON_SQUEEZY_STORE_ID || "500290";
    const variantId =
      tier === "pdf"
        ? env.LEMON_SQUEEZY_PDF_VARIANT_ID || "2260687"
        : env.LEMON_SQUEEZY_MAIL_VARIANT_ID || "2260690";

    const amountUsd = tier === "pdf" ? 14.99 : 29.99;

    // Call Lemon Squeezy Checkouts API
    const lsRes = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
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
                id: String(storeId),
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

    if (lsRes.ok) {
      const lsData = (await lsRes.json()) as any;
      const checkoutUrl = lsData.data?.attributes?.url;
      if (checkoutUrl) {
        return new Response(
          JSON.stringify({
            success: true,
            mode: "live",
            tier,
            amountUsd,
            checkoutUrl,
            message: "Lemon Squeezy checkout URL created successfully.",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // Direct Buy URL Fallback
    const directBuyUrl =
      tier === "pdf"
        ? `https://getdepositrescue.lemonsqueezy.com/checkout/buy/848c89ea-e164-4b3e-b394-18fd1313bd2f?checkout[email]=${encodeURIComponent(payload.tenantEmail || "")}&checkout[name]=${encodeURIComponent(payload.tenantName || "")}`
        : `https://getdepositrescue.lemonsqueezy.com/checkout/buy/b421d308-0ac9-4748-b0cd-79d482627366?checkout[email]=${encodeURIComponent(payload.tenantEmail || "")}&checkout[name]=${encodeURIComponent(payload.tenantName || "")}`;

    return new Response(
      JSON.stringify({
        success: true,
        mode: "live",
        tier,
        amountUsd,
        checkoutUrl: directBuyUrl,
        message: "Direct checkout URL generated.",
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
        error: err instanceof Error ? err.message : "Checkout error",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
