import { headerUtility } from "@/content/header-navigation";
import { HeaderAccessLinks } from "@/components/partners/HeaderAccessLinks";

function PinIcon() {
  return (
    <svg className="site-header-utility-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="site-header-utility-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 5.3 5.3l1.4-2.2L19 14.5V18a2 2 0 0 1-2 2A13 13 0 0 1 3 6a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="site-header-utility-icon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
      />
      <path
        fill="currentColor"
        d="M9.2 7.8c.2-.4.5-.4.8-.4h.4c.2 0 .4.1.5.4l.8 1.8c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .4a6 6 0 0 0 2.6 2.4c.2.1.4 0 .5-.1l.7-.8c.1-.2.3-.2.5-.1l1.7.8c.2.1.3.3.3.5 0 .9-.8 1.7-1.7 1.8-3 .3-7-2.9-7.4-6.2-.1-.6.1-1.2.4-1.7Z"
      />
    </svg>
  );
}

export function AnnouncementBar() {
  return (
    <div className="site-header-utility">
      <div className="site-header-utility-inner">
        <span className="site-header-utility-location">
          <PinIcon />
          <span>{headerUtility.location}</span>
        </span>
        <div className="site-header-utility-actions">
          <a href={headerUtility.phoneHref} className="site-header-utility-link site-header-utility-phone">
            <PhoneIcon />
            <span className="site-header-utility-label site-header-utility-label--phone">{headerUtility.phoneDisplay}</span>
          </a>
          <span className="site-header-utility-sep" aria-hidden="true" />
          <a
            href={headerUtility.whatsappUrl}
            className="site-header-utility-link site-header-utility-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
            <span className="site-header-utility-label site-header-utility-label--whatsapp">{headerUtility.whatsappLabel}</span>
            <span aria-hidden>↗</span>
            <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
          </a>
          <HeaderAccessLinks variant="utility" />
        </div>
      </div>
    </div>
  );
}