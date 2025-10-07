"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store";
import { issueTokenThunk } from "@/store/slices/linksSlice";

// This page now just routes into the global verification flow on Home `/?verify=1&slug=...`
export default function RedirectEntry() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | null>(null);

  if (!slug) return null;

  // Temporary: issue token without captcha and redirect immediately
  const handleVerified = async () => {
    try {
      const r:any = await dispatch<any>(issueTokenThunk({ slug }));
      if (r.meta.requestStatus !== 'fulfilled') throw new Error(r.payload || 'issue-failed');
      const target: string = r.payload.targetUrl;
      const token: string = r.payload.token;
      if (!target || !token) throw new Error('missing-redirect');
      window.location.replace(`${target}${target.includes('?') ? '&' : '?'}t=${encodeURIComponent(token)}`);
    } catch (e) {
      setError('Yönlendirme başarısız.');
      setTimeout(()=>router.replace('/'), 1500);
    }
  };

  useEffect(() => {
    handleVerified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div className="min-h-screen flex items-center justify-center text-slate-800 dark:text-slate-100">
      {error ? error : 'Yönlendiriliyor...'}
    </div>
  );
}
