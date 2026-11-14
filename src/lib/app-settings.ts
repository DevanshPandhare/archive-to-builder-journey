import { defaultPricing } from "@/lib/data";

export type ListingKind = "RENTAL" | "PG" | "ROOMMATE";
export type AppSettings = { swipeLimit: number };

export const DEFAULT_SETTINGS: AppSettings = { swipeLimit: 25 };
const KEY = "setmystay_app_settings";
const SWIPES_KEY = "setmystay_swipes";
const PRICING_KEY = "pricing";

export function loadSettings(): AppSettings {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return DEFAULT_SETTINGS;
    const p = JSON.parse(raw);
    return { swipeLimit: Number(p.swipeLimit) || DEFAULT_SETTINGS.swipeLimit };
  } catch { return DEFAULT_SETTINGS; }
}
export function saveSettings(s: AppSettings) { localStorage.setItem(KEY, JSON.stringify(s)); }

export function normalizeKind(t: string | undefined | null): ListingKind {
  const v = String(t || "").toUpperCase();
  if (v === "PG") return "PG";
  if (v === "ROOMMATE") return "ROOMMATE";
  return "RENTAL";
}
/** Listing fee comes from Admin → Management → Pricing (Listing Plans). */
export function feeFor(type: string | undefined | null): number {
  let listings = defaultPricing.listings;
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(PRICING_KEY) : null;
    if (raw) listings = { ...listings, ...(JSON.parse(raw).listings || {}) };
  } catch { /* ignore */ }
  const k = normalizeKind(type);
  return Number(k === "PG" ? listings.pg : k === "ROOMMATE" ? listings.roommate : listings.rental);
}

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

export type UserProfile = { name: string; phone: string; email: string; address: string; submittedAt: string };
const PROFILES_KEY = "setmystay_user_profiles";
export function loadProfiles(): UserProfile[] {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]"); } catch { return []; }
}
export function addProfile(p: Omit<UserProfile, "submittedAt">) {
  const list = loadProfiles().filter((x) => x.email.toLowerCase() !== p.email.toLowerCase());
  list.unshift({ ...p, submittedAt: new Date().toISOString() });
  localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
}
