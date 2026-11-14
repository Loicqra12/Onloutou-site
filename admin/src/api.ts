const API_BASE = "/api/v1";

export type SessionUser = {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
};

export function isStaffRole(role: string) {
  return role === "ADMIN" || role === "STAFF";
}

let csrfTokenCache: string | null = null;

function isCsrfError(status: number, error: string): boolean {
  if (status !== 403 && status !== 400) return false;
  return /csrf|jeton/i.test(error);
}

async function fetchCsrfToken(): Promise<string> {
  if (csrfTokenCache) return csrfTokenCache;
  const res = await fetch(`${API_BASE}/csrf`, { credentials: "include" });
  if (!res.ok) throw new Error("csrf");
  const data = (await res.json()) as { csrfToken: string };
  csrfTokenCache = data.csrfToken;
  return data.csrfToken;
}

function networkErrorMessage(err: unknown): string {
  if (err instanceof TypeError && (err.message === "Failed to fetch" || err.message.includes("fetch"))) {
    return "Connexion impossible pour le moment. Vérifiez votre réseau puis réessayez.";
  }
  return "Connexion interrompue. Réessayez dans un instant.";
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
  retried = false,
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  try {
    const headers = new Headers(init.headers);
    if (init.json !== undefined) {
      headers.set("Content-Type", "application/json");
    }
    if (init.method && !["GET", "HEAD", "OPTIONS"].includes(init.method)) {
      try {
        headers.set("x-csrf-token", await fetchCsrfToken());
      } catch {
        csrfTokenCache = null;
        return { ok: false, status: 0, error: networkErrorMessage(new TypeError("Failed to fetch")) };
      }
    }
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: "include",
      headers,
      body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
    });
    if (res.status === 204) {
      if (path.includes("/auth/logout")) csrfTokenCache = null;
      return { ok: true, data: undefined as T };
    }
    const payload = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      const error = payload.error ?? "Erreur réseau.";
      csrfTokenCache = null;
      if (!retried && isCsrfError(res.status, error)) {
        return apiFetch<T>(path, init, true);
      }
      return { ok: false, status: res.status, error };
    }
    if (path.includes("/auth/logout")) csrfTokenCache = null;
    return { ok: true, data: payload as T };
  } catch (err) {
    csrfTokenCache = null;
    return { ok: false, status: 0, error: networkErrorMessage(err) };
  }
}

export async function fetchMe() {
  return apiFetch<{ user: SessionUser }>("/auth/me");
}

export type LoginResponse = {
  user?: SessionUser;
  twoFactorRequired?: boolean;
  challengeToken?: string;
};

export async function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    json: { email, password },
  });
}

export async function verifyTwoFactor(challengeToken: string, code: string) {
  return apiFetch<{ user: SessionUser }>("/auth/login/2fa", {
    method: "POST",
    json: { challengeToken, code },
  });
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ ok: true; sent: boolean; message: string }>("/auth/password/request", {
    method: "POST",
    json: { email },
  });
}

export async function confirmPasswordReset(token: string, password: string) {
  return apiFetch<{ ok: true }>("/auth/password/confirm", {
    method: "POST",
    json: { token, password },
  });
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}
