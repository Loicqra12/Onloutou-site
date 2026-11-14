"use client";

import { useCallback, useEffect, useState } from "react";
import { apiEnabled, apiFetch } from "@/lib/api/client";

export type PartnerSession = {
  id: string;
  email: string;
  role: string;
  displayName: string | null;
  emailVerified: boolean;
  phone?: string | null;
};

export function usePartnerSession() {
  const [user, setUser] = useState<PartnerSession | null>(null);
  const [mailConfigured, setMailConfigured] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!apiEnabled()) {
      setUser(null);
      setReady(true);
      return;
    }
    const res = await apiFetch<{ user: PartnerSession; mailConfigured?: boolean }>("/auth/me");
    if (res.ok) {
      setUser(res.data.user);
      setMailConfigured(Boolean(res.data.mailConfigured));
    } else {
      setUser(null);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!apiEnabled()) {
        if (!cancelled) {
          setUser(null);
          setReady(true);
        }
        return;
      }
      const res = await apiFetch<{ user: PartnerSession; mailConfigured?: boolean }>("/auth/me");
      if (cancelled) return;
      if (res.ok) {
        setUser(res.data.user);
        setMailConfigured(Boolean(res.data.mailConfigured));
      } else {
        setUser(null);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, mailConfigured, ready, refresh, loggedIn: Boolean(user) };
}

export function firstName(displayName: string | null | undefined, fallback = "partenaire"): string {
  const raw = displayName?.trim();
  if (!raw) return fallback;
  return raw.split(/\s+/)[0] ?? fallback;
}

export function initialFrom(displayName: string | null | undefined): string {
  const n = firstName(displayName, "P");
  return (n[0] ?? "P").toUpperCase();
}
