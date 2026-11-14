const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api/v1";

let csrfTokenCache: string | null = null;

export function apiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DISABLE_API !== "1";
}

export function clearCsrfToken() {
  csrfTokenCache = null;
}

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
    return "Connexion impossible pour le moment. Vérifiez votre réseau puis réessayez : vos informations sont conservées dans le formulaire.";
  }
  return "Connexion interrompue. Réessayez dans un instant : vos informations sont conservées dans le formulaire.";
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

export type CreateContactRequestBody = {
  source: "contact";
  need: string;
  name: string;
  phone?: string;
  email?: string;
  organisation?: string;
  zone?: string;
  deadline?: string;
  message: string;
  familyLabel?: string;
  sourcePath?: string;
  openWhatsAppAfter?: boolean;
  clientRequestId?: string;
};

export async function submitContactRequest(body: CreateContactRequestBody) {
  return apiFetch<{ ok: true; reference: string; recordedAt: string }>("/requests", {
    method: "POST",
    json: body,
  });
}
