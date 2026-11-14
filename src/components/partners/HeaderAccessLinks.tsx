"use client";

import Link from "next/link";
import { headerAccess } from "@/content/devenir-partenaire";
import { usePartnerSession } from "@/components/partners/usePartnerSession";

function UtilityIcon({ name }: { name: "box" | "user" }) {
  const common = {
    className: "site-header-utility-icon",
    viewBox: "0 0 24 24",
    width: 14,
    height: 14,
    "aria-hidden": true as const,
    focusable: false as const,
  };
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "box") {
    return (
      <svg {...common}>
        <path d="M3 8 12 4l9 4-9 4-9-4Z" {...s} />
        <path d="M3 8v8l9 4 9-4V8M12 12v8" {...s} />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="8" r="3.2" {...s} />
      <path d="M5 19c1.2-3.2 3.5-5 7-5s5.8 1.8 7 5" {...s} />
    </svg>
  );
}

export function HeaderAccessLinks({
  variant,
  onNavigate,
}: {
  variant: "utility" | "mobile";
  onNavigate?: () => void;
}) {
  const { loggedIn, ready } = usePartnerSession();
  const second = ready && loggedIn ? headerAccess.space : headerAccess.login;

  if (variant === "utility") {
    return (
      <>
        <span className="site-header-utility-sep site-header-utility-sep--partner" aria-hidden="true" />
        <nav className="site-header-utility-partner" aria-label="Accès partenaire">
          <Link href={headerAccess.become.href} className="site-header-utility-link" onClick={onNavigate}>
            <UtilityIcon name="box" />
            <span className="site-header-utility-label site-header-utility-label--rent">{headerAccess.become.label}</span>
          </Link>
          <span className="site-header-utility-sep" aria-hidden="true" />
          <Link href={second.href} className="site-header-utility-link" onClick={onNavigate}>
            <UtilityIcon name="user" />
            <span className="site-header-utility-label site-header-utility-label--login">{second.label}</span>
          </Link>
        </nav>
      </>
    );
  }

  return (
    <>
      <li>
        <Link href={headerAccess.become.href} className="site-mobile-link" onClick={onNavigate}>
          {headerAccess.become.label}
        </Link>
      </li>
      <li>
        <Link href={second.href} className="site-mobile-link" onClick={onNavigate}>
          {second.label}
        </Link>
      </li>
    </>
  );
}
