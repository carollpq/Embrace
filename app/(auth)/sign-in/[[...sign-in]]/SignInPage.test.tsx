import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SigninPage from "./page";
import { vi } from "vitest";

// Declare mockPush at module level
const mockPush = vi.fn();

// Top-level mock for next/navigation (must be hoisted)
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Other context mocks
vi.mock("@/context/SessionContext", () => ({
  useSession: () => ({ recheckSession: vi.fn() }),
}));
vi.mock("@/context/SettingsContext", () => ({
  useSettings: () => ({ settings: { nightMode: false } }),
}));

// Test suite
describe("SigninPage", () => {
  beforeEach(() => {
    vi.resetAllMocks(); // resets mockPush too
    mockPush.mockReset(); // explicitly reset mockPush

    // Mock fetch globally
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as any;
  });

  it("renders email and password inputs", () => {
    render(<SigninPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows alert for empty fields", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<SigninPage />);
    fireEvent.click(screen.getByText("Log In"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please enter both email and password."
      );
    });
  });

  it("shows alert for short password", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<SigninPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Log In"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Password must be at least 6 characters"
      );
    });
  });

  it("calls router.push on successful login", async () => {
    render(<SigninPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "validpassword" },
    });
    fireEvent.click(screen.getByText("Log In"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home-page");
    });
  });
});
