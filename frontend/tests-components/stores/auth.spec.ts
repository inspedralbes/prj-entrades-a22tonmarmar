import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";

describe("useAuthStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("initializes logged out", () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
  });

  it("sets authentication", () => {
    const store = useAuthStore();
    store.setAuth({
      token: "test-token-123",
      user: { id: 1, email: "test@test.com", name: "Test User" },
    });
    expect(store.token).toBe("test-token-123");
    expect(store.user).toEqual({ id: 1, email: "test@test.com", name: "Test User" });
    expect(store.isAuthenticated).toBe(true);
  });

  it("clears authentication", () => {
    const store = useAuthStore();
    store.setAuth({
      token: "test-token-123",
      user: { id: 1, email: "test@test.com", name: "Test User" },
    });
    store.clearAuth();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it("initFromStorage does nothing on server", () => {
    const store = useAuthStore();
    localStorage.setItem("token", "stored-token");
    store.initFromStorage();
    expect(store.token).toBeNull();
  });
});