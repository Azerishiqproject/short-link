"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppDispatch } from "@/store";
import { issueTokenThunk, verifyRecaptchaThunk } from "@/store/slices/linksSlice";

type VerifyGateProps = {
  slug: string;
  onClose?: () => void;
};

export default function VerifyGate({ slug, onClose }: VerifyGateProps) {
  const dispatch = useAppDispatch();
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  const siteKey = useMemo(() => {
    return process.env.RECAPTCHA_SITE_KEY || "";
  }, []);

  const handleToken = useCallback(async (token: string | null) => {
    if (!token) return;
    setVerifying(true);
    setError(null);
    try {
      // Verify via Redux thunk
      const verifyRes:any = await dispatch<any>(verifyRecaptchaThunk({ token }));
      if (verifyRes.meta.requestStatus !== 'fulfilled') throw new Error(verifyRes.payload || "Doğrulama başarısız. Lütfen tekrar deneyin.");

      // Issue signed token via Redux thunk
      const issueRes:any = await dispatch<any>(issueTokenThunk({ slug }));
      if (issueRes.meta.requestStatus !== 'fulfilled') throw new Error(issueRes.payload || "Token üretilemedi");
      const target = (issueRes.payload as any)?.targetUrl as string | undefined;
      const tkn = (issueRes.payload as any)?.token as string | undefined;
      if (!target || !tkn) throw new Error("Yönlendirme bilgisi eksik");
      const url = `${target}${target.includes('?') ? '&' : '?'}t=${encodeURIComponent(tkn)}`;
      if (typeof window !== 'undefined') window.location.replace(url);
    } catch (e: any) {
      setError(e?.message || "Bilinmeyen hata");
      recaptchaRef.current?.reset();
    } finally {
      setVerifying(false);
    }
  }, [slug]);

  const handleErrored = useCallback(() => {
    setError("Geçersiz site anahtarı. Lütfen RECAPTCHA_SITE_KEY değerini kontrol edin.");
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur p-6 text-slate-100">
        <div className="mb-4">
          <div className="text-lg font-semibold">Güvenlik Doğrulaması</div>
          <div className="text-sm text-slate-300">Devam etmek için lütfen robot olmadığınızı doğrulayın.</div>
        </div>
        {siteKey ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef as any}
                sitekey={siteKey}
                onChange={handleToken}
                theme="dark"
                onErrored={handleErrored}
                onExpired={() => recaptchaRef.current?.reset()}
              />
            </div>
            {error && (
              <div className="text-xs text-red-300">{error}</div>
            )}
            <div className="text-xs text-slate-400">Slug: {slug}</div>
            <div className="flex justify-end">
              <button onClick={onClose} className="text-slate-300 hover:text-white text-sm">Kapat</button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-amber-300">
            Site anahtarı bulunamadı. Lütfen `RECAPTCHA_SITE_KEY` ortam değişkenini ayarlayın.
          </div>
        )}
        {verifying && (
          <div className="mt-4 text-xs text-slate-400">Doğrulanıyor...</div>
        )}
      </div>
    </div>
  );
}


