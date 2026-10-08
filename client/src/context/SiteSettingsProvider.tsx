import settingsApi from "../APIServices/settings.api";
import { siteDefaults } from "../config/siteDefaults";
import { useServerData } from "../hooks/useServerData";
import type { SiteSettings } from "../types/settings.types";
import { SiteSettingsContext } from "./siteSettings.context";

// Per-group merge: anything the server omits falls back to the shipped defaults,
// while an empty string saved in the admin panel stays empty (e.g. a hidden link).
const merge = (saved?: Partial<SiteSettings>): SiteSettings => ({
  siteName: saved?.siteName ?? siteDefaults.siteName,
  ownerName: saved?.ownerName ?? siteDefaults.ownerName,
  hero: { ...siteDefaults.hero, ...saved?.hero },
  about: { ...siteDefaults.about, ...saved?.about },
  contact: { ...siteDefaults.contact, ...saved?.contact },
});

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { data } = useServerData(async () => {
    const res = await settingsApi.getSettings();
    return res.data;
  });

  return (
    <SiteSettingsContext.Provider value={merge(data)}>{children}</SiteSettingsContext.Provider>
  );
}
