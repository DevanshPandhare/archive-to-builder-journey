import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, feeFor, recordSwipe, saveSettings, swipesLeft, addProfile, loadProfiles } from "@/lib/app-settings";

describe("app settings", () => {
  beforeEach(() => localStorage.clear());
  it("allows 25 swipes per account by default", () => {
    expect(swipesLeft()).toBe(25);
    for (let i = 0; i < 25; i++) recordSwipe();
    expect(swipesLeft()).toBe(0);
  });
  it("uses admin-changed swipe limit", () => {
    saveSettings({ ...DEFAULT_SETTINGS, swipeLimit: 3 });
    recordSwipe();
    expect(swipesLeft()).toBe(2);
  });
  it("charges the Pricing Management listing fee per type", () => {
    localStorage.setItem("pricing", JSON.stringify({ unlocks: {}, listings: { rental: 600, pg: 300, roommate: 100 } }));
    expect(feeFor("Rental")).toBe(600);
    expect(feeFor("PG")).toBe(300);
    expect(feeFor("ROOMMATE")).toBe(100);
  });
  it("keeps one profile per email", () => {
    addProfile({ name: "A", phone: "9999999999", email: "a@x.com", address: "Somewhere 1" });
    addProfile({ name: "A2", phone: "9999999999", email: "A@x.com", address: "Somewhere 2" });
    expect(loadProfiles()).toHaveLength(1);
    expect(loadProfiles()[0].name).toBe("A2");
  });
});
