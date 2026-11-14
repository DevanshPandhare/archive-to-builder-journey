import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, feeFor, recordSwipe, saveSettings, swipesLeft } from "@/lib/app-settings";

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
  it("charges a different fee per listing type", () => {
    saveSettings({ swipeLimit: 25, fees: { RENTAL: 600, PG: 300, ROOMMATE: 100 } });
    expect(feeFor("Rental")).toBe(600);
    expect(feeFor("PG")).toBe(300);
    expect(feeFor("ROOMMATE")).toBe(100);
  });
});
