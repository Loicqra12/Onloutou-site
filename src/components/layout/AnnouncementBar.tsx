import { headerUtility } from "@/content/header-navigation";

export function AnnouncementBar() {
  return (
    <div className="site-header-utility">
      <div className="site-header-utility-inner">
        <span className="site-header-utility-location">{headerUtility.location}</span>
        <a
          href={headerUtility.whatsappUrl}
          className="site-header-utility-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{headerUtility.whatsappLabel}</span>
          <span aria-hidden>↗</span>
          <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
        </a>
      </div>
    </div>
  );
}
