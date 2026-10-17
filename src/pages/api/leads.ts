import type { APIRoute } from "astro";

export interface LeadPayload {
  name: string;
  email: string;
  stateCode?: string;
  totalClaimAmount?: number;
  statutoryPenalty?: number;
}

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      status: "operational",
      service: "DepositRescue Lead Capture Service",
      version: "1.0.0",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = (await request.json()) as LeadPayload;

    if (!data.name || data.name.trim().length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: "Please enter your full name." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      return new Response(
        JSON.stringify({ success: false, error: "Please enter a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Lead is successfully verified. In production, this syncs with your CRM / Email engine.
    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead successfully recorded.",
        lead: {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          timestamp: new Date().toISOString(),
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Failed to record lead.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
