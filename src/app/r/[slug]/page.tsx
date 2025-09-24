"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// This page now just routes into the global verification flow on Home `/?verify=1&slug=...`
export default function RedirectEntry() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;
    router.replace(`/?verify=1&slug=${encodeURIComponent(slug)}`);
  }, [slug, router]);

  return null;
}
