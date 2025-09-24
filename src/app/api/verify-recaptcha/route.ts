import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token: string | undefined = body?.token;
    if (!token) {
      return NextResponse.json({ success: false, error: "missing-token" }, { status: 400 });
    }

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


