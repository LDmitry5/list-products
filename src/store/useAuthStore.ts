import { create } from "zustand";

interface AuthState {
  token: string | null;
  isPersistent: boolean;
  setToken: (token: string, isPersistent: boolean) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isPersistent: false,
  setToken: (token, isPersistent) => {
    set({ token, isPersistent });
    if (isPersistent) {
      localStorage.setItem("authToken", token);
    } else {
      sessionStorage.setItem("authToken", token);
    }
  },
  clearToken: () => {
    set({ token: null });
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
  },
}));
