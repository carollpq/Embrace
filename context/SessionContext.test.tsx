// __tests__/SessionContext.test.tsx
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { vi } from "vitest";
import { useRouter } from "next/navigation";

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Helper component to test useSession
const TestComponent = () => {
  const { user, logout, recheckSession, isLoggingOut, error } = useSession();
  return (
    <div>
      <p>User: {user ? user.name : "None"}</p>
      <p>Logging Out: {String(isLoggingOut)}</p>
      <p>Error: {error}</p>
      <button onClick={recheckSession}>Recheck</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("SessionContext", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
  });

  it("provides default state and throws outside provider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() => useSession()).toThrow(
      "useSession must be used within SessionProvider"
    );
    consoleError.mockRestore();
  });

  it("fetches and sets user on recheckSession success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { name: "Test User" } }),
    }) as any;

    render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    screen.getByText("User: None");
    screen.getByText("Recheck").click();

    await waitFor(() => screen.getByText("User: Test User"));
  });

  it("clears user and shows error on recheckSession failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    }) as any;

    render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    screen.getByText("Recheck").click();
    await waitFor(() => screen.getByText(/Unauthorized/));
    screen.getByText("User: None");
  });

  it("logs out the user and redirects on success", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
    }) as any;

    render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    screen.getByText("Logout").click();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
    screen.getByText("User: None");
  });

  it("handles logout error correctly", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Logout failed" }),
    }) as any;

    render(
      <SessionProvider>
        <TestComponent />
      </SessionProvider>
    );

    screen.getByText("Logout").click();
    await waitFor(() => screen.getByText("Error: Logout failed"));
  });
});
