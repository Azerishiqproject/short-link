import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppUser = { id?: string; _id?: string; email: string; name?: string; role: string; createdAt?: string; balance?: number };

type UsersState = {
  users: AppUser[];
  selectedUserId?: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllUsersThunk = createAsyncThunk<
  { users: AppUser[]; pagination: any },
  { token: string; page?: number; limit?: number }
>(
  "users/fetchAll",
  async ({ token, page = 1, limit = 20 }) => {
    const res = await fetch(`${API_URL}/api/auth/admin/users?page=${page}&limit=${limit}`, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    if (!res.ok) throw new Error((await res.text()) || "Kullanıcılar alınamadı");
    const data = await res.json();
    return { users: data.users || [], pagination: data.pagination };
  }
);

const initialState: UsersState = { users: [], status: "idle" };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUserId(state, action: PayloadAction<string | undefined>) {
      state.selectedUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsersThunk.pending, (s) => { s.status = "loading"; s.error = undefined; })
      .addCase(fetchAllUsersThunk.fulfilled, (s, a) => { 
        s.status = "succeeded"; 
        s.users = a.payload.users; 
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchAllUsersThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; });
  }
});

export const { setSelectedUserId } = usersSlice.actions;
export default usersSlice.reducer;


