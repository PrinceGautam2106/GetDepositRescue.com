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

    const lemonApiKey =
      env.LEMON_SQUEEZY_API_KEY ||
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI1YmY2YmEzMTg1OTE0NjAyOTBkZTU0MGE1MzYzYTJiMTk2MmFkOGE5ZjVhYmVlYzg0MDJkYjg4ODEzODljZGJjZTllOTk3NjQ0ZGIyMjJiMyIsImlhdCI6MTc5MjI1Njg0Ni4xNDY0MzgsIm5iZiI6MTc5MjI1Njg0Ni4xNDY0NCwiZXhwIjoxODA3OTIwMDAwLjAxOTQzMSwic3ViIjoiNzk5MjU0NCIsInNjb3BlcyI6W119.b4nskHWvQVHzhpmOLHQY46h_Rqjh7680lWYHmQ1HTTiKXGq0M9LVSgHQ9vHL38q_9qnAUFF48mPLsz5M4xgFY6Nu3wqQQbL6YKHQK95GvaQJF27S7NZzrxggVFaO0FuHi-rmBrvv-1YunZufON2Sjyt48XjQ7msgk1MmbFMtaEDgTwOlsaL4TTzfNiPheoPX6SvxJG5BzYom_19D68Mi0IPjixXqjCg8pChDLY3XAbedCQzO9znV4ypckXcGHmTImfV-3svSNesQIT3CuSEjtUlgxOM2DN4-WDabXdbmHqbQuHxvcs92gpjqAnK2vVG3FyWTYhiGFbFkHbWvCGalA5NIo92aR4xWqtWEk5uO-JHMy7MYTbzzIH7bXko3p26z2n-K1mW-WOlq8v2T7PxM85OJoLBuQCWlwP_BLj9bvurp15UcaXyCvlXj_dAvTnAXHu2DSn9k_ot2vwOyPQfFSPyCsTR-b54_4WftZhq2ORwMj87RB7L3sazXMWaNc5cQUUL2Gk2bLj0jRW2M5sFRa_3gN0pPaKbYkElyiYjm1FH2CjqaTNIk9asDVYpgIV-JmAmp2bo8oR20tAnEVMmXpna-zkZT1omVaTQIKtgAoCz8DnHxYhcNwBdPfFGiXXlPqw_jLcS_HIo2RmmPx6W00OBnCL0Y1fRxjvNnVl-GgWw";
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
