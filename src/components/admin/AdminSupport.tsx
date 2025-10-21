"use client";

import { useEffect, useRef, useState, Fragment } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { adminListThreadsThunk, adminLoadMessagesThunk, adminSendMessageThunk, adminCloseThreadThunk, setActiveThread, adminDeleteMessageThunk } from "@/store/slices/supportSlice";
import { FiCopy } from "react-icons/fi";

export default function AdminSupport() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { adminThreads, activeThread, activeMessages } = useAppSelector((s) => s.support);
  const [messageInput, setMessageInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"open" | "closed">("open");
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [page] = useState(1);
  const [limit] = useState(20);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    if (!token) return;
    dispatch<any>(adminListThreadsThunk({ token, status: statusFilter }));
  }, [token, statusFilter, dispatch]);

  async function openThread(t: any) {
    dispatch(setActiveThread(t));
    await dispatch<any>(adminLoadMessagesThunk({ token: token as string, threadId: t._id, page, limit }));
    setTimeout(() => scrollToBottom(), 50);
  }

  async function sendMessage() {
    if (!activeThread || !messageInput.trim() || !token) return;
    const content = messageInput.trim();
    setMessageInput("");
    await dispatch<any>(adminSendMessageThunk({ token, threadId: activeThread._id, content }));
    setTimeout(() => scrollToBottom(), 30);
  }

  async function closeThread() {
    if (!activeThread || !token) return;
    await dispatch<any>(adminCloseThreadThunk({ token, threadId: activeThread._id }));
  }

  function onComposerKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function scrollToBottom() {
    const el = listRef.current; if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  function handleScroll() {
    const el = listRef.current; if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    setShowScrollToBottom(!nearBottom);
  }

  // Poll active thread messages every 3s while a thread is selected
  useEffect(() => {
    if (!token || !activeThread?._id) return;
    const interval = setInterval(() => {
      dispatch<any>(adminLoadMessagesThunk({ token, threadId: activeThread._id, page, limit })).catch(()=>{});
    }, 3000);
    return () => clearInterval(interval);
  }, [token, activeThread?._id, dispatch, page, limit]);

  // Filter + simple preview builder
  const filteredThreads = adminThreads.filter((t: any) => {
    const passUser = selectedUserId ? String((t.userId?._id || t.userId)) === String(selectedUserId) : true;
    const subject = (t.subject || "").toLowerCase();
    const user = typeof t.userId === 'object' ? ((t.userId.name || t.userId.email || "") as string).toLowerCase() : String(t.userId).toLowerCase();
    const q = query.toLowerCase().trim();
    const passQuery = !q || subject.includes(q) || user.includes(q);
    return passUser && passQuery;
  });

  function threadUserLabel(t: any) {
    const u = t.userId;
    return typeof u === 'object' ? (u.name || u.email || 'Kullanıcı') : String(u);
  }

  // Unique users list derived from threads
  const users = [...new Map(adminThreads.map(t => [String((t as any).userId?._id || t.userId), t])).entries()]
    .map(([id, t]: any) => ({ id, label: threadUserLabel(t) }));

  // Day separator helper
  function dayKey(dt: Date) {
    return dt.toISOString().split('T')[0];
  }

  // Copy user ID to clipboard
  function copyUserId(userId: string) {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(userId).then(() => {
        // Optional: show a toast notification
      }).catch(err => {
        console.error('Failed to copy user ID:', err);
      });
    }
  }

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {/* Users column */}
      <div className="col-span-1 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden flex flex-col bg-white/70 dark:bg-slate-900/60">
        <div className="px-3 py-2 text-sm font-semibold border-b border-black/10 dark:border-white/10">Kullanıcılar</div>
        <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/10">
          {users.map((u) => (
            <div
              key={u.id}
              className={`w-full px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${String(selectedUserId)===String(u.id)?'bg-blue-50/60 dark:bg-blue-900/20':''} flex items-center justify-between group`}
            >
              <button
                onClick={()=>{ setSelectedUserId(String(u.id)); }}
                className="flex-1 text-left truncate"
              >
                {u.label}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyUserId(u.id);
                }}
                className="ml-2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Kullanıcı ID'sini kopyala"
              >
                <FiCopy className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Threads column */}
      <div className="col-span-1 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden flex flex-col bg-white/70 dark:bg-slate-900/60">
        <div className="px-3 py-2 flex items-center gap-2 border-b border-black/10 dark:border-white/10">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Ara..." className="flex-1 h-8 px-2 rounded text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as any)} className="text-xs border rounded px-2 h-8">
            <option value="open">Açık</option>
            <option value="closed">Kapalı</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-black/5 dark:divide-white/10">
          {filteredThreads.map((t)=> (
            <button key={t._id} onClick={()=>openThread(t)} className={`w-full text-left px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 ${activeThread?._id===t._id? 'bg-blue-50/60 dark:bg-blue-900/20':''}`}>
              <div className="text-[13px] font-semibold truncate">{t.subject || 'Destek Talebi'}</div>
              <div className="mt-0.5 text-[11px] text-slate-500 truncate">{threadUserLabel(t)}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${t.status==='open'?'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400':'bg-slate-500/10 text-slate-600 dark:text-slate-300'}`}>{t.status}</span>
                <span className="text-[10px] text-slate-500">{new Date(t.lastMessageAt).toLocaleString('tr-TR')}</span>
              </div>
            </button>
          ))}
          {filteredThreads.length === 0 && (
            <div className="p-4 text-xs text-slate-500">{selectedUserId ? 'Bu kullanıcı için sohbet bulunamadı.' : 'Sol taraftan bir kullanıcı seçin.'}</div>
          )}
        </div>
      </div>

      {/* Messages column */}
      <div className="col-span-2 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden flex flex-col bg-white/70 dark:bg-slate-900/60">
        {!activeThread ? (
          <div className="m-auto text-sm text-slate-500">Bir sohbet seçin</div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-white/80 dark:bg-slate-900/60">
              <div>
                <div className="text-sm font-semibold">{activeThread.subject || 'Destek Talebi'}</div>
                <div className="text-xs text-slate-500">Durum: {activeThread.status}</div>
              </div>
              <div className="flex items-center gap-2">
                {activeThread.status === 'open' && (
                  <button onClick={closeThread} className="text-xs px-3 py-1 rounded bg-slate-200 dark:bg-slate-700">Kapat</button>
                )}
              </div>
            </div>

            <div ref={listRef} onScroll={handleScroll} className="relative flex-1 overflow-y-auto p-3 space-y-2">
              {(() => {
                const groups: Array<{ key: string; items: any[] }> = [];
                let currentKey = "";
                for (const msg of activeMessages as any[]) {
                  const k = dayKey(new Date(msg.createdAt));
                  if (k !== currentKey) { groups.push({ key: k, items: [] }); currentKey = k; }
                  groups[groups.length - 1].items.push(msg);
                }
                return groups.map(g => (
                  <Fragment key={g.key}>
                    <div className="sticky top-0 z-10 mx-auto my-2 w-fit px-3 py-1 text-[10px] rounded-full bg-slate-200/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200">
                      {new Date(g.key).toLocaleDateString('tr-TR')}
                    </div>
                    {g.items.map((m: any) => (
                      <div key={m._id} className={`flex ${((m as any).senderRole || (m as any).role) === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${((m as any).senderRole || (m as any).role) === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'} px-3 py-2 rounded-2xl text-xs max-w-[85%] shadow-sm relative group`}>
                          <div className="whitespace-pre-wrap break-words pr-6">{m.content}</div>
                          <div className="opacity-60 mt-1 text-[10px]">{new Date(m.createdAt).toLocaleTimeString('tr-TR')}</div>
                          {/* Delete message button */}
                          <button onClick={()=> dispatch<any>(adminDeleteMessageThunk({ token: token as string, threadId: activeThread._id, messageId: String(m._id) }))} className="absolute top-1 right-1 text-white/80 dark:text-slate-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" title="Sil">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </Fragment>
                ));
              })()}
              {showScrollToBottom && (
                <button onClick={scrollToBottom} className="absolute bottom-3 right-3 text-[11px] px-3 py-1 rounded-full border bg-white shadow-sm dark:bg-slate-800">Aşağı in</button>
              )}
            </div>

            <div className="p-2 border-t border-black/10 dark:border-white/10 flex items-center gap-2 bg-white/80 dark:bg-slate-900/60">
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={onComposerKey}
                placeholder="Yanıt yazın... (Gönder: Enter, Yeni satır: Shift+Enter)"
                className="flex-1 h-9 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm focus:outline-none"
              />
              <button onClick={sendMessage} className="h-9 px-3 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">Gönder</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


