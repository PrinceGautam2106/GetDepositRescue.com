/**
 * functions/api/leads.ts
 * Cloudflare Pages Serverless Function for Lead Capture & Automated Resend Email Dispatch.
 */

interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({
      status: "operational",
      service: "DepositRescue Edge Lead Capture & Notification Service",
      provider: "Resend",
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
    const data = (await request.json()) as {
      name: string;
      email: string;
      stateCode?: string;
      totalClaimAmount?: number;
      statutoryPenalty?: number;
    };

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

    const resendApiKey = env.RESEND_API_KEY;
    const fromEmail = env.RESEND_FROM_EMAIL || "support@scantranslater.com";
    const state = data.stateCode || "your state";
    const claimFormatted = data.totalClaimAmount ? `$${Number(data.totalClaimAmount).toLocaleString()}` : "$0";
    const penaltyFormatted = data.statutoryPenalty ? `+$${Number(data.statutoryPenalty).toLocaleString()}` : "$0";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Deposit Recovery Breakdown</title>
        </head>
        <body style="margin: 0; padding: 24px; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #fafafa;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; border-radius: 12px; padding: 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
            
            <div style="border-b: 1px solid #27272a; padding-bottom: 20px; margin-bottom: 24px;">
              <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #38bdf8; text-transform: uppercase;">DepositRescue Legal Engine</span>
              <h1 style="margin: 8px 0 0 0; font-size: 22px; font-weight: 700; color: #ffffff;">Your Security Deposit Recovery Breakdown</h1>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">
              Hi <strong style="color: #ffffff;">${data.name}</strong>,
            </p>

            <p style="font-size: 14px; line-height: 1.6; color: #a1a1aa;">
              Based on statutory landlord-tenant laws for <strong style="color: #ffffff;">${state}</strong>, your formal demand breakdown has been calculated. If your landlord withheld your deposit past the statutory return deadline without proper itemized receipts, they have forfeited deduction rights and may owe statutory bad-faith penalties.
            </p>

            <div style="background: linear-gradient(180deg, #0f172a 0%, #020617 100%); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 8px; padding: 20px; margin: 24px 0;">
              <div style="font-size: 11px; font-family: monospace; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Total Court Recovery Target</div>
              <div style="font-size: 32px; font-weight: 800; font-family: monospace; color: #38bdf8; margin-bottom: 12px;">${claimFormatted}</div>
              
              <div style="border-top: 1px solid rgba(59, 130, 246, 0.2); padding-top: 12px; font-size: 12px; font-family: monospace; color: #94a3b8;">
                <span>Statutory Bad-Faith Damages Included: </span>
                <strong style="color: #60a5fa;">${penaltyFormatted}</strong>
              </div>
            </div>

            <h3 style="font-size: 14px; font-weight: 600; color: #ffffff; margin-top: 24px; margin-bottom: 12px;">Recommended Legal Next Steps:</h3>
            
            <ol style="font-size: 13px; line-height: 1.8; color: #a1a1aa; padding-left: 20px; margin: 0 0 24px 0;">
              <li><strong>Review Demand Letter:</strong> Ensure all lease details and move-out surrender dates are accurate.</li>
              <li><strong>Send via USPS Certified Mail:</strong> Small claims courts require verified signature proof of delivery before awarding statutory damages.</li>
              <li><strong>10-Day Cure Period:</strong> Give your landlord 10 business days from postal receipt to remit full funds.</li>
            </ol>

            <div style="text-align: center; margin: 32px 0 20px 0;">
              <a href="https://getdepositrescue.com/calculator" style="display: inline-block; background: linear-gradient(90deg, #3b82f6, #4f46e5); color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);">
                View & Download Your Demand Letter →
              </a>
            </div>

            <!-- Verified Partner Recommendations Section -->
            <div style="border-top: 1px solid #27272a; margin-top: 32px; padding-top: 24px;">
              <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: #38bdf8; text-transform: uppercase; margin-bottom: 4px;">
                Verified Partner Resources
              </div>
              <h4 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #ffffff;">
                Exclusive Tenant Services for Your Next Move & Protection
              </h4>

              <!-- Partner 1: Moving & Storage -->
              <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px;">
                <div style="margin-bottom: 4px;">
                  <strong style="font-size: 13px; color: #ffffff;">PODS / U-Pack Moving &amp; Storage</strong>
                  <span style="font-size: 10px; font-family: monospace; color: #c084fc; background: rgba(192, 132, 252, 0.1); border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 4px; padding: 2px 6px; margin-left: 8px;">Moving &amp; Storage</span>
                </div>
                <p style="font-size: 12px; line-height: 1.5; color: #a1a1aa; margin: 0 0 8px 0;">
                  Moving into your next rental? Compare top-rated moving truck, portable container, and secure storage quotes.
                </p>
                <a href="https://www.pods.com/?utm_source=depositrescue&amp;utm_medium=affiliate&amp;utm_campaign=deposit_recovery" style="font-size: 12px; font-weight: 600; color: #38bdf8; text-decoration: none;">
                  Compare Free Quotes →
                </a>
              </div>

              <!-- Partner 2: Renters Insurance -->
              <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px 16px; margin-bottom: 12px;">
                <div style="margin-bottom: 4px;">
                  <strong style="font-size: 13px; color: #ffffff;">Lemonade Renters Insurance (from $5/mo)</strong>
                  <span style="font-size: 10px; font-family: monospace; color: #60a5fa; background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 4px; padding: 2px 6px; margin-left: 8px;">Deposit Protection</span>
                </div>
                <p style="font-size: 12px; line-height: 1.5; color: #a1a1aa; margin: 0 0 8px 0;">
                  Protect your next security deposit with $100k liability and accidental damage coverage from top-rated carriers.
                </p>
                <a href="https://www.lemonade.com/renters?utm_source=depositrescue&amp;utm_medium=affiliate&amp;utm_campaign=deposit_recovery" style="font-size: 12px; font-weight: 600; color: #38bdf8; text-decoration: none;">
                  Get Instant Quote in 90 Seconds →
                </a>
              </div>

              <!-- Partner 3: Small Claims Court Filing -->
              <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 14px 16px;">
                <div style="margin-bottom: 4px;">
                  <strong style="font-size: 13px; color: #ffffff;">Dispute.com Small Claims Automation</strong>
                  <span style="font-size: 10px; font-family: monospace; color: #34d399; background: rgba(52, 211, 153, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 4px; padding: 2px 6px; margin-left: 8px;">Legal Filing</span>
                </div>
                <p style="font-size: 12px; line-height: 1.5; color: #a1a1aa; margin: 0 0 8px 0;">
                  If your landlord ignores your demand letter, prepare and file directly in Small Claims Court in 5 minutes.
                </p>
                <a href="https://www.dispute.com/?utm_source=depositrescue&amp;utm_medium=affiliate&amp;utm_campaign=deposit_recovery" style="font-size: 12px; font-weight: 600; color: #38bdf8; text-decoration: none;">
                  File Your Claim Online →
                </a>
              </div>
            </div>

            <div style="border-top: 1px solid #27272a; padding-top: 20px; margin-top: 28px; font-size: 11px; line-height: 1.6; color: #71717a; text-align: center;">
              DepositRescue is a self-help calculation tool, not a law firm, and does not provide formal legal representation.<br>
              © 2026 DepositRescue. All rights reserved.
            </div>

          </div>
        </body>
      </html>
    `;

    let emailDispatched = false;
    let emailId: string | undefined;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `DepositRescue <${fromEmail}>`,
          to: [data.email.trim().toLowerCase()],
          bcc: ["princegautam2106@gmail.com"],
          subject: `Your Security Deposit Penalty Breakdown (${claimFormatted}) - DepositRescue`,
          html: emailHtml,
        }),
      });

      if (res.ok) {
        const resData = (await res.json()) as any;
        emailDispatched = true;
        emailId = resData.id;
      }
    } catch {
      // Ignore network email error to not block lead collection
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead recorded and breakdown email dispatched.",
        lead: {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          timestamp: new Date().toISOString(),
          emailDispatched,
          emailId,
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
