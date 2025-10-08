import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { refreshAccessTokenThunk, handleUnauthorized } from "./authSlice";

type Payment = {
  _id: string;
  amount: number;
  currency: string;
  method: string;
  description?: string;
  status: string;
  category: "payment" | "withdrawal" | "earning";
  audience: "user" | "advertiser";
  iban?: string;
  fullName?: string;
  adminNotes?: string;
  createdAt: string;
  ownerId?: {
    _id: string;
    email: string;
    name?: string;
    fullName?: string;
    iban?: string;
  };
};

type PaymentsState = {
  myPayments: Payment[];
  allPayments: Payment[];
  userWithdrawals: Payment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  allPaymentsPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  withdrawalsPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

const initialState: PaymentsState = {
  myPayments: [],
  allPayments: [],
  userWithdrawals: [],
  status: "idle",
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

// Fetch my payments (user/advertiser)
export const fetchMyPaymentsThunk = createAsyncThunk(
  "payments/fetchMyPayments",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(`${API_URL}/api/payments/me`, { 
        headers: { Authorization: `Bearer ${token}` } 
      }, dispatch, getState);
      const data = await res.json();
      return data.payments as Payment[];
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Fetch all payments (admin)
export const fetchAllPaymentsThunk = createAsyncThunk(
  "payments/fetchAllPayments",
  async ({ page = 1, limit = 20, category, audience }: { page?: number; limit?: number; category?: string; audience?: string } = {}, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(category && { category }),
        ...(audience && { audience }),
      });
      const res = await callApi(`${API_URL}/api/payments/admin/all?${params}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      }, dispatch, getState);
      const data = await res.json();
      return { payments: data.payments as Payment[], pagination: data.pagination };
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Fetch user withdrawals (admin)
export const fetchUserWithdrawalsThunk = createAsyncThunk(
  "payments/fetchUserWithdrawals",
  async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string } = {}, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });
      const res = await callApi(`${API_URL}/api/payments/admin/withdrawals?${params}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      }, dispatch, getState);
      const data = await res.json();
      return { payments: data.payments as Payment[], pagination: data.pagination };
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Create payment/withdrawal
export const createPaymentThunk = createAsyncThunk(
  "payments/createPayment",
  async (paymentData: {
    amount: number;
    currency?: string;
    method?: string;
    description?: string;
    category?: "payment" | "withdrawal" | "earning";
    audience?: "user" | "advertiser";
    iban?: string;
    fullName?: string;
  }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(paymentData)
      }, dispatch, getState);
      const data = await res.json();
      return data.payment as Payment;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Update payment status (admin)
export const updatePaymentStatusThunk = createAsyncThunk(
  "payments/updatePaymentStatus",
  async ({ paymentId, status }: { paymentId: string; status: string }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(`${API_URL}/api/payments/${paymentId}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      }, dispatch, getState);
      const data = await res.json();
      return data.payment as Payment;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

// Update admin notes (admin)
export const updateAdminNotesThunk = createAsyncThunk(
  "payments/updateAdminNotes",
  async ({ paymentId, adminNotes }: { paymentId: string; adminNotes: string }, { dispatch, getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await callApi(`${API_URL}/api/payments/${paymentId}/admin-notes`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ adminNotes })
      }, dispatch, getState);
      const data = await res.json();
      return data.payment as Payment;
    } catch (e: any) {
      return rejectWithValue(e.message);
    }
  }
);

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my payments
      .addCase(fetchMyPaymentsThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchMyPaymentsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myPayments = action.payload;
      })
      .addCase(fetchMyPaymentsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      
      // Fetch all payments
      .addCase(fetchAllPaymentsThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchAllPaymentsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allPayments = action.payload.payments;
        state.allPaymentsPagination = action.payload.pagination;
      })
      .addCase(fetchAllPaymentsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      
      // Fetch user withdrawals
      .addCase(fetchUserWithdrawalsThunk.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchUserWithdrawalsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userWithdrawals = action.payload.payments;
        state.withdrawalsPagination = action.payload.pagination;
      })
      .addCase(fetchUserWithdrawalsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      
      // Create payment
      .addCase(createPaymentThunk.fulfilled, (state, action) => {
        state.myPayments.unshift(action.payload);
      })
      
      // Update payment status
      .addCase(updatePaymentStatusThunk.fulfilled, (state, action) => {
        const updatedPayment = action.payload;
        // Update in all relevant arrays
        state.allPayments = state.allPayments.map(p => 
          p._id === updatedPayment._id ? updatedPayment : p
        );
        state.userWithdrawals = state.userWithdrawals.map(p => 
          p._id === updatedPayment._id ? updatedPayment : p
        );
        state.myPayments = state.myPayments.map(p => 
          p._id === updatedPayment._id ? updatedPayment : p
        );
      })
      
      // Update admin notes
      .addCase(updateAdminNotesThunk.fulfilled, (state, action) => {
        const updatedPayment = action.payload;
        // Update in all relevant arrays
        state.allPayments = state.allPayments.map(p => 
          p._id === updatedPayment._id ? updatedPayment : p
        );
        state.userWithdrawals = state.userWithdrawals.map(p => 
          p._id === updatedPayment._id ? updatedPayment : p
        );
      });
  },
});

export const { clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
