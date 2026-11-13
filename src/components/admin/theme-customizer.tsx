import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEMO_MODE, resetDemoData } from "@/lib/demo-backend";
import { PRESETS, loadTheme, saveTheme, applyTheme, type SiteTheme } from "@/lib/site-theme";

const FIELDS: { key: keyof Omit<SiteTheme, "name">; label: string }[] = [
  { key: "background", label: "Feature tag background" },
  { key: "foreground", label: "Feature tag text" },
  { key: "card", label: "Card background" },
  { key: "cardForeground", label: "Card text" },
  { key: "primary", label: "Card heading and price" },
  { key: "primaryForeground", label: "Text on main colour" },
  { key: "accent", label: "Highlight colour" },
  { key: "accentForeground", label: "Text on highlight" },
];

export function ThemeCustomizer() {
  const [theme, setTheme] = useState<SiteTheme>(PRESETS[0]);

  useEffect(() => {
    const saved = loadTheme();
    if (saved) setTheme(saved);
  }, []);

  const update = (t: SiteTheme) => {
    setTheme(t);
    applyTheme(t); // live preview
  };

  return (
    <section className="space-y-6">
      <CardHeader>
        <CardTitle>Property Card Colours</CardTitle>
        <CardDescription>Festival palettes for property listings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label className="mb-3 block">Ready-made themes</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <Button
                variant="outline"
                key={p.name}
                type="button"
                onClick={() => update(p)}
                className={`h-auto flex-col items-start rounded-lg border p-3 text-left ${theme.name === p.name ? "ring-2 ring-ring" : ""}`}
              >
                <div className="flex gap-1 mb-2">
                  {[p.primary, p.accent, p.background, p.card].map((c, i) => (
                    <span key={i} className="h-6 w-6 rounded-full border" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-sm font-medium">{p.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Custom colours</Label>
          <div className="grid sm:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <label key={f.key} className="flex items-center gap-3 rounded-lg border p-2">
                <input
                  type="color"
                  value={theme[f.key]}
                  onChange={(e) => update({ ...theme, name: "Custom", [f.key]: e.target.value })}
                  className="h-9 w-12 cursor-pointer rounded bg-transparent"
                />
                <span className="text-sm">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm mb-3">Preview</p>
          <div className="property-theme max-w-sm rounded-lg border p-5 bg-card text-card-foreground">
            <h4 className="font-bold text-primary">Sample property card</h4>
            <p className="text-sm text-muted-foreground">2 BHK in Bandra, Mumbai</p>
            <div className="mt-3 flex gap-2">
              <span className="font-semibold text-primary">₹28,000 / month</span>
              <span className="rounded-full px-3 py-1 text-xs bg-accent text-accent-foreground">Highlight</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => { saveTheme(theme); toast.success("Property card colours saved"); }}>Save colours</Button>
          <Button variant="outline" onClick={() => { saveTheme(null); setTheme(PRESETS[0]); toast.success("Reset to original colours"); }}>Reset to original</Button>
        </div>
      </CardContent>
    </section>
  );
}

export function DemoDataCard() {
  if (!DEMO_MODE) return null;
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Test data</CardTitle>
        <CardDescription>The site is running on sample listings, roommates and payments. Reset them to start fresh.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => { resetDemoData(); toast.success("Test data reset"); setTimeout(() => window.location.reload(), 600); }}>Reset test data</Button>
      </CardContent>
    </Card>
  );
}
