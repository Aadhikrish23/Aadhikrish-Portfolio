import { createContext, useContext } from "react";
import type { SiteSettings } from "../types/settings.types";
import { siteDefaults } from "../config/siteDefaults";

export const SiteSettingsContext = createContext<SiteSettings>(siteDefaults);

// Public-site content (hero, about, contact, brand), editable in the admin panel.
export const useSiteSettings = () => useContext(SiteSettingsContext);
