import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getOrCreateDeviceId } from "@/lib/utils";

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

const API_URL = process.env.API_URL;

export const fetchAllUsersThunk = createAsyncThunk<{ users: AppUser[]; pagination?: any }, { token: string; page?: number; limit?: number; search?: string; role?: string }>(
  "users/fetchAll",
  async ({ token, page = 1, limit = 20, search = "", role = "all" }) => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const roleParam = role && role !== "all" ? `&role=${encodeURIComponent(role)}` : "";
    const deviceId = getOrCreateDeviceId();
    const headers: any = { Authorization: `Bearer ${token}` };
    if (deviceId) headers["x-device-id"] = deviceId;
    const res = await fetch(`${API_URL}/api/auth/admin/users?page=${page}&limit=${limit}${searchParam}${roleParam}`, { headers });
    if (!res.ok) throw new Error((await res.text()) || "Kullanıcılar alınamadı");
    const data = await res.json();
    return { users: (data.users || []) as AppUser[], pagination: data.pagination };
  }
);

export const updateUserThunk = createAsyncThunk<AppUser, { userId: string; data: any }>(
  "users/update",
  async ({ userId, data }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const deviceId = getOrCreateDeviceId();
    const headers: any = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    if (deviceId) headers["x-device-id"] = deviceId;
    const res = await fetch(`${API_URL}/api/auth/admin/users/${userId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.text()) || "Kullanıcı güncellenemedi");
    const responseData = await res.json();
    return responseData.user as AppUser;
  }
);

export const createIpBanThunk = createAsyncThunk<any, { token: string; ip: string; reason?: string; expiresAt?: string }>(
  "users/createIpBan",
  async ({ token, ip, reason, expiresAt }) => {
    const deviceId = getOrCreateDeviceId();
    const headers: any = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    if (deviceId) headers['x-device-id'] = deviceId;
    const res = await fetch(`${API_URL}/api/admin/bans`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ip, reason, expiresAt })
    });
    if (!res.ok) throw new Error((await res.text()) || 'Ban oluşturulamadı');
    return await res.json();
  }
);

export const createDeviceBanThunk = createAsyncThunk<any, { token: string; deviceId: string; reason?: string; expiresAt?: string }>(
  "users/createDeviceBan",
  async ({ token, deviceId: targetDeviceId, reason, expiresAt }) => {
    const deviceId = getOrCreateDeviceId();
    const headers: any = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    if (deviceId) headers['x-device-id'] = deviceId;
    const res = await fetch(`${API_URL}/api/admin/bans`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ deviceId: targetDeviceId, reason, expiresAt })
    });
    if (!res.ok) throw new Error((await res.text()) || 'Ban oluşturulamadı');
    return await res.json();
  }
);

export const createEmailBanThunk = createAsyncThunk<any, { token: string; email: string; reason?: string; expiresAt?: string }>(
  "users/createEmailBan",
  async ({ token, email, reason, expiresAt }) => {
    const deviceId = getOrCreateDeviceId();
    const headers: any = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    if (deviceId) headers['x-device-id'] = deviceId;
    const res = await fetch(`${API_URL}/api/admin/bans`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, reason, expiresAt })
    });
    if (!res.ok) throw new Error((await res.text()) || 'Ban oluşturulamadı');
    return await res.json();
  }
);

export const fetchBansThunk = createAsyncThunk<any, { token: string; page?: number; limit?: number }>(
  "users/fetchBans",
  async ({ token, page = 1, limit = 20 }) => {
    const deviceId = getOrCreateDeviceId();
    const headers: any = { Authorization: `Bearer ${token}` };
    if (deviceId) headers['x-device-id'] = deviceId;
    const res = await fetch(`${API_URL}/api/admin/bans?page=${page}&limit=${limit}`, { headers });
    if (!res.ok) throw new Error((await res.text()) || 'Ban listesi alınamadı');
    return await res.json();
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
      .addCase(fetchAllUsersThunk.fulfilled, (s, a) => { s.status = "succeeded"; s.users = a.payload.users; s.pagination = a.payload.pagination; })
      .addCase(fetchAllUsersThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })
      .addCase(updateUserThunk.fulfilled, (s, a) => {
        const index = s.users.findIndex(u => (u._id || u.id) === (a.payload._id || a.payload.id));
        if (index >= 0) {
          s.users[index] = a.payload;
        }
      });
  }
});

export const { setSelectedUserId } = usersSlice.actions;
export default usersSlice.reducer;


