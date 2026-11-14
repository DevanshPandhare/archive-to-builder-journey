export type ListingKind = "RENTAL" | "PG" | "ROOMMATE";
export type AppSettings = { swipeLimit: number; fees: Record<ListingKind, number> };

export const DEFAULT_SETTINGS: AppSettings = { swipeLimit: 25, fees: { RENTAL: 499, PG: 399, ROOMMATE: 199 } };
const KEY = "setmystay_app_settings";
const SWIPES_KEY = "setmystay_swipes";

export function loadSettings(): AppSettings {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return DEFAULT_SETTINGS;
    const p = JSON.parse(raw);
    return { swipeLimit: Number(p.swipeLimit) || DEFAULT_SETTINGS.swipeLimit, fees: { ...DEFAULT_SETTINGS.fees, ...(p.fees || {}) } };
  } catch { return DEFAULT_SETTINGS; }
}
export function saveSettings(s: AppSettings) { localStorage.setItem(KEY, JSON.stringify(s)); }

export function normalizeKind(t: string | undefined | null): ListingKind {
  const v = String(t || "").toUpperCase();
  if (v === "PG") return "PG";
  if (v === "ROOMMATE") return "ROOMMATE";
  return "RENTAL";
}
export function feeFor(type: string | undefined | null, s: AppSettings = loadSettings()) { return s.fees[normalizeKind(type)]; }

function accountKey() {
  return (typeof localStorage !== "undefined" && (localStorage.getItem("user_email") || localStorage.getItem("user_name"))) || "guest";
}
export function getSwipeCount(): number {
  try { return JSON.parse(localStorage.getItem(SWIPES_KEY) || "{}")[accountKey()] || 0; } catch { return 0; }
}
export function recordSwipe() {
  let all: Record<string, number> = {};
  try { all = JSON.parse(localStorage.getItem(SWIPES_KEY) || "{}"); } catch { /* ignore */ }
  const k = accountKey(); all[k] = (all[k] || 0) + 1;
  localStorage.setItem(SWIPES_KEY, JSON.stringify(all));
  return all[k];
}
export function swipesLeft(limit = loadSettings().swipeLimit) { return Math.max(0, limit - getSwipeCount()); }
