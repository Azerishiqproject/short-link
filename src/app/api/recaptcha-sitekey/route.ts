import { NextResponse } from "next/server";

export async function GET() {
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    return NextResponse.json({ siteKey: null, error: "missing-sitekey" }, { status: 404 });
  }
  return NextResponse.json({ siteKey }, { status: 200 });
}


