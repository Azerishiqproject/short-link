"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { openMyThreadThunk, loadMyMessagesThunk, sendMyMessageThunk, listMyThreadsThunk, setSelectedThread, createSupportThreadThunk } from "@/store/slices/supportSlice";

export default function ChatWidget() {
  const dispatch = useAppDispatch();
  const { token, hydrated } = useAppSelector((s) => s.auth);
  const { myThreadId, myMessages, myThreads, selectedThreadId, activeMessagesPagination } = useAppSelector((s) => s.support);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const lastThreadsFetchMsRef = useRef<number>(0);
  const lastMessagesFetchMsRef = useRef<number>(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // On open: fetch threads once (or if 60s passed). Only load messages if a selection exists
  useEffect(() => {
    if (!open || !hydrated || !token) return;
    (async () => {
      const now = Date.now();
      const shouldFetchThreads = (myThreads.length === 0) || (now - lastThreadsFetchMsRef.current > 60_000);
      if (shouldFetchThreads) {
        await dispatch<any>(listMyThreadsThunk({ token, page: 1, limit })).catch(()=>{});
        lastThreadsFetchMsRef.current = Date.now();
      }
      if (selectedThreadId) {
        setPage(1);
        await dispatch<any>(loadMyMessagesThunk({ token, threadId: selectedThreadId, page: 1, limit })).catch(()=>{});
        lastMessagesFetchMsRef.current = Date.now();
        setTimeout(() => scrollToBottom(), 50);
      }
    })();
  }, [open, hydrated, token, selectedThreadId, dispatch, myThreads.length, limit]);

  function scrollToBottom() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    setShowScrollToBottom(!nearBottom);
  }

  async function sendMessage() {
    if (!token || !input.trim()) return;
    const content = input.trim();
    setInput("");
    // İlk mesaj gönderilecekse önce thread oluştur (ve seçili yap)
    let id = selectedThreadId as string | undefined;
    if (!id) {
      const created = await dispatch<any>(openMyThreadThunk(token)).unwrap().catch(()=>null);
      id = created?._id as string | undefined;
      if (id) dispatch(setSelectedThread(id));
    }
    if (!id) return;
    await dispatch<any>(sendMyMessageThunk({ token, threadId: id, content })).catch(()=>{});
    setTimeout(() => scrollToBottom(), 30);
  }

  async function changeThread(threadId: string) {
    dispatch(setSelectedThread(threadId));
    setPage(1);
    await dispatch<any>(loadMyMessagesThunk({ token: token as string, threadId, page: 1, limit })).catch(()=>{});
    setTimeout(() => scrollToBottom(), 30);
  }

  async function loadPrevPage() {
    if (!token || !selectedThreadId) return;
    const nextPage = page + 1;
    await dispatch<any>(loadMyMessagesThunk({ token, threadId: selectedThreadId, page: nextPage, limit })).catch(()=>{});
    setPage(nextPage);
  }

  // Poll only selected thread every 3s
  useEffect(() => {
    if (!open || !token || !selectedThreadId) return;
    const handler = () => {
      const visible = typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
      if (!visible) return;
      const now = Date.now();
      if (now - lastMessagesFetchMsRef.current < 2800) return;
      dispatch<any>(loadMyMessagesThunk({ token: token as string, threadId: selectedThreadId, page: 1, limit }))
        .then(() => { lastMessagesFetchMsRef.current = Date.now(); })
        .catch(()=>{});
    };
    const interval = setInterval(handler, 3000);
    const onVis = () => { if (document.visibilityState === 'visible') handler(); };
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVis);
    return () => clearInterval(interval);
  }, [open, token, selectedThreadId, dispatch, limit]);

  async function createNewThread() {
    if (!token) return;
    setCreating(true);
    try {
      const created = await dispatch<any>(createSupportThreadThunk({ token, subject: subject.trim() || undefined })).unwrap();
      setSubject("");
      dispatch(setSelectedThread(created._id));
      await dispatch<any>(loadMyMessagesThunk({ token, threadId: created._id, page: 1, limit })).catch(()=>{});
      setTimeout(() => scrollToBottom(), 30);
    } finally {
      setCreating(false);
    }
  }

  const containerClasses = isMobile
    ? "fixed z-40 left-0 right-0 mx-2 bottom-0 mb-2 rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur h-[80vh]"
    : "fixed z-40 bottom-5 right-5 w-[700px] max-w-[92vw] min-h-[500px] rounded-2xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur";

  return (
    <>
      {!open && (
        <button
          aria-label="Support Chat"
          onClick={() => setOpen(true)}
          className="fixed z-40 bottom-5 right-5 rounded-full h-12 w-12 bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none"
        >
          <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.8L3 20l.8-3.2A7.7 7.7 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </button>
      )}

      {open && (
        <div className={containerClasses}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              {isMobile && selectedThreadId && (
                <button className="mr-1 rounded-full bg-white/20 hover:bg-white/30 px-2 py-1" onClick={() => { dispatch(setSelectedThread(null as any)); }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
              )}
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <div className="text-sm font-semibold">Destek</div>
            </div>
            <button className="text-white/80 hover:text-white" onClick={() => setOpen(false)}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Body */}
          {!isMobile ? (
            <div className="grid grid-cols-3 gap-0">
              {/* Left: threads */}
              <div className="col-span-1 border-r border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 flex flex-col">
                <div className="p-2 flex items-center gap-2 border-b border-black/10 dark:border-white/10">
                  <input
                    value={subject}
                    onChange={(e)=>setSubject(e.target.value)}
                    placeholder="Konu (opsiyonel)"
                    className="flex-1 h-8 px-2 rounded-md text-[12px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <button onClick={createNewThread} disabled={creating || !token} className="h-8 px-2 rounded-md text-[12px] bg-blue-600 text-white disabled:opacity-50">Yeni</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {myThreads
                      .slice()
                      .sort((a,b)=> new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
                      .map(t => (
                      <button
                        key={t._id}
                        onClick={()=> changeThread(t._id)}
                        className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${ (selectedThreadId) === t._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        title={new Date(t.lastMessageAt).toLocaleString('tr-TR')}
                      >
                        <div className="text-[12px] font-medium truncate">{t.subject || 'Destek Talebi'}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${t.status==='open'?'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400':'bg-slate-500/10 text-slate-600 dark:text-slate-300'}`}>{t.status}</span>
                          <span className="text-[10px] text-slate-500">{new Date(t.lastMessageAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: messages */}
              <div className="col-span-2 flex flex-col">
                <div className="px-3 py-2 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/60">
                  <div className="text-[12px] text-slate-600 dark:text-slate-300">Sohbet</div>
                </div>
                <div ref={listRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto p-3 space-y-2 bg-white/60 dark:bg-slate-900/60">
                  {token && activeMessagesPagination && (activeMessagesPagination.page * activeMessagesPagination.limit) < (activeMessagesPagination.total || 0) && (
                    <div className="flex justify-center mb-2">
                      <button onClick={loadPrevPage} className="text-[11px] px-3 py-1 rounded-full border bg-white dark:bg-slate-800">Daha eski mesajları yükle</button>
                    </div>
                  )}
                  {!token ? (
                    <div className="text-xs text-slate-600 dark:text-slate-400">Devam etmek için lütfen giriş yapın.</div>
                  ) : (!myMessages || myMessages.length === 0) ? (
                    <div className="text-xs text-slate-600 dark:text-slate-400">Merhaba! Mesajınızı yazın, ilk mesajla destek talebi oluşacaktır.</div>
                  ) : (
                    myMessages.map((m) => (
                      <div key={m._id} className={`flex ${((m as any).senderRole || (m as any).role) === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`${((m as any).senderRole || (m as any).role) === "user" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"} px-3 py-2 rounded-2xl text-xs max-w-[85%] shadow-sm` }>
                          <div className="whitespace-pre-wrap break-words">{m.content}</div>
                          <div className="opacity-60 mt-1 text-[10px]">{new Date(m.createdAt).toLocaleString("tr-TR")}</div>
                        </div>
                      </div>
                    ))
                  )}
                  {showScrollToBottom && (
                    <button onClick={scrollToBottom} className="absolute bottom-3 right-3 text-[11px] px-3 py-1 rounded-full border bg-white shadow-sm dark:bg-slate-800">Aşağı in</button>
                  )}
                </div>
                <div className="p-2 border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 flex items-center gap-2">
                  <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') sendMessage(); }} placeholder={!token?"Giriş yapın":"Mesaj yazın..."} disabled={!token} className="flex-1 h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60" />
                  <button onClick={sendMessage} disabled={!token || !input.trim()} className="h-11 px-4 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Mobile: step view (threads list OR messages)
            <div className="flex flex-col h-full">
              {!selectedThreadId ? (
                <div className="flex-1 overflow-y-auto">
                  <div className="p-2 flex items-center gap-2 border-b border-black/10 dark:border-white/10">
                    <input value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Konu (opsiyonel)" className="flex-1 h-9 px-3 rounded-md text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                    <button onClick={createNewThread} disabled={creating || !token} className="h-9 px-3 rounded-md text-sm bg-blue-600 text-white disabled:opacity-50">Yeni</button>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {myThreads.slice().sort((a,b)=> new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()).map(t => (
                      <button key={t._id} onClick={()=> changeThread(t._id)} className="w-full text-left px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <div className="text-sm font-medium truncate">{t.subject || 'Destek Talebi'}</div>
                        <div className="mt-1 text-[11px] text-slate-500">{new Date(t.lastMessageAt).toLocaleString('tr-TR')}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="px-3 py-2 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 text-[12px]">Sohbet</div>
                  <div ref={listRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto p-3 space-y-2">
                    {myMessages.map((m)=> (
                      <div key={m._id} className={`flex ${((m as any).senderRole || (m as any).role) === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${((m as any).senderRole || (m as any).role) === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'} px-3 py-2 rounded-2xl text-xs max-w-[85%] shadow-sm`}>
                          <div className="whitespace-pre-wrap break-words">{m.content}</div>
                          <div className="opacity-60 mt-1 text-[10px]">{new Date(m.createdAt).toLocaleString('tr-TR')}</div>
                        </div>
                      </div>
                    ))}
                    {showScrollToBottom && (
                      <button onClick={scrollToBottom} className="absolute bottom-3 right-3 text-[11px] px-3 py-1 rounded-full border bg-white shadow-sm dark:bg-slate-800">Aşağı in</button>
                    )}
                  </div>
                  <div className="p-2 border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 flex items-center gap-2">
                    <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>{ if (e.key==='Enter') sendMessage(); }} placeholder={!token?"Giriş yapın":"Mesaj yazın..."} disabled={!token} className="flex-1 h-11 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 text-sm focus:outline-none" />
                    <button onClick={sendMessage} disabled={!token || !input.trim()} className="h-11 px-4 rounded-full bg-blue-600 text-white text-sm disabled:opacity-50">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}


