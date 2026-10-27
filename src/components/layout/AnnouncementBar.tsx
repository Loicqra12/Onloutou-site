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
          WhatsApp
        </a>
      </div>
    </div>
  );
}
