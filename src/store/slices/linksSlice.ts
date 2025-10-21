import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleUnauthorized, refreshAccessTokenThunk } from "./authSlice";

type Link = {
  _id: string;
  slug: string;
  targetUrl: string;
  clicks: number;
  earnings?: number;
  lastClickedAt?: string;
  disabled: boolean;
  createdAt: string;
};

type LinksState = {
  links: Link[];
  currentLink: Link | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  userLinksPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  totalClicks?: number;
  totalEarnings?: number;
  earningPerClick?: number;
  geo?: Array<{ country: string; count: number; percentage: string }>;
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
        earnings: number;
      }>;
    }>;
    recentClicks: Array<{
      ip: string;
      country: string;
      userAgent: string;
      referer: string;
      clickedAt: string;
      earnings: number;
    }>;
    trend: Array<{
      date: string;
      clicks: number;
    }>;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  trend?: Array<{ date: string; clicks: number }>;
  trendRequestedDays?: number;
  trendLoading?: boolean;
};

const initialState: LinksState = {
  links: [],
  currentLink: null,
  status: "idle",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
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

// Fetch all links (admin)
export const fetchAllLinksThunk = createAsyncThunk(
  "links/fetchAllLinks",
  async (token: string, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
          res = await fetch(`${API_URL}/api/links/admin/all`, { headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Tüm linkler alınamadı");
      const data = await res.json();
      return data.links || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user's links by user ID (admin)
export const fetchUserLinksThunk = createAsyncThunk(
  "links/fetchUserLinks",
  async ({ token, userId, page = 1, limit = 10 }: { token: string; userId: string; page?: number; limit?: number }, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/admin/user/${userId}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
          res = await fetch(`${API_URL}/api/links/admin/user/${userId}?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Kullanıcı linkleri alınamadı");
      const data = await res.json();
      return { links: data.links || [], pagination: data.pagination };
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
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
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

// Bulk create links
export const bulkCreateLinksThunk = createAsyncThunk(
  "links/bulkCreateLinks",
  async ({ token, urls, text }: { token: string; urls?: string[]; text?: string }, { rejectWithValue, dispatch }) => {
    try {
      const body = urls && urls.length ? { urls } : { text };
      let res = await fetch(`${API_URL}/api/links/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
          res = await fetch(`${API_URL}/api/links/bulk`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${newToken}` }, body: JSON.stringify(body) });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ? JSON.stringify(data.error) : "Toplu oluşturma başarısız");
      }
      const data = await res.json();
      const now = new Date().toISOString();
      const normalized = (data.links || []).map((l: any) => ({
        _id: l.id,
        slug: l.slug,
        targetUrl: l.targetUrl,
        clicks: 0,
        disabled: false,
        createdAt: now,
      }));
      return normalized as Link[];
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
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
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
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
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
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
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

// Fetch geo breakdown for overview
export const fetchGeoThunk = createAsyncThunk(
  "links/fetchGeo",
  async (payload: { token: string; days?: number }, { rejectWithValue, dispatch }) => {
    try {
      const { token, days } = payload;
      const qs = days ? `?days=${days}` : "";
      let res = await fetch(`${API_URL}/api/links/geo${qs}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
          res = await fetch(`${API_URL}/api/links/geo${qs}`, { headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Coğrafi dağılım alınamadı");
      const data = await res.json();
      return data.countryBreakdown as Array<{ country: string; count: number; percentage: string }>;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch daily trend
export const fetchTrendThunk = createAsyncThunk(
  "links/fetchTrend",
  async ({ token, days = 30 }: { token: string; days?: number }, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/trend?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
          res = await fetch(`${API_URL}/api/links/trend?days=${days}`, { headers: { Authorization: `Bearer ${newToken}` } });
        } catch {}
        if (res.status === 401) {
          dispatch(handleUnauthorized());
          return rejectWithValue("Unauthorized");
        }
      }
      if (!res.ok) throw new Error("Trend alınamadı");
      const data = await res.json();
      return data.trend as Array<{ date: string; clicks: number }>;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch link analytics
export const fetchLinkAnalyticsThunk = createAsyncThunk(
  "links/fetchLinkAnalytics",
  async ({ token, linkId, page = 1, limit = 10, days = 365 }: { token: string; linkId: string; page?: number; limit?: number; days?: number }, { rejectWithValue, dispatch }) => {
    try {
      let res = await fetch(`${API_URL}/api/links/${linkId}/analytics?page=${page}&limit=${limit}&days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        try {
          await dispatch<any>(refreshAccessTokenThunk());
          const newToken = (typeof window !== 'undefined' ? localStorage.getItem("token") : null) || token;
          res = await fetch(`${API_URL}/api/links/${linkId}/analytics?page=${page}&limit=${limit}&days=${days}`, { headers: { Authorization: `Bearer ${newToken}` } });
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

// Verify recaptcha via app route
export const verifyRecaptchaThunk = createAsyncThunk(
  "links/verifyRecaptcha",
  async (payload: { token: string }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: payload.token }),
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Doğrulama başarısız");
      }
      return data as any;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Issue signed token for short link
export const issueTokenThunk = createAsyncThunk(
  "links/issueToken",
  async (payload: { slug: string }, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/links/issue-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: payload.slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Token üretilemedi");
      return data as { token: string; targetUrl: string; exp?: number };
    } catch (e: any) {
      return rejectWithValue(e.message);
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
      .addCase(fetchAllLinksThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.links = action.payload;
      })
      .addCase(fetchUserLinksThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.links = action.payload.links;
        state.userLinksPagination = action.payload.pagination;
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

      // Bulk create links
      .addCase(bulkCreateLinksThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(bulkCreateLinksThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.links = [...action.payload, ...state.links];
      })
      .addCase(bulkCreateLinksThunk.rejected, (state, action) => {
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
      .addCase(fetchGeoThunk.fulfilled, (state, action) => {
        state.geo = action.payload;
      })
      .addCase(fetchStatsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTrendThunk.pending, (state, action) => {
        state.trendLoading = true;
        state.trendRequestedDays = action.meta.arg?.days ?? 30;
      })
      .addCase(fetchTrendThunk.fulfilled, (state, action) => {
        // Only apply if this response matches the latest requested range
        const responseDays = action.meta.arg?.days ?? 30;
        if (state.trendRequestedDays === undefined || state.trendRequestedDays === responseDays) {
          state.trend = action.payload;
        }
        state.trendLoading = false;
      })
      .addCase(fetchTrendThunk.rejected, (state) => {
        state.trendLoading = false;
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
