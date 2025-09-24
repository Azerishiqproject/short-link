import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppUser = { id?: string; _id?: string; email: string; name?: string; role: string; createdAt?: string; balance?: number };

type UsersState = {
  users: AppUser[];
  selectedUserId?: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const fetchAllUsersThunk = createAsyncThunk<AppUser[], { token: string }>(
  "users/fetchAll",
  async ({ token }) => {
    const res = await fetch(`${API_URL}/api/auth/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error((await res.text()) || "Kullanıcılar alınamadı");
    const data = await res.json();
    return (data.users || []) as AppUser[];
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
      .addCase(fetchAllUsersThunk.fulfilled, (s, a) => { s.status = "succeeded"; s.users = a.payload; })
      .addCase(fetchAllUsersThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; });
  }
});

export const { setSelectedUserId } = usersSlice.actions;
export default usersSlice.reducer;


