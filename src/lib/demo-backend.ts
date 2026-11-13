// TEMPORARY demo backend: answers every API call in the browser so the site can be
// tested without the real server. Turn off by setting DEMO_MODE to false.
import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { dummyProperties, dummyRoommates, dummyCoupons, dummyAdvertisements, dummyStaff } from "./data";

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";

const HOME_IMG = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80",
];
const FACE_IMG = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2e?w=800&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
];

type DB = {
  properties: any[]; roommates: any[]; coupons: any[]; ads: any[]; staff: any[];
  purchases: any[]; favorites: string[]; nextId: number;
};
const KEY = "setmystay_demo_db_v2";


const CITIES: [string, string[]][] = [
  ["Navi Mumbai", ["Vashi", "Kharghar", "Nerul", "CBD Belapur", "Airoli"]],
  ["Mumbai", ["Andheri West", "Bandra", "Powai", "Malad", "Lower Parel"]],
  ["Pune", ["Kothrud", "Baner", "Hinjewadi", "Viman Nagar"]],
  ["Bengaluru", ["Koramangala", "HSR Layout", "Indiranagar", "Whitefield"]],
  ["Thane", ["Ghodbunder Road", "Majiwada"]],
];
const OWNERS = ["Anil Desai", "Priya Nair", "Sanjay Kulkarni", "Meera Iyer", "Farhan Shaikh", "Kavita Joshi", "Rakesh Patil", "Neha Kapoor"];
const AMEN = ["WiFi", "AC", "Parking", "Lift", "Power Backup", "Gym", "Security", "Meals", "Laundry", "Housekeeping", "Balcony", "Swimming Pool"];
const FURN = ["Furnished", "Semi-Furnished", "Unfurnished"];
const TITLES: Record<string, string[]> = {
  PG: ["Girls PG with Meals", "Boys PG near Metro", "Co-living Studio", "Premium Twin-Sharing PG", "Executive Single Room PG"],
  RENTAL: ["Spacious 2BHK with Balcony", "Sea-facing 1BHK", "Modern 3BHK in Gated Society", "Cozy 1RK for Students", "Duplex 4BHK with Terrace"],
  ROOMMATE: ["Room in Shared 2BHK", "Private Room in 3BHK Flat", "Shared Room near IT Park"],
};
const PEOPLE = [
  ["Aarav Mehta", "Male", 24, "Software engineer, early riser, loves cooking on weekends."],
  ["Isha Reddy", "Female", 26, "UX designer who keeps things tidy and enjoys quiet evenings."],
  ["Kabir Singh", "Male", 29, "Finance analyst, gym regular, looking for a calm flatmate."],
  ["Ananya Rao", "Female", 23, "Post-grad student, vegetarian, plant lover."],
  ["Rohan Verma", "Male", 27, "Product manager, travels often, very easy-going."],
  ["Sneha Kulkarni", "Female", 25, "Doctor on rotating shifts, values cleanliness."],
  ["Vikram Iyer", "Male", 31, "Musician and teacher, friendly and respectful of space."],
  ["Tanya Bhatia", "Female", 28, "Marketing lead, foodie, open to pets."],
];
const PREFS = ["Non-Smoker", "Vegetarian", "Clean", "Early Riser", "Night Owl", "Pet Friendly", "Working Professional", "Student", "No Parties"];
const pick = <T,>(a: T[], i: number) => a[i % a.length];

function generated(start: number) {
  const props: any[] = []; let id = start;
  const types = ["PG", "RENTAL", "ROOMMATE"];
  for (let i = 0; i < 27; i++) {
    const t = types[i % 3]; const [city, areas] = pick(CITIES, i); const area = pick(areas, i * 3 + 1);
    const rent = t === "PG" ? 7000 + (i * 1300) % 12000 : t === "RENTAL" ? 15000 + (i * 4700) % 60000 : 9000 + (i * 1900) % 14000;
    const status = i % 9 === 4 ? "PENDING" : i % 13 === 7 ? "REJECTED" : "APPROVED";
    props.push({
      id: ++id, property_type: t, title: pick(TITLES[t], i), rent, sq_ft: 180 + (i * 137) % 1400, city, area,
      address: `${100 + i}, ${pick(["Sai Heights", "Green Valley", "Lake View", "Sunrise Towers", "Orchid Residency"], i)}, ${area}, ${city}`,
      owner_name: pick(OWNERS, i), phone_primary: `+9198${String(20000000 + i * 734821).slice(0, 8)}`,
      description: `Well-maintained ${pick(TITLES[t], i).toLowerCase()} in ${area}. Close to public transport, markets and offices. Available for immediate move-in.`,
      furnishing: pick(FURN, i), amenities: AMEN.filter((_, k) => (k + i) % 3 !== 0).slice(0, 4 + (i % 5)).map((name) => ({ name })),
      images: [0, 1, 2, 3].map((k) => ({ image_url: HOME_IMG[(i + k) % HOME_IMG.length] })),
      owner: i % 6 === 0 ? "demo-user" : `owner-${i}`, is_broker: i % 5 === 0,
      created_at: new Date(Date.now() - (i + 2) * 43200000).toISOString(), status,
    });
  }
  const mates = PEOPLE.map(([name, gender, age, bio], i) => {
    const [city, areas] = pick(CITIES, i + 1);
    return {
      id: ++id, user_name: name, gender, age, bio, city, location_preference: pick(areas, i),
      budget: 8000 + (i * 2500) % 18000, phone_primary: `+9197${String(30000000 + i * 913457).slice(0, 8)}`,
      preferences: PREFS.filter((_, k) => (k + i) % 3 === 0).slice(0, 4), has_property: i % 2 === 0,
      user: 200 + i, created_at: new Date(Date.now() - i * 72000000).toISOString(),
      status: i === 5 ? "PENDING" : "APPROVED", image: FACE_IMG[i % FACE_IMG.length],
    };
  });
  return { props, mates, next: id };
}

function seedPurchases() {
  const plans: [string, number][] = [["Basic Unlock", 99], ["Premium Plan", 299], ["Unlimited Plan", 599], ["Property Listing Fee", 499]];
  return Array.from({ length: 14 }, (_, i) => ({
    id: String(5000 + i), user_name: pick(["Aarav Mehta", "Isha Reddy", "Kabir Singh", "Tanya Bhatia", "Demo User"], i),
    user_email: `user${i}@example.com`, plan_name: pick(plans, i)[0], amount: String(pick(plans, i)[1]),
    razorpay_payment_id: `pay_demo${100000 + i * 7919}`, created_at: new Date(Date.now() - i * 26 * 3600000).toISOString(), status: "SUCCESS",
  }));
}

function seed(): DB {
  const typeMap: Record<string, string> = { PG: "PG", Rental: "RENTAL", Roommate: "ROOMMATE" };
  const properties = dummyProperties.map((p, i) => ({
    id: i + 1, property_type: typeMap[p.propertyType] ?? "PG", title: p.title, rent: p.rent,
    sq_ft: p.area, city: p.city, area: p.locality, address: p.completeAddress,
    owner_name: p.ownerName, phone_primary: p.contactPhonePrimary, description: p.description,
    furnishing: p.furnishedStatus, amenities: (p.amenities || []).map((name) => ({ name })),
    images: [0, 1, 2].map((k) => ({ image_url: HOME_IMG[(i + k) % HOME_IMG.length] })),
    owner: "demo-user", is_broker: p.brokerStatus === "With Broker",
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    status: i === dummyProperties.length - 1 ? "PENDING" : "APPROVED",
  }));
  const roommates = dummyRoommates.map((r, i) => ({
    id: i + 1, user_name: r.ownerName, budget: r.rent, location_preference: r.locality,
    phone_primary: r.contactPhonePrimary, is_smoker: false, has_pets: i % 2 === 1, user: i + 100,
    created_at: new Date(Date.now() - i * 86400000).toISOString(), status: "APPROVED",
    image: FACE_IMG[i % FACE_IMG.length],
  }));
  const g = generated(100);
  return {
    properties: [...properties, ...g.props], roommates: [...roommates.map((r, i) => ({ ...r, has_property: i % 2 === 0 })), ...g.mates],
    coupons: dummyCoupons.map((c: any, i) => ({ id: i + 1, code: c.code, discount_percentage: c.discountPercentage, is_active: c.isActive })),
    ads: dummyAdvertisements.map((a: any, i) => ({ ...a, id: i + 1, is_active: a.isActive })),
    staff: dummyStaff.map((s: any, i) => ({ id: i + 1, first_name: s.name, username: s.userId, approved_count: 4 + i, rejected_count: i, avg_processing_hours: 3 + i })),
    purchases: seedPurchases(), favorites: [], nextId: g.next + 1000,
  };
}

let cache: DB | null = null;
function db(): DB {
  if (cache) return cache;
  try { const raw = localStorage.getItem(KEY); cache = raw ? JSON.parse(raw) : seed(); } catch { cache = seed(); }
  return cache!;
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* full */ } }

function parseBody(data: unknown): Record<string, any> {
  if (!data) return {};
  if (typeof FormData !== "undefined" && data instanceof FormData) {
    const o: Record<string, any> = {}; const imgs: string[] = [];
    data.forEach((v, k) => {
      if (typeof v !== "string") { if (v.type?.startsWith("image/")) imgs.push(URL.createObjectURL(v)); }
      else o[k] = v;
    });
    o.__images = imgs; return o;
  }
  if (typeof data === "string") { try { return JSON.parse(data); } catch { return {}; } }
  return data as Record<string, any>;
}

function handle(method: string, url: string, body: Record<string, any>): [number, any] {
  const d = db();
  const [path, qs] = url.split("?");
  const q = new URLSearchParams(qs || "");
  const p = path.replace(/^https?:\/\/[^/]+/, "").replace(/^\/api/, "").replace(/\/+$/, "") + "/";
  const m = (re: RegExp) => p.match(re);
  let r: RegExpMatchArray | null;

  if (p === "/auth/login/" || p === "/auth/refresh/")
    return [200, { access: "demo-access-token", refresh: "demo-refresh-token" }];
  if (p === "/users/google-login/" || p === "/users/complete-profile/")
    return [200, { access: "demo-access-token", refresh: "demo-refresh-token", is_profile_complete: true, first_name: "Demo" }];

  if (p === "/properties/" && method === "get") {
    let list = d.properties;
    if (q.get("property_type")) list = list.filter((x) => x.property_type === q.get("property_type"));
    if (q.get("admin") !== "true") list = list.filter((x) => x.status === "APPROVED");
    return [200, list];
  }
  if (p === "/properties/" && method === "post") {
    const imgs: string[] = body.__images?.length ? body.__images : [HOME_IMG[d.nextId % HOME_IMG.length]];
    const item = {
      id: ++d.nextId, property_type: (body.property_type || "PG").toUpperCase(), title: body.title || "New listing",
      rent: Number(body.rent) || 0, sq_ft: Number(body.sq_ft) || 0, city: body.city || "", area: body.area || "",
      address: body.address || "", owner_name: body.owner_name || localStorage.getItem("user_name") || "You",
      phone_primary: body.phone_primary || "", description: body.description || "", furnishing: body.furnishing || "Unfurnished",
      amenities: String(body.amenities || "").split(",").map((s) => s.replace(/[\[\]"]/g, "").trim()).filter(Boolean).map((name) => ({ name })),
      images: imgs.map((image_url) => ({ image_url })), owner: "demo-user", is_broker: body.is_broker === "true",
      created_at: new Date().toISOString(), status: "PENDING",
    };
    d.properties.unshift(item); save(); return [201, item];
  }
  if (p === "/my-properties/") return [200, d.properties.filter((x) => x.owner === "demo-user")];
  if ((r = m(/^\/properties\/(\d+)\/update_status\/$/))) {
    const it = d.properties.find((x) => String(x.id) === r![1]); if (it) it.status = body.status; save(); return [200, it ?? {}];
  }
  if ((r = m(/^\/properties\/(\d+)\/toggle_favorite\/$/))) {
    const id = r[1]; d.favorites = d.favorites.includes(id) ? d.favorites.filter((f) => f !== id) : [...d.favorites, id];
    save(); return [200, { is_favorite: d.favorites.includes(id) }];
  }
  if ((r = m(/^\/properties\/(\d+)\/$/)) && method === "delete") {
    d.properties = d.properties.filter((x) => String(x.id) !== r![1]); save(); return [204, {}];
  }

  const crud = (key: "roommates" | "coupons" | "ads" | "staff", base: string): [number, any] | null => {
    if (p === base) {
      if (method === "get") return [200, d[key]];
      if (method === "post") { const it = { id: ++d.nextId, approved_count: 0, rejected_count: 0, avg_processing_hours: 0, ...body }; delete (it as any).__images;
        if (body.__images?.length) (it as any).image = body.__images[0]; d[key].unshift(it); save(); return [201, it]; }
    }
    const mm = p.match(new RegExp("^" + base + "(\\d+)/$"));
    if (mm) {
      const i = d[key].findIndex((x: any) => String(x.id) === mm[1]);
      if (method === "delete") { if (i >= 0) d[key].splice(i, 1); save(); return [204, {}]; }
      if (i >= 0) { const b = { ...body }; delete b.__images; Object.assign(d[key][i], b); save(); return [200, d[key][i]]; }
    }
    return null;
  };
  const res = crud("roommates", "/roommates/") || crud("coupons", "/coupons/") || crud("ads", "/advertisements/") || crud("staff", "/staff/");
  if (res) return res;

  if (p === "/payments/create-order/")
    return [200, { order_id: `order_demo_${Date.now()}`, amount: Math.round(Number(body.amount || 0) * 100), currency: "INR", razorpay_key: "demo" }];
  if (p.startsWith("/payments/verify")) {
    d.purchases.unshift({
      id: String(++d.nextId), user_name: localStorage.getItem("user_name") || "Demo User", user_email: "demo@setmystay.com",
      plan_name: body.plan_name || "Purchase", amount: String(body.amount ?? ""), razorpay_payment_id: body.razorpay_payment_id || "",
      created_at: new Date().toISOString(), status: "SUCCESS",
    }); save(); return [200, { status: "ok" }];
  }
  if (p === "/payments/my-history/") return [200, d.purchases.filter((x) => x.user_name === "Demo User" || x.user_name === localStorage.getItem("user_name"))];
  if (p === "/payments/all-history/") return [200, d.purchases];

  return [200, {}];
}

export const demoAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  await new Promise((res) => setTimeout(res, 250));
  const [status, data] = handle((config.method || "get").toLowerCase(), config.url || "", parseBody(config.data));
  return { data, status, statusText: "OK", headers: {}, config, request: {} };
};

/** Wipe test data back to the starting set. */
export function resetDemoData() { cache = seed(); save(); }

/** Fake Razorpay checkout so payments can be tested end to end. */
export function installDemoRazorpay() {
  if (!DEMO_MODE || typeof window === "undefined") return;
  (window as any).Razorpay = function (options: any) {
    const failHandlers: ((r: any) => void)[] = [];
    return {
      on: (ev: string, cb: (r: any) => void) => { if (ev === "payment.failed") failHandlers.push(cb); },
      open: () => {
        const amt = ((options.amount || 0) / 100).toLocaleString("en-IN");
        const ok = window.confirm(`Test payment (no real money)\n\n${options.description || "SetMyStay"} — ₹${amt}\n\nPress OK to pay, Cancel to decline.`);
        setTimeout(() => {
          if (ok) options.handler?.({ razorpay_payment_id: `pay_demo_${Date.now()}`, razorpay_order_id: options.order_id, razorpay_signature: "demo" });
          else { failHandlers.forEach((cb) => cb({ error: { description: "Payment cancelled." } })); options.modal?.ondismiss?.(); }
        }, 50);
      },
    };
  };
}
