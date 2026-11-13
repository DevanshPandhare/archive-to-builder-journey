export type SiteTheme = {
  name: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
};

export const THEME_KEY = "site_theme";
export const THEME_EVENT = "site-theme-change";

export const PRESETS: SiteTheme[] = [
  { name: "Classic (Navy & Gold)", background: "#f8f5ef", foreground: "#1c2130", card: "#fdfcf9", cardForeground: "#1c2130", primary: "#232a3d", primaryForeground: "#f6f2ea", accent: "#d8a54a", accentForeground: "#1a1e2b" },
  { name: "Diwali", background: "#fff7ec", foreground: "#3a1405", card: "#fffaf2", cardForeground: "#3a1405", primary: "#b0300f", primaryForeground: "#fff4e0", accent: "#f5a400", accentForeground: "#3a1405" },
  { name: "Holi", background: "#fff5fb", foreground: "#2b1033", card: "#ffffff", cardForeground: "#2b1033", primary: "#c2187a", primaryForeground: "#fff0f8", accent: "#22b8cf", accentForeground: "#0d2a30" },
  { name: "Christmas", background: "#f6faf6", foreground: "#14261a", card: "#ffffff", cardForeground: "#14261a", primary: "#1f5b33", primaryForeground: "#f2fbf4", accent: "#c8262e", accentForeground: "#ffffff" },
  { name: "Independence Day", background: "#fffdf8", foreground: "#0b1f4a", card: "#ffffff", cardForeground: "#0b1f4a", primary: "#0b3d91", primaryForeground: "#ffffff", accent: "#ff8f1f", accentForeground: "#1a1000" },
  { name: "Eid", background: "#f4faf7", foreground: "#0f2a22", card: "#ffffff", cardForeground: "#0f2a22", primary: "#0e6b4f", primaryForeground: "#f1fbf6", accent: "#d6b04c", accentForeground: "#1f1806" },
];

const VAR_MAP: Record<keyof Omit<SiteTheme, "name">, string[]> = {
  background: ["--background"],
  foreground: ["--foreground"],
  card: ["--card", "--popover"],
  cardForeground: ["--card-foreground", "--popover-foreground"],
  primary: ["--primary", "--ring"],
  primaryForeground: ["--primary-foreground"],
  accent: ["--accent"],
  accentForeground: ["--accent-foreground"],
};

export function applyTheme(theme: SiteTheme | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const [k, vars] of Object.entries(VAR_MAP)) {
    for (const v of vars) {
      if (theme) root.style.setProperty(v, theme[k as keyof SiteTheme]);
      else root.style.removeProperty(v);
    }
  }
}

export function loadTheme(): SiteTheme | null {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw ? (JSON.parse(raw) as SiteTheme) : null;
  } catch {
    return null;
  }
}

export function saveTheme(theme: SiteTheme | null) {
  if (theme) localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  else localStorage.removeItem(THEME_KEY);
  applyTheme(theme);
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function syncSiteTheme() {
  applyTheme(loadTheme());
}
