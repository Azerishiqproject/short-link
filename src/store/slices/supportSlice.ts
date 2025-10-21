import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Thread = {
  _id: string;
  userId: any;
  status: "open" | "closed";
  lastMessageAt: string;
  lastMessageBy: "user" | "admin";
  subject?: string;
};

type Message = {
  _id: string;
  content: string;
  senderRole: "user" | "admin";
  createdAt: string;
};

type SupportState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  myThreadId?: string | null;
  myMessages: Message[];
  myThreads: Thread[];
  myThreadsPagination?: { page: number; limit: number; total: number; totalPages: number } | null;
  selectedThreadId?: string | null;
  adminThreads: Thread[];
  adminThreadsPagination?: { page: number; limit: number; total: number; totalPages: number } | null;
  activeThread?: Thread | null;
  activeMessages: Message[];
  activeMessagesPagination?: { page: number; limit: number; total: number; totalPages: number } | null;
};

const initialState: SupportState = {
  status: "idle",
  myThreadId: null,
  myThreads: [],
  myThreadsPagination: null,
  selectedThreadId: null,
  myMessages: [],
  adminThreads: [],
  adminThreadsPagination: null,
  activeThread: null,
  activeMessages: [],
  activeMessagesPagination: null,
};

const API_URL = process.env.API_URL as string;

// User: ensure/open thread
export const openMyThreadThunk = createAsyncThunk(
  "support/openMyThread",
  async (token: string) => {
    const res = await fetch(`${API_URL}/api/support/thread/open`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("thread-open-failed");
    const data = await res.json();
    return data.thread as Thread;
  }
);

// User: create new support thread explicitly
export const createSupportThreadThunk = createAsyncThunk(
  "support/createThread",
  async ({ token, subject }: { token: string; subject?: string }) => {
    const res = await fetch(`${API_URL}/api/support/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(subject ? { subject } : {}),
    });
    if (!res.ok) throw new Error("create-thread-failed");
    const data = await res.json();
    return data.thread as Thread;
  }
);

// User: list my threads
export const listMyThreadsThunk = createAsyncThunk(
  "support/listMyThreads",
  async ({ token, page = 1, limit = 20 }: { token: string; page?: number; limit?: number }) => {
    const res = await fetch(`${API_URL}/api/support/threads/me?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("list-my-threads-failed");
    const data = await res.json();
    return { threads: (data.threads || []) as Thread[], pagination: data.pagination } as any;
  }
);

// User: load my thread messages
export const loadMyMessagesThunk = createAsyncThunk(
  "support/loadMyMessages",
  async ({ token, threadId, page = 1, limit = 20 }: { token: string; threadId: string; page?: number; limit?: number }) => {
    const res = await fetch(`${API_URL}/api/support/threads/${threadId}/messages?page=${page}&limit=${limit}` , {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("load-messages-failed");
    const data = await res.json();
    return { messages: data.messages as Message[], pagination: data.pagination } as any;
  }
);

// User: send message
export const sendMyMessageThunk = createAsyncThunk(
  "support/sendMyMessage",
  async ({ token, threadId, content }: { token: string; threadId: string; content: string }) => {
    const res = await fetch(`${API_URL}/api/support/threads/${threadId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("send-failed");
    const data = await res.json();
    return data.message as Message;
  }
);

// Admin: list threads
export const adminListThreadsThunk = createAsyncThunk(
  "support/adminListThreads",
  async ({ token, status, page = 1, limit = 20 }: { token: string; status?: "open" | "closed"; page?: number; limit?: number }) => {
    const res = await fetch(`${API_URL}/api/support/admin/threads?status=${status || "open"}&page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("list-threads-failed");
    const data = await res.json();
    return { threads: data.threads as Thread[], pagination: data.pagination } as any;
  }
);

// Admin: load messages for a thread
export const adminLoadMessagesThunk = createAsyncThunk(
  "support/adminLoadMessages",
  async ({ token, threadId, page = 1, limit = 20 }: { token: string; threadId: string; page?: number; limit?: number }) => {
    const res = await fetch(`${API_URL}/api/support/threads/${threadId}/messages?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("admin-load-messages-failed");
    const data = await res.json();
    return { threadId, messages: data.messages as Message[], pagination: data.pagination } as any;
  }
);

// Admin: send message
export const adminSendMessageThunk = createAsyncThunk(
  "support/adminSendMessage",
  async ({ token, threadId, content }: { token: string; threadId: string; content: string }) => {
    const res = await fetch(`${API_URL}/api/support/threads/${threadId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("admin-send-failed");
    const data = await res.json();
    return data.message as Message;
  }
);

// Admin: delete message
export const adminDeleteMessageThunk = createAsyncThunk(
  "support/adminDeleteMessage",
  async ({ token, threadId, messageId }: { token: string; threadId: string; messageId: string }) => {
    const res = await fetch(`${API_URL}/api/support/admin/threads/${threadId}/messages/${messageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("delete-failed");
    return { threadId, messageId };
  }
);

// Admin: close thread
export const adminCloseThreadThunk = createAsyncThunk(
  "support/adminCloseThread",
  async ({ token, threadId }: { token: string; threadId: string }) => {
    const res = await fetch(`${API_URL}/api/support/admin/threads/${threadId}/close`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("close-failed");
    return threadId;
  }
);

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    setSelectedThread(state, action) {
      state.selectedThreadId = action.payload as string | null;
      state.myMessages = [];
    },
    setActiveThread(state, action) {
      state.activeThread = action.payload as Thread | null;
      state.activeMessages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(openMyThreadThunk.fulfilled, (s, a) => { s.myThreadId = a.payload._id; })
      .addCase(createSupportThreadThunk.fulfilled, (s, a) => {
        // prepend new thread and select it
        s.myThreads = [{ ...a.payload }, ...s.myThreads].sort((x, y) => new Date(y.lastMessageAt).getTime() - new Date(x.lastMessageAt).getTime());
        s.myThreadId = a.payload._id;
        s.selectedThreadId = a.payload._id;
        s.myMessages = [];
      })
      .addCase(listMyThreadsThunk.fulfilled, (s, a: any) => {
        s.myThreads = a.payload.threads;
        s.myThreadsPagination = a.payload.pagination || null;
        // Seçim kullanıcı tarafından yapılır; otomatik seçim yok
      })
      .addCase(loadMyMessagesThunk.fulfilled, (s, a: any) => { s.myMessages = a.payload.messages; s.activeMessagesPagination = a.payload.pagination || null; })
      .addCase(sendMyMessageThunk.fulfilled, (s, a) => { s.myMessages.push(a.payload); })
      .addCase(adminListThreadsThunk.fulfilled, (s, a: any) => { s.adminThreads = a.payload.threads; s.adminThreadsPagination = a.payload.pagination || null; })
      .addCase(adminLoadMessagesThunk.fulfilled, (s, a: any) => {
        if (s.activeThread && s.activeThread._id === a.payload.threadId) {
          s.activeMessages = a.payload.messages;
          s.activeMessagesPagination = a.payload.pagination || null;
        }
      })
      .addCase(adminSendMessageThunk.fulfilled, (s, a) => { s.activeMessages.push(a.payload); })
      .addCase(adminDeleteMessageThunk.fulfilled, (s, a) => {
        s.activeMessages = s.activeMessages.filter((m: any) => String((m as any)._id) !== String(a.payload.messageId));
      })
      .addCase(adminCloseThreadThunk.fulfilled, (s, a) => {
        s.adminThreads = s.adminThreads.map(t => t._id === a.payload ? { ...t, status: "closed" } : t);
        if (s.activeThread && s.activeThread._id === a.payload) {
          s.activeThread = { ...s.activeThread, status: "closed" } as any;
        }
      });
  }
});

export const { setActiveThread, setSelectedThread } = supportSlice.actions;
export default supportSlice.reducer;


