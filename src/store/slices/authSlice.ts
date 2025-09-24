import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";

type User = { id: string; email: string; name?: string; role?: string; balance?: number; available_balance?: number; reserved_balance?: number; display_available?: number; display_reserved?: number };
type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken?: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  hydrated?: boolean;
};

const initialState: AuthState = { user: null, token: null, refreshToken: null, status: "idle", hydrated: false };
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: { email: string; password: string; name?: string; role?: string }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Register failed");
    return (await res.json()) as { token: string; refreshToken: string; user: User };
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string; rememberMe?: boolean }) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: payload.email, password: payload.password }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "Login failed");
    const data = (await res.json()) as { token: string; refreshToken: string; user: User };
    return { ...data, rememberMe: !!payload.rememberMe } as { token: string; refreshToken: string; user: User; rememberMe: boolean };
  }
);

export const refreshAccessTokenThunk = createAsyncThunk(
  "auth/refresh",
  async (_: void, { getState }) => {
    const state = getState() as any;
    const refreshToken = state.auth.refreshToken || (typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null);
    if (!refreshToken) throw new Error("Missing refresh token");
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error("Refresh failed");
    return (await res.json()) as { token: string };
  }
);

export const fetchMeThunk = createAsyncThunk(
  "auth/me",
  async (_: void, { getState }) => {
    const state = getState() as any;
    const token = state.auth.token as string | null;
    if (!token) throw new Error("Missing token");
    const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    return data.user as User;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = undefined;
      if (typeof window !== "undefined") {
        const currentTheme = localStorage.getItem("theme");
        try {
          // Clear all app data in localStorage except theme
          localStorage.clear();
        } catch {}
        if (currentTheme) {
          try { localStorage.setItem("theme", currentTheme); } catch {}
        }
        try {
          // Clear sessionStorage completely
          sessionStorage.clear();
        } catch {}
        document.cookie = "role=; Path=/; Max-Age=0";
      }
    },
    handleUnauthorized(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = "Oturum süresi doldu. Lütfen tekrar giriş yapın.";
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        document.cookie = "role=; Path=/; Max-Age=0";
        // Otomatik olarak login sayfasına yönlendir
        window.location.href = "/login";
      }
    },
    setFromStorage(state) {
      if (typeof window === "undefined") return;
      const rememberMe = localStorage.getItem("rememberMe") === "1";
      const token = (rememberMe ? localStorage : sessionStorage).getItem("token") || localStorage.getItem("token") || sessionStorage.getItem("token");
      const refreshToken = (rememberMe ? localStorage : sessionStorage).getItem("refreshToken") || localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
      const userRaw = (rememberMe ? localStorage : sessionStorage).getItem("user") || localStorage.getItem("user") || sessionStorage.getItem("user");
      if (token) state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;
      if (userRaw) {
        try {
          state.user = JSON.parse(userRaw) as User;
        } catch {}
      }
      // keep cookie role in sync
      const role = (state.user?.role ?? "").toString();
      if (role) document.cookie = `role=${role}; Path=/; SameSite=Lax`;
      state.hydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (s) => { s.status = "loading"; s.error = undefined; })
      .addCase(registerThunk.fulfilled, (s, a) => {
        s.status = "succeeded"; s.user = a.payload.user; s.token = a.payload.token; s.refreshToken = a.payload.refreshToken;
        if (typeof window !== "undefined") {
          // Always persist to localStorage as the durable source of truth
          localStorage.setItem("token", a.payload.token);
          localStorage.setItem("user", JSON.stringify(a.payload.user));
          localStorage.setItem("refreshToken", a.payload.refreshToken);
          // Mirror to sessionStorage for non-remembered sessions if needed later
          sessionStorage.setItem("token", a.payload.token);
          sessionStorage.setItem("refreshToken", a.payload.refreshToken);
          sessionStorage.setItem("user", JSON.stringify(a.payload.user));
          document.cookie = `role=${a.payload.user.role ?? "user"}; Path=/; SameSite=Lax`;
        }
      })
      .addCase(registerThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })
      .addCase(loginThunk.pending, (s) => { s.status = "loading"; s.error = undefined; })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.status = "succeeded"; s.user = a.payload.user; s.token = a.payload.token; s.refreshToken = a.payload.refreshToken;
        if (typeof window !== "undefined") {
          // clear both stores first
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("user");
          // Always persist tokens in localStorage
          localStorage.setItem("token", a.payload.token);
          localStorage.setItem("refreshToken", a.payload.refreshToken);
          localStorage.setItem("user", JSON.stringify(a.payload.user));
          // For non-remembered sessions also mirror into sessionStorage so page refresh keeps session alive
          if (!a.payload.rememberMe) {
            sessionStorage.setItem("token", a.payload.token);
            sessionStorage.setItem("refreshToken", a.payload.refreshToken);
            sessionStorage.setItem("user", JSON.stringify(a.payload.user));
          }
          localStorage.setItem("rememberMe", a.payload.rememberMe ? "1" : "0");
          document.cookie = `role=${a.payload.user.role ?? "user"}; Path=/; SameSite=Lax`;
        }
      })
      .addCase(loginThunk.rejected, (s, a) => { s.status = "failed"; s.error = a.error.message; })
      .addCase(refreshAccessTokenThunk.fulfilled, (s, a) => {
        s.token = a.payload.token;
        if (typeof window !== "undefined") {
          // Update both storages to keep in sync regardless of rememberMe
          localStorage.setItem("token", a.payload.token);
          sessionStorage.setItem("token", a.payload.token);
        }
      })
      .addCase(fetchMeThunk.fulfilled, (s, a) => {
        s.user = { ...(s.user || {}), ...a.payload } as any;
        if (typeof window !== "undefined") {
          const rememberMe = localStorage.getItem("rememberMe") === "1";
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem("user", JSON.stringify(s.user));
        }
      });
  }
});

export const { logout, setFromStorage, handleUnauthorized } = authSlice.actions;
export default authSlice.reducer;


