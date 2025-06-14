import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpPage from "./page";
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

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockPush.mockReset();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
      })
    ) as any;
  });

  it("renders name, email, and password inputs", () => {
    render(<SignUpPage />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows alert for empty fields", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<SignUpPage />);
    fireEvent.click(screen.getByText("Sign Up"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Please enter name, email and password."
      );
    });
  });

  it("shows alert for short password", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<SignUpPage />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Password must be at least 6 characters"
      );
    });
  });

  it("shows alert for invalid email", async () => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<SignUpPage />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "validPass123" },
    });
    fireEvent.click(screen.getByText("Sign Up"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid email ID.");
    });
  });

  it("calls router.push on successful signup", async () => {
    render(<SignUpPage />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "validPass123" },
    });
    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home-page");
    });
  });
});
