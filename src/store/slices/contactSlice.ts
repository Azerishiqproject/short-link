import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  readByAdmin: boolean;
  replied: boolean;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
};

type ContactStats = {
  total: number;
  unread: number;
  replied: number;
  unreplied: number;
  recentMessages: ContactMessage[];
};

type ContactState = {
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  messages: ContactMessage[];
  pagination?: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean } | null;
  stats?: ContactStats | null;
};

const initialState: ContactState = {
  status: "idle",
  messages: [],
  pagination: null,
  stats: null,
};

const API_URL = process.env.API_URL || "http://localhost:5050";

// Public: Submit contact form
export const submitContactFormThunk = createAsyncThunk(
  "contact/submitForm",
  async (data: { name: string; email: string; subject: string; message: string }) => {
    const res = await fetch(`${API_URL}/api/contact/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Mesaj gönderilemedi");
    }

    const responseData = await res.json();
    return responseData;
  }
);

// Admin: Get contact messages
export const fetchContactMessagesThunk = createAsyncThunk(
  "contact/fetchMessages",
  async ({ token, page = 1, limit = 20, filter, search = "" }: { token: string; page?: number; limit?: number; filter?: "all" | "read" | "unread"; search?: string }) => {
    const readParam = filter === "all" ? "" : filter === "unread" ? "false" : "true";
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    
    const res = await fetch(
      `${API_URL}/api/admin/contact/messages?page=${page}&limit=${limit}&read=${readParam}${searchParam}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error("Mesajlar alınamadı");
    }

    const data = await res.json();
    return { messages: data.messages as ContactMessage[], pagination: data.pagination };
  }
);

// Admin: Get contact stats
export const fetchContactStatsThunk = createAsyncThunk(
  "contact/fetchStats",
  async (token: string) => {
    const res = await fetch(`${API_URL}/api/admin/contact/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error("İstatistikler alınamadı");
    }

    const data = await res.json();
    return data as ContactStats;
  }
);

// Admin: Mark message as read
export const markContactAsReadThunk = createAsyncThunk(
  "contact/markAsRead",
  async ({ token, messageId }: { token: string; messageId: string }) => {
    const res = await fetch(
      `${API_URL}/api/admin/contact/messages/${messageId}/read`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error("Mesaj güncellenemedi");
    }

    const data = await res.json();
    return data as ContactMessage;
  }
);

// Admin: Mark message as replied
export const markContactAsRepliedThunk = createAsyncThunk(
  "contact/markAsReplied",
  async ({ token, messageId }: { token: string; messageId: string }) => {
    const res = await fetch(
      `${API_URL}/api/admin/contact/messages/${messageId}/replied`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error("Mesaj güncellenemedi");
    }

    const data = await res.json();
    return data as ContactMessage;
  }
);

// Admin: Delete message
export const deleteContactMessageThunk = createAsyncThunk(
  "contact/deleteMessage",
  async ({ token, messageId }: { token: string; messageId: string }) => {
    const res = await fetch(
      `${API_URL}/api/admin/contact/messages/${messageId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      throw new Error("Mesaj silinemedi");
    }

    return messageId;
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit form
      .addCase(submitContactFormThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitContactFormThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(submitContactFormThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch messages
      .addCase(fetchContactMessagesThunk.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.pagination = action.payload.pagination || null;
        state.status = "succeeded";
      })
      .addCase(fetchContactMessagesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Fetch stats
      .addCase(fetchContactStatsThunk.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchContactStatsThunk.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Mark as read
      .addCase(markContactAsReadThunk.fulfilled, (state, action) => {
        const msg = state.messages.find((m) => m._id === action.payload._id);
        if (msg) {
          msg.readByAdmin = action.payload.readByAdmin;
        }
        if (state.stats) {
          state.stats.unread = Math.max(0, state.stats.unread - 1);
        }
      })
      // Mark as replied
      .addCase(markContactAsRepliedThunk.fulfilled, (state, action) => {
        const msg = state.messages.find((m) => m._id === action.payload._id);
        if (msg) {
          msg.replied = action.payload.replied;
        }
        if (state.stats) {
          state.stats.replied = (state.stats.replied || 0) + 1;
          state.stats.unreplied = Math.max(0, state.stats.unreplied - 1);
        }
      })
      // Delete message
      .addCase(deleteContactMessageThunk.fulfilled, (state, action) => {
        state.messages = state.messages.filter((m) => m._id !== action.payload);
        if (state.stats) {
          state.stats.total = Math.max(0, state.stats.total - 1);
        }
      });
  },
});

export const { clearError } = contactSlice.actions;
export default contactSlice.reducer;

