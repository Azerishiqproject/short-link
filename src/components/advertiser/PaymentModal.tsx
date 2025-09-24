"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";

interface PaymentModalProps {
  campaignData: {
    name: string;
    type: string;
    target: number;
    country: string;
    budget: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const adTypes = [
  { id: "google_review", name: "Google Yorum Yaptırma", icon: "⭐" },
  { id: "website_traffic", name: "Site Trafiği", icon: "🌐" },
  { id: "video_views", name: "Video İzletme", icon: "📹" },
  { id: "like_follow", name: "Beğeni Takip", icon: "❤️" }
];

export default function PaymentModal({ campaignData, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const selectedType = adTypes.find(t => t.id === campaignData.type);

  const handlePayment = async () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Record payment in backend (best-effort)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";
      await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ amount: campaignData.budget, currency: "TRY", method: paymentMethod, description: `Campaign payment for ${campaignData.type} in ${campaignData.country}`, metadata: { target: campaignData.target, audience: "advertiser" } })
      });
    } catch {}
    setIsProcessing(false);
    // pull fresh profile to update balances in UI
    try { await dispatch<any>(fetchMeThunk()); } catch {}
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ödeme</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Campaign Summary */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{selectedType?.icon}</span>
              <span className="font-medium text-slate-900 dark:text-white">{selectedType?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Hedef:</span>
              <span className="text-slate-900 dark:text-white">{campaignData.target.toLocaleString()} tıklama</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Ülke:</span>
              <span className="text-slate-900 dark:text-white">{campaignData.country}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-600 pt-2">
              <span className="text-slate-900 dark:text-white">Toplam:</span>
              <span className="text-blue-600 dark:text-blue-400">₺{campaignData.budget.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Ödeme Yöntemi</h3>
            <div className="space-y-2">
              <label className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-slate-900 dark:text-white">Kredi Kartı</span>
                </div>
              </label>
              
              <label className="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-slate-900 dark:text-white">Banka Havalesi</span>
                </div>
              </label>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Not:</strong> Bu sadece görsel bir ödeme simülasyonudur. Gerçek ödeme sistemi daha sonra entegre edilecektir.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              İptal
            </Button>
            <Button 
              onClick={handlePayment} 
              className="flex-1" 
              disabled={!paymentMethod || isProcessing}
            >
              {isProcessing ? "İşleniyor..." : `₺${campaignData.budget.toLocaleString()} Öde`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
