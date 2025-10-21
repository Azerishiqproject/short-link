import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Types
export interface ReferralSettings {
  _id: string;
  isActive: boolean;
  referrerPercentage: number;
  minReferralEarning: number;
  maxReferralEarning: number;
  adminNotes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralTransaction {
  _id: string;
  referrer: {
    _id: string;
    name: string;
    email: string;
    referralCode: string;
  };
  referee: {
    _id: string;
    name: string;
    email: string;
  };
  action: "registration" | "click";
  amount: number;
  percentage: number;
  sourceId?: string;
  sourceType?: string;
  status: string;
  paymentStatus: string;
  paidAt?: string;
  adminNotes?: string;
  description?: string;
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  paidReferrals: number;
  totalPaid: number;
  pendingAmount: number;
  topReferrers: Array<{
    userId: string;
    name: string;
    email: string;
    referralCode: string;
    count: number;
    totalAmount: number;
  }>;
}

export interface ReferralState {
  // Settings
  settings: ReferralSettings | null;
  settingsLoading: boolean;
  settingsError: string | null;
  
  // Transactions
  transactions: ReferralTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  
  // Stats
  stats: ReferralStats | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // UI State
  selectedTransactions: string[];
  activeSection: "settings" | "transactions" | "stats";
}

const initialState: ReferralState = {
  settings: null,
  settingsLoading: false,
  settingsError: null,
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionsPagination: null,
  stats: null,
  statsLoading: false,
  statsError: null,
  selectedTransactions: [],
  activeSection: "settings",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Async Thunks

// Fetch referral settings
export const fetchReferralSettingsThunk = createAsyncThunk(
  "referral/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const response = await fetch(`${API_URL}/api/admin/referrals/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || "Failed to fetch settings");
      }
      
      const data = await response.json();
      return data.settings;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

// Update referral settings
export const updateReferralSettingsThunk = createAsyncThunk(
  "referral/updateSettings",
  async (settingsData: Partial<ReferralSettings>, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const response = await fetch(`${API_URL}/api/admin/referrals/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
      });
      
      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const error = await response.json();
          if (typeof (error as any)?.error === "string") message = (error as any).error;
          else if ((error as any)?.error?.formErrors?.formErrors?.length) {
            message = (error as any).error.formErrors.formErrors.join(", ");
          } else if ((error as any)?.error?.fieldErrors) {
            const fields = Object.entries((error as any).error.fieldErrors)
              .map(([k, v]: any) => `${k}: ${Array.isArray(v)? v.join("; ") : String(v)}`)
              .join(", ");
            if (fields) message = fields;
          }
        } catch {}
        return rejectWithValue(message || "Failed to update settings");
      }
      
      const data = await response.json();
      return data.settings;
    } catch (error: any) {
      return rejectWithValue(error?.message || "Network error");
    }
  }
);

// Fetch referral transactions
export const fetchReferralTransactionsThunk = createAsyncThunk(
  "referral/fetchTransactions",
  async (params: { page?: number; limit?: number; status?: string; paymentStatus?: string } = {}, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.status) queryParams.append("status", params.status);
      if (params.paymentStatus) queryParams.append("paymentStatus", params.paymentStatus);
      
      const response = await fetch(`${API_URL}/api/admin/referrals/transactions?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || "Failed to fetch transactions");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

// Update referral transaction
export const updateReferralTransactionThunk = createAsyncThunk(
  "referral/updateTransaction",
  async ({ id, data }: { id: string; data: Partial<ReferralTransaction> }, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const response = await fetch(`${API_URL}/api/admin/referrals/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || "Failed to update transaction");
      }
      
      const result = await response.json();
      return result.transaction;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

// Fetch referral stats
export const fetchReferralStatsThunk = createAsyncThunk(
  "referral/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const response = await fetch(`${API_URL}/api/admin/referrals/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || "Failed to fetch stats");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

// Bulk pay transactions
export const bulkPayReferralTransactionsThunk = createAsyncThunk(
  "referral/bulkPay",
  async (transactionIds: string[], { rejectWithValue }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const response = await fetch(`${API_URL}/api/admin/referrals/bulk-pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactionIds }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || "Failed to bulk pay");
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue("Network error");
    }
  }
);

// Slice
const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    // UI Actions
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setSelectedTransactions: (state, action) => {
      state.selectedTransactions = action.payload;
    },
    toggleTransactionSelection: (state, action) => {
      const transactionId = action.payload;
      const index = state.selectedTransactions.indexOf(transactionId);
      if (index > -1) {
        state.selectedTransactions.splice(index, 1);
      } else {
        state.selectedTransactions.push(transactionId);
      }
    },
    selectAllTransactions: (state) => {
      state.selectedTransactions = state.transactions.map(t => t._id);
    },
    clearSelectedTransactions: (state) => {
      state.selectedTransactions = [];
    },
    
    // Clear errors
    clearSettingsError: (state) => {
      state.settingsError = null;
    },
    clearTransactionsError: (state) => {
      state.transactionsError = null;
    },
    clearStatsError: (state) => {
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchReferralSettingsThunk.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchReferralSettingsThunk.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchReferralSettingsThunk.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload as string;
      })
      
      // Update Settings
      .addCase(updateReferralSettingsThunk.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(updateReferralSettingsThunk.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateReferralSettingsThunk.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload as string;
      })
      
      // Fetch Transactions
      .addCase(fetchReferralTransactionsThunk.pending, (state) => {
        state.transactionsLoading = true;
        state.transactionsError = null;
      })
      .addCase(fetchReferralTransactionsThunk.fulfilled, (state, action) => {
        state.transactionsLoading = false;
        state.transactions = action.payload.transactions;
        state.transactionsPagination = action.payload.pagination;
      })
      .addCase(fetchReferralTransactionsThunk.rejected, (state, action) => {
        state.transactionsLoading = false;
        state.transactionsError = action.payload as string;
      })
      
      // Update Transaction
      .addCase(updateReferralTransactionThunk.fulfilled, (state, action) => {
        const updatedTransaction = action.payload;
        const index = state.transactions.findIndex(t => t._id === updatedTransaction._id);
        if (index !== -1) {
          state.transactions[index] = updatedTransaction;
        }
      })
      
      // Fetch Stats
      .addCase(fetchReferralStatsThunk.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchReferralStatsThunk.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchReferralStatsThunk.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      })
      
      // Bulk Pay
      .addCase(bulkPayReferralTransactionsThunk.fulfilled, (state, action) => {
        // Refresh transactions after bulk pay
        state.selectedTransactions = [];
      });
  },
});

export const {
  setActiveSection,
  setSelectedTransactions,
  toggleTransactionSelection,
  selectAllTransactions,
  clearSelectedTransactions,
  clearSettingsError,
  clearTransactionsError,
  clearStatsError,
} = referralSlice.actions;

export default referralSlice.reducer;
