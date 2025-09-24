import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleUnauthorized, refreshAccessTokenThunk } from "./authSlice";

type Link = {
  _id: string;
  slug: string;
  targetUrl: string;
  clicks: number;
  lastClickedAt?: string;
  disabled: boolean;
  createdAt: string;
};

type LinksState = {
  links: Link[];
  currentLink: Link | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  totalClicks?: number;
  totalEarnings?: number;
  earningPerClick?: number;
  analytics?: {
    linkId: string;
    totalClicks: number;
    countryBreakdown: Array<{
      country: string;
      count: number;
      percentage: string;
      clicks: Array<{
        ip: string;
        userAgent: string;
        referer: string;
        clickedAt: string;
      }>;
    }>;
    recentClicks: Array<{
      ip: string;
      country: string;
      userAgent: string;
      referer: string;
      clickedAt: string;
    }>;
  };
};

const initialState: LinksState = {
  links: [],
  currentLink: null,
  status: "idle",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

// Fetch user's links
export const fetchLinksThunk = createAsyncThunk(
  "links/fetchLinks",
  async (token: string, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (localStorage.getItem("token") as string) || token;
          res = await fetch(`${API_URL}/api/links`, { headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Linkler alınamadı");
      const data = await res.json();
      return data.links || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new link
export const createLinkThunk = createAsyncThunk(
  "links/createLink",
  async ({ token, targetUrl }: { token: string; targetUrl: string }, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUrl }),
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (localStorage.getItem("token") as string) || token;
          res = await fetch(`${API_URL}/api/links`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${newToken}` }, body: JSON.stringify({ targetUrl }) });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ? JSON.stringify(data.error) : "Oluşturulamadı");
      }
      const created = await res.json();
      return {
        _id: created.id,
        slug: created.slug,
        targetUrl: created.targetUrl,
        clicks: 0,
        disabled: false,
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update link
export const updateLinkThunk = createAsyncThunk(
  "links/updateLink",
  async ({ token, id, updates }: { token: string; id: string; updates: { targetUrl?: string; disabled?: boolean } }, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (localStorage.getItem("token") as string) || token;
          res = await fetch(`${API_URL}/api/links/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${newToken}` }, body: JSON.stringify(updates) });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Güncellenemedi");
      const data = await res.json();
      return { id, link: data.link };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete link
export const deleteLinkThunk = createAsyncThunk(
  "links/deleteLink",
  async ({ token, id }: { token: string; id: string }, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (localStorage.getItem("token") as string) || token;
          res = await fetch(`${API_URL}/api/links/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Silinemedi");
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Resolve link by slug (for interstitial)
export const resolveLinkThunk = createAsyncThunk(
  "links/resolveLink",
  async (slug: string) => {
    const res = await fetch(`${API_URL}/api/links/slug/${slug}`);
    if (!res.ok) throw new Error("Link bulunamadı");
    const data = await res.json();
    // Normalize to internal shape
    return { _id: data.id as string, slug: data.slug as string, targetUrl: data.targetUrl as string } as any;
  }
);

// Log click
export const logClickThunk = createAsyncThunk(
  "links/logClick",
  async (id: string) => {
    const res = await fetch(`${API_URL}/api/links/${id}/click`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Tıklama kaydedilemedi");
    return id;
  }
);

// Fetch aggregated stats
export const fetchStatsThunk = createAsyncThunk(
  "links/fetchStats",
  async (token: string, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (localStorage.getItem("token") as string) || token;
          res = await fetch(`${API_URL}/api/links/stats`, { headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("İstatistikler alınamadı");
      const data = await res.json();
      return data as { totalClicks: number; totalEarnings: number; earningPerClick: number; links: any[] };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch link analytics
export const fetchLinkAnalyticsThunk = createAsyncThunk(
  "links/fetchLinkAnalytics",
  async ({ token, linkId }: { token: string; linkId: string }, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/${linkId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (localStorage.getItem("token") as string) || token;
          res = await fetch(`${API_URL}/api/links/${linkId}/analytics`, { headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Analitik veriler alınamadı");
      const data = await res.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const linksSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
    clearCurrentLink: (state) => {
      state.currentLink = null;
    },
    clearAnalytics: (state) => {
      state.analytics = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch links
      .addCase(fetchLinksThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchLinksThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.links = action.payload;
      })
      .addCase(fetchLinksThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Create link
      .addCase(createLinkThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(createLinkThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.links.unshift(action.payload);
      })
      .addCase(createLinkThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Update link
      .addCase(updateLinkThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(updateLinkThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.links.findIndex(link => link._id === action.payload.id);
        if (index !== -1) {
          state.links[index] = { ...state.links[index], ...action.payload.link };
        }
      })
      .addCase(updateLinkThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Delete link
      .addCase(deleteLinkThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(deleteLinkThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.links = state.links.filter(link => link._id !== action.payload);
      })
      .addCase(deleteLinkThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Resolve link
      .addCase(resolveLinkThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(resolveLinkThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentLink = action.payload;
      })
      .addCase(resolveLinkThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Log click
      .addCase(logClickThunk.fulfilled, (state, action) => {
        const link = state.links.find(l => l._id === action.payload);
        if (link) {
          link.clicks = (link.clicks || 0) + 1;
          link.lastClickedAt = new Date().toISOString();
        }
        if (state.currentLink && state.currentLink._id === action.payload) {
          (state.currentLink as any).clicks = ((state.currentLink as any).clicks || 0) + 1;
          (state.currentLink as any).lastClickedAt = new Date().toISOString();
        }
      });
    
    builder
      .addCase(fetchStatsThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchStatsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalClicks = action.payload.totalClicks;
        state.totalEarnings = action.payload.totalEarnings;
        state.earningPerClick = action.payload.earningPerClick;
        // optionally refresh links data with earnings
        // keep existing links but update clicks if provided
      })
      .addCase(fetchStatsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // Fetch link analytics
      .addCase(fetchLinkAnalyticsThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchLinkAnalyticsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.analytics = action.payload;
      })
      .addCase(fetchLinkAnalyticsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearCurrentLink, clearAnalytics } = linksSlice.actions;
export default linksSlice.reducer;
