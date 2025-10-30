"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { 
  fetchContactMessagesThunk, 
  fetchContactStatsThunk, 
  markContactAsReadThunk, 
  markContactAsRepliedThunk, 
  deleteContactMessageThunk 
} from "@/store/slices/contactSlice";
import Pagination from "@/components/common/Pagination";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  readByAdmin: boolean;
  replied: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ContactManager() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { messages, pagination, stats, status } = useAppSelector((s) => s.contact);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchContactMessagesThunk({ token, page: currentPage, limit: 20, filter, search: searchQuery }));
      dispatch(fetchContactStatsThunk(token));
    }
  }, [dispatch, token, currentPage, filter, searchQuery]);

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;
    await dispatch(markContactAsReadThunk({ token, messageId: id }));
    await dispatch(fetchContactStatsThunk(token));
  };

  const handleMarkAsReplied = async (id: string) => {
    if (!token) return;
    await dispatch(markContactAsRepliedThunk({ token, messageId: id }));
    await dispatch(fetchContactStatsThunk(token));
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    
    await dispatch(deleteContactMessageThunk({ token, messageId: id }));
    await dispatch(fetchContactStatsThunk(token));
    
    if (selectedMessage?._id === id) {
      setSelectedMessage(null);
    }
  };

  if (status === "loading" && messages.length === 0) {
    return <div className="text-slate-600 dark:text-slate-400">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-4">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Toplam Mesaj</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
          </div>
          <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-4">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Okunmamış</div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.unread}</div>
          </div>
          <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-4">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Yanıtlandı</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.replied}</div>
          </div>
          <div className="rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-4">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Yanıtlanmadı</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.unreplied}</div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex gap-4 mb-4">
        <div className="flex gap-2 flex-1">
          <button
            onClick={() => { setFilter("all"); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all" 
                ? "bg-blue-500 text-white" 
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => { setFilter("unread"); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "unread" 
                ? "bg-red-500 text-white" 
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10"
            }`}
          >
            Okunmamış
          </button>
          <button
            onClick={() => { setFilter("read"); setCurrentPage(1); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "read" 
                ? "bg-emerald-500 text-white" 
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-black/10 dark:border-white/10"
            }`}
          >
            Okunmuş
          </button>
        </div>
        <input
          type="text"
          placeholder="Ara..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 text-sm outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`rounded-lg border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-4 cursor-pointer transition-all hover:shadow-md ${
              !message.readByAdmin ? "border-red-500/50 dark:border-red-500/50" : ""
            }`}
            onClick={() => setSelectedMessage(message)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold text-slate-900 dark:text-white">{message.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{message.email}</div>
                  {!message.readByAdmin && (
                    <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium">
                      Yeni
                    </span>
                  )}
                  {message.replied && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                      Yanıtlandı
                    </span>
                  )}
                </div>
                <div className="font-medium text-sm text-slate-900 dark:text-white mb-1">{message.subject}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {new Date(message.createdAt).toLocaleString("tr-TR")}
                </div>
              </div>
              <div className="flex gap-2">
                {!message.readByAdmin && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(message._id); }}
                    className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
                  >
                    Okundu işaretle
                  </button>
                )}
                {!message.replied && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMarkAsReplied(message._id); }}
                    className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  >
                    Yanıtlandı
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(message._id); }}
                  className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedMessage(null)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[80vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{selectedMessage.subject}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedMessage.name} • {selectedMessage.email}
                </div>
              </div>
              <button 
                className="text-slate-500 hover:text-slate-700" 
                onClick={() => setSelectedMessage(null)}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="whitespace-pre-wrap text-slate-900 dark:text-white">{selectedMessage.message}</div>
              <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex gap-2">
                {!selectedMessage.readByAdmin && (
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage._id)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-medium"
                  >
                    Okundu işaretle
                  </button>
                )}
                {!selectedMessage.replied && (
                  <button
                    onClick={() => handleMarkAsReplied(selectedMessage._id)}
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 text-sm font-medium"
                  >
                    Yanıtlandı
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-medium"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

