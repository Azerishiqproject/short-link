import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token: string | undefined = body?.token;
    const action: string | undefined = body?.action;
    if (!token) {
      return NextResponse.json({ success: false, error: "missing-token" }, { status: 400 });
    }

    const enterpriseProjectId = process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID;
    const enterpriseApiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY;
    const siteKey = process.env.RECAPTCHA_SITE_KEY;

    // If Enterprise creds are provided, use Enterprise Assessments API
    if (enterpriseProjectId && enterpriseApiKey && siteKey) {
      const assessUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${enterpriseProjectId}/assessments?key=${enterpriseApiKey}`;
      const assessBody = {
        event: {
          token,
          siteKey,
          expectedAction: action || undefined,
        },
      } as any;

      const assessRes = await fetch(assessUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessBody),
        cache: "no-store",
      });
      const data = await assessRes.json();
      const tokenProps = data?.tokenProperties;
      const risk = data?.riskAnalysis;
      const isValid = Boolean(tokenProps?.valid);
      const actionMatches = action ? tokenProps?.action === action : true;
      const score = typeof risk?.score === "number" ? risk.score : 0;
      const threshold = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
      const success = isValid && actionMatches && score >= threshold;
      return NextResponse.json({ success, data, score }, { status: success ? 200 : 400 });
    }

    // Fallback to standard reCAPTCHA verify (v2/v3)
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ success: false, error: "missing-secret" }, { status: 500 });
    }

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);

    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
    });

    const data = await verifyRes.json();
    const success = Boolean(data?.success);

    return NextResponse.json({ success, data }, { status: success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "verify-failed" }, { status: 500 });
  }
}


