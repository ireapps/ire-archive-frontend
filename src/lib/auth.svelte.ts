/**
 * Authentication state management using Svelte 5 runes.
 *
 * ARCHITECTURE IMPROVEMENTS:
 * - Lazy singleton prevents SSR/build-time instantiation issues
 * - Distinguishes network failures from invalid sessions
 * - Debounces visibility-based re-checks (5min threshold)
 * - Surfaces logout failures to user
 * - Single source of truth for auth state
 */

import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { API_BASE_URL } from "$lib/config";

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActiveMember: boolean;
  sessionExpiresIn: number;
}

export type AuthErrorType = "network" | "invalid" | "logout_failed";

/**
 * Auth state class using Svelte 5 runes for reactivity.
 */
export class AuthState {
  user = $state<User | null>(null);
  isLoading = $state(true);
  error = $state<string | null>(null);
  errorType = $state<AuthErrorType | null>(null);
  lastCheckTime = $state<number>(0);

  // Derived reactive state
  isAuthenticated = $derived(this.user !== null);

  // Check if we should re-verify (5 minute threshold to prevent spam)
  shouldRecheck = $derived(Date.now() - this.lastCheckTime > 5 * 60 * 1000);

  /**
   * Check session validity with backend.
   *
   * CALLED BY: Root layout on mount and visibility change (if shouldRecheck)
   * NOT CALLED BY: Individual page components
   */
  async checkSession(): Promise<boolean> {
    if (!browser) {
      this.isLoading = false;
      return false;
    }

    this.isLoading = true;
    this.error = null;
    this.errorType = null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include", // CRITICAL: Send session cookie
      });

      this.lastCheckTime = Date.now(); // Update timestamp

      if (response.ok) {
        const data = await response.json();
        this.user = {
          userId: data.user_id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          fullName: data.full_name,
          isActiveMember: data.is_active_member,
          sessionExpiresIn: data.session_expires_in,
        };
        this.isLoading = false;
        return true;
      }

      // Not authenticated (401/403)
      this.user = null;
      this.errorType = "invalid";
      this.isLoading = false;
      return false;
    } catch (_err) {
      // Network failure - API unreachable
      this.user = null;
      this.error =
        "Cannot reach authentication server. Please check your connection.";
      this.errorType = "network";
      this.isLoading = false;
      return false;
    }
  }

  /**
   * Initiate login by redirecting to MemberSuite.
   */
  async login(returnTo: string = "/"): Promise<void> {
    if (!browser) return;

    this.isLoading = true;
    this.error = null;
    this.errorType = null;

    try {
      // Construct the login URL with the returnTo parameter
      const loginUrl = new URL(`${API_BASE_URL}/auth/login`);
      loginUrl.searchParams.set("returnTo", returnTo);

      // Turn on the isLoading while we wait for the login response
      this.isLoading = true;

      // Send the login request to the backend
      const response = await fetch(loginUrl.toString(), {
        credentials: "include",
      });

      // Check if the response was not OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to initiate login");
      }

      // Parse the response JSON to get the redirect URL
      const { redirect_url } = await response.json();

      // Redirect the user to the login page provided by the backend
      window.location.href = redirect_url;
    } catch (err) {
      // Turn off the isLoading in case of error
      this.isLoading = false;
      // Handle network or other errors during login
      this.error = err instanceof Error ? err.message : "Login failed";
      this.errorType = "network";
      this.isLoading = false; // CRITICAL: Reset loading state on error
    }
  }

  /**
   * End session and redirect to login page.
   *
   * IMPORTANT: Surfaces logout failures instead of silently ignoring them.
   * This prevents the security issue where user thinks they logged out but
   * session persists (critical for shared computers).
   */
  async logout(): Promise<void> {
    if (!browser) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout request failed");
      }

      // Success - clear state and redirect
      this.user = null;
      this.error = null;
      this.errorType = null;
      goto("/login");
    } catch (_err) {
      // IMPORTANT: Don't silently ignore logout failures
      this.error =
        "Failed to log out. Your session may still be active on the server.";
      this.errorType = "logout_failed";

      // Still clear local state (user appears logged out locally)
      this.user = null;

      // Show error but don't prevent navigation
      // User can close browser/clear cookies as fallback
      goto("/login");
    }
  }

  /**
   * Clear error state.
   */
  clearError(): void {
    this.error = null;
    this.errorType = null;
  }
}

// Lazy singleton pattern - only instantiate in browser context
let _authInstance: AuthState | null = null;

/**
 * Get the auth singleton instance.
 * Lazy initialization prevents build-time/SSR instantiation issues.
 */
export function getAuth(): AuthState {
  if (!browser) {
    // Should never happen since we only import in browser context
    throw new Error("Auth can only be accessed in browser context");
  }

  if (!_authInstance) {
    _authInstance = new AuthState();
  }

  return _authInstance;
}

// Export singleton for convenience
// IMPORTANT: Use getAuth() to ensure we return the SAME instance
// (not a separate instance created at module load time)
export const auth = browser ? getAuth() : (null as unknown as AuthState);
