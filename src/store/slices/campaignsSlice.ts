import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { refreshAccessTokenThunk, handleUnauthorized } from "./authSlice";

type Campaign = {
  _id: string;
  name: string;
  type: string;
  target: number;
  country: string;
  budget: number;
  spent: number;
  clicks: number;
  status: "active" | "paused" | "completed";
  createdAt: string;
};

type CampaignsState = {
  items: Campaign[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  pricing?: Array<{ audience: "user"|"advertiser"; country: string; unit: string; rates: { website_traffic: number } }>;
  myPayments?: Array<{ _id: string; amount: number; currency: string; method: string; status: string; createdAt: string; description?: string }>;
  adminUserSummary?: any;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const callApi = async (
  url: string,
  options: RequestInit,
  dispatch: any,
  getState: any,
  retry = 0
) => {
  let res = await fetch(url, options);
  if (res.status === 401 && retry < 1) {
    const r = await dispatch(refreshAccessTokenThunk());
    if (r.meta.requestStatus === "fulfilled") {
      const newToken = r.payload.token;
      const newOptions = {
        ...options,
        headers: { ...(options.headers || {}), Authorization: `Bearer ${newToken}` },
      };
      return callApi(url, newOptions, dispatch, getState, retry + 1);
    } else {
      dispatch(handleUnauthorized());
      throw new Error("Unauthorized");
    }
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "API error");
  }
  return res;
};

export const fetchCampaignsThunk = createAsyncThunk(
  "campaigns/fetch",
  async (status: "active" | "completed" | void, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const qs = status ? `?status=${status}` : "";
      const res = await callApi(`${API_URL}/api/campaigns${qs}`, { headers: { Authorization: `Bearer ${token}` } }, dispatch, getState);
      const data = await res.json();
      return data.campaigns as Campaign[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const createCampaignThunk = createAsyncThunk(
  "campaigns/create",
  async (payload: { name: string; type: string; target: number; country: string; budget: number }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(
        `${API_URL}/api/campaigns`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        },
        dispatch,
        getState
      );
      const data = await res.json();
      // Refresh list after create
      try { await dispatch<any>(fetchCampaignsThunk()); } catch {}
      return data.campaign as Campaign;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Pricing slice helpers
export const fetchPricingThunk = createAsyncThunk(
  "campaigns/fetchPricing",
  async (_: void, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/api/pricing`);
      if (!res.ok) throw new Error("Fiyatlar yüklenemedi");
      return (await res.json()).entries as Array<{ audience: "user"|"advertiser"; country: string; unit: string; rates: { website_traffic: number } }>;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Admin: add single pricing entry
export const addPricingThunk = createAsyncThunk(
  "campaigns/addPricing",
  async (payload: { audience: "user"|"advertiser"; country: string; unit?: string; rates: { website_traffic: number } }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(
        `${API_URL}/api/pricing`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        },
        dispatch,
        getState
      );
      const data = await res.json();
      return data.entries as any[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Admin: upsert pricing table
export const upsertPricingThunk = createAsyncThunk(
  "campaigns/upsertPricing",
  async (payload: { entries: Array<{ audience: "user"|"advertiser"; country: string; unit?: string; rates: { website_traffic: number } }> }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(
        `${API_URL}/api/pricing`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        },
        dispatch,
        getState
      );
      const data = await res.json();
      return data.entries as any[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Delete pricing entry (admin)
export const deletePricingThunk = createAsyncThunk(
  "campaigns/deletePricing",
  async (payload: { audience: "user"|"advertiser"; country: string }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(
        `${API_URL}/api/pricing/${payload.audience}/${payload.country}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
        dispatch,
        getState
      );
      const data = await res.json();
      return data.entries as any[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Update pricing entry (admin)
export const updatePricingThunk = createAsyncThunk(
  "campaigns/updatePricing",
  async (payload: { 
    audience: "user"|"advertiser"; 
    country: string; 
    data: { audience: "user"|"advertiser"; country: string; unit?: string; rates: { website_traffic: number } }
  }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(
        `${API_URL}/api/pricing/${payload.audience}/${payload.country}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload.data),
        },
        dispatch,
        getState
      );
      const data = await res.json();
      return data.entries as any[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchMyPaymentsThunk = createAsyncThunk(
  "campaigns/fetchMyPayments",
  async (_: void, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(`${API_URL}/api/payments/me`, { headers: { Authorization: `Bearer ${token}` } }, dispatch, getState);
      const data = await res.json();
      return data.payments as any[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Admin: fetch campaign summary for a user
export const fetchAdminUserCampaignSummaryThunk = createAsyncThunk(
  "campaigns/fetchAdminUserCampaignSummary",
  async (userId: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(
        `${API_URL}/api/campaigns/admin/user/${userId}/summary`,
        { headers: { Authorization: `Bearer ${token}` } },
        dispatch,
        getState
      );
      const data = await res.json();
      return { userId, data } as any;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// End campaign (advertiser)
export const endCampaignThunk = createAsyncThunk(
  "campaigns/endCampaign",
  async (campaignId: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(
        `${API_URL}/api/campaigns/${campaignId}/end`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } },
        dispatch,
        getState
      );
      const data = await res.json();
      return data as any;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);


const initialState: CampaignsState = { items: [], status: "idle", pricing: [], adminUserSummary: undefined };

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCampaignsThunk.pending, (s) => { s.status = "loading"; s.error = undefined; });
    b.addCase(fetchCampaignsThunk.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; });
    b.addCase(fetchCampaignsThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.payload as string; });

    b.addCase(createCampaignThunk.fulfilled, (s, a) => {
      if (!a.payload) return;
      const exists = s.items.findIndex((c) => c._id === (a.payload as any)._id);
      if (exists >= 0) {
        s.items[exists] = a.payload as any;
      } else {
        s.items = [a.payload as any, ...s.items.filter((c) => c._id !== (a.payload as any)._id)];
      }
    });

    b.addCase(fetchPricingThunk.fulfilled, (s, a) => { s.pricing = a.payload as any; });
    b.addCase(addPricingThunk.fulfilled, (s, a) => { s.pricing = a.payload as any; });
    b.addCase(upsertPricingThunk.fulfilled, (s, a) => { s.pricing = a.payload as any; });
    b.addCase(deletePricingThunk.fulfilled, (s, a) => { s.pricing = a.payload as any; });
    b.addCase(updatePricingThunk.fulfilled, (s, a) => { s.pricing = a.payload as any; });
    b.addCase(fetchMyPaymentsThunk.fulfilled, (s, a) => { s.myPayments = a.payload as any; });
    b.addCase(fetchAdminUserCampaignSummaryThunk.fulfilled, (s, a) => {
      s.adminUserSummary = (a.payload as any).data;
    });
    b.addCase(endCampaignThunk.fulfilled, (s) => {
      // no-op: calling code refreshes campaigns list
    });
  }
});

export default campaignsSlice.reducer;


