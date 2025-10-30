import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type AdminAdState = {
  loading: boolean;
  error: string | null;
  current: { id: string; url: string; remaining: number; initialLimit?: number; active: boolean } | null;
  list: Array<{ id: string; url: string; remaining: number; initialLimit?: number; served?: number; active: boolean; createdAt: string }>;
  hits: Array<{ id: string; ip: string | null; country: string; createdAt: string }>;
  hitsPagination?: { page: number; limit: number; total: number; totalPages: number } | null;
  config: { mode: 'random' | 'priority'; priorityAdId: string | null } | null;
  analytics?: { days: number; trend: Array<{ date: string; clicks: number }>; countryBreakdown: Array<{ country: string; count: number; percentage: string }> };
};

const initialState: AdminAdState = {
  loading: false,
  error: null,
  current: null,
  list: [],
  hits: [],
  hitsPagination: null,
  config: null,
};

function apiBase() {
  if (typeof window === "undefined") return process.env.API_URL || "";
  return (process.env.API_URL || "").replace(/\/$/, "");
}

export const fetchCurrentAdminAdThunk = createAsyncThunk(
  "adminAds/fetchCurrent",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const res = await fetch(`${apiBase()}/api/admin/admin-ads/current`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`fetch-failed-${res.status}`);
      const data = await res.json();
      return data.ad ? {
        id: data.ad.id || data.ad._id,
        url: data.ad.url,
        remaining: data.ad.remaining,
        initialLimit: data.ad.initialLimit,
        active: data.ad.active,
      } : null;
    } catch (e: any) {
      return rejectWithValue(e?.message || "fetch-failed");
    }
  }
);

export const setAdminAdThunk = createAsyncThunk(
  "adminAds/set",
  async (payload: { url: string; limit: number }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const res = await fetch(`${apiBase()}/api/admin/admin-ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`set-failed-${res.status}`);
      const data = await res.json();
      return {
        id: data.id || data._id,
        url: data.url,
        remaining: data.remaining,
        initialLimit: data.initialLimit,
        active: data.active,
      };
    } catch (e: any) {
      return rejectWithValue(e?.message || "set-failed");
    }
  }
);

export const fetchAdminAdHitsThunk = createAsyncThunk(
  "adminAds/fetchHits",
  async (params: { page?: number; limit?: number; adId?: string } | undefined, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 20;
      const adId = params?.adId;
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (adId) qs.set('adId', adId);
      const res = await fetch(`${apiBase()}/api/admin/admin-ads/hits?${qs.toString()}`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error(`hits-failed-${res.status}`);
      const data = await res.json();
      return data as { hits: Array<{ id: string; ip: string | null; country: string; createdAt: string }>; pagination: { page: number; limit: number; total: number; totalPages: number } };
    } catch (e: any) {
      return rejectWithValue(e?.message || "hits-failed");
    }
  }
);

export const fetchAdminAdsListThunk = createAsyncThunk(
  "adminAds/fetchList",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const res = await fetch(`${apiBase()}/api/admin/admin-ads/list`, {
        headers: { "Authorization": token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(`list-failed-${res.status}`);
      const data = await res.json();
      return (data.ads || []).map((a: any) => ({ id: a.id || a._id, url: a.url, remaining: a.remaining, initialLimit: a.initialLimit, active: a.active, createdAt: a.createdAt }));
    } catch (e: any) {
      return rejectWithValue(e?.message || "list-failed");
    }
  }
);

export const fetchAdminAdsConfigThunk = createAsyncThunk(
  "adminAds/fetchConfig",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const res = await fetch(`${apiBase()}/api/admin/admin-ads/config`, { headers: { Authorization: token ? `Bearer ${token}` : "" }});
      if (!res.ok) throw new Error(`config-failed-${res.status}`);
      return await res.json() as { mode: 'random'|'priority'; priorityAdId: string | null };
    } catch (e: any) {
      return rejectWithValue(e?.message || "config-failed");
    }
  }
);

export const setAdminAdsConfigThunk = createAsyncThunk(
  "adminAds/setConfig",
  async (payload: { mode: 'random'|'priority'; priorityAdId?: string | null }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const res = await fetch(`${apiBase()}/api/admin/admin-ads/config`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : "" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`config-save-failed-${res.status}`);
      return await res.json() as { mode: 'random'|'priority'; priorityAdId: string | null };
    } catch (e: any) {
      return rejectWithValue(e?.message || "config-save-failed");
    }
  }
);

export const fetchAdminAdAnalyticsThunk = createAsyncThunk(
  "adminAds/fetchAnalytics",
  async (params: { adId: string; days?: number }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth?.token;
      const qs = new URLSearchParams();
      if (params.days) qs.set('days', String(params.days));
      const res = await fetch(`${apiBase()}/api/admin/admin-ads/${params.adId}/analytics?${qs.toString()}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(`analytics-failed-${res.status}`);
      return await res.json() as { days: number; trend: Array<{ date: string; clicks: number }>; countryBreakdown: Array<{ country: string; count: number; percentage: string }> };
    } catch (e: any) {
      return rejectWithValue(e?.message || "analytics-failed");
    }
  }
);

const slice = createSlice({
  name: "adminAds",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentAdminAdThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCurrentAdminAdThunk.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchCurrentAdminAdThunk.rejected, (s, a) => { s.loading = false; s.error = (a.payload as string) || String(a.error?.message || ""); })
      .addCase(setAdminAdThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(setAdminAdThunk.fulfilled, (s, a) => { s.loading = false; s.current = a.payload as any; })
      .addCase(setAdminAdThunk.rejected, (s, a) => { s.loading = false; s.error = (a.payload as string) || String(a.error?.message || ""); })
      .addCase(fetchAdminAdHitsThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminAdHitsThunk.fulfilled, (s, a) => { s.loading = false; s.hits = a.payload.hits; s.hitsPagination = a.payload.pagination; })
      .addCase(fetchAdminAdHitsThunk.rejected, (s, a) => { s.loading = false; s.error = (a.payload as string) || String(a.error?.message || ""); })
      .addCase(fetchAdminAdsListThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminAdsListThunk.fulfilled, (s, a) => { s.loading = false; s.list = a.payload as any; })
      .addCase(fetchAdminAdsListThunk.rejected, (s, a) => { s.loading = false; s.error = (a.payload as string) || String(a.error?.message || ""); })
      .addCase(fetchAdminAdsConfigThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminAdsConfigThunk.fulfilled, (s, a) => { s.loading = false; s.config = a.payload as any; })
      .addCase(fetchAdminAdsConfigThunk.rejected, (s, a) => { s.loading = false; s.error = (a.payload as string) || String(a.error?.message || ""); })
      .addCase(setAdminAdsConfigThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(setAdminAdsConfigThunk.fulfilled, (s, a) => { s.loading = false; s.config = a.payload as any; })
      .addCase(setAdminAdsConfigThunk.rejected, (s, a) => { s.loading = false; s.error = (a.payload as string) || String(a.error?.message || ""); })
      .addCase(fetchAdminAdAnalyticsThunk.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminAdAnalyticsThunk.fulfilled, (s, a) => { s.loading = false; (s as any).analytics = a.payload; })
      .addCase(fetchAdminAdAnalyticsThunk.rejected, (s, a) => { s.loading = false; s.error = (a.payload as string) || String(a.error?.message || ""); });
  },
});

export default slice.reducer;


