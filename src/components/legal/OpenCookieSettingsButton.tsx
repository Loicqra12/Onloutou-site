"use client";

export function OpenCookieSettingsButton() {
  return (
    <button
      type="button"
      className="leg-cookie-btn"
      onClick={() => window.dispatchEvent(new Event("onloutou-open-cookies"))}
    >
      Gérer mes cookies
    </button>
  );
}
