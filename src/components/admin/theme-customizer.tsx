import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PRESETS, loadTheme, saveTheme, applyTheme, type SiteTheme } from "@/lib/site-theme";

const FIELDS: { key: keyof Omit<SiteTheme, "name">; label: string }[] = [
  { key: "background", label: "Page background" },
  { key: "foreground", label: "Page text" },
  { key: "card", label: "Card background" },
  { key: "cardForeground", label: "Card text" },
  { key: "primary", label: "Main colour (buttons, headings)" },
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
    <Card>
      <CardHeader>
        <CardTitle>Website Colours</CardTitle>
        <CardDescription>Pick a festival theme or set your own colours. Changes preview instantly; click Save to keep them.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Label className="mb-3 block">Ready-made themes</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => update(p)}
                className={`rounded-xl border p-3 text-left transition hover:shadow-md ${theme.name === p.name ? "ring-2 ring-ring" : ""}`}
              >
                <div className="flex gap-1 mb-2">
                  {[p.primary, p.accent, p.background, p.card].map((c, i) => (
                    <span key={i} className="h-6 w-6 rounded-full border" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-sm font-medium">{p.name}</span>
              </button>
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

        <div className="rounded-xl p-6 bg-background text-foreground border">
          <p className="text-sm mb-3">Preview</p>
          <div className="rounded-xl p-4 bg-card text-card-foreground shadow">
            <h4 className="font-bold text-primary">Sample property card</h4>
            <p className="text-sm opacity-80">2 BHK in Bandra, Mumbai</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Main button</Button>
              <span className="rounded-full px-3 py-1 text-xs bg-accent text-accent-foreground">Highlight</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => { saveTheme(theme); toast.success("Website colours saved"); }}>Save colours</Button>
          <Button variant="outline" onClick={() => { saveTheme(null); setTheme(PRESETS[0]); toast.success("Reset to original colours"); }}>Reset to original</Button>
        </div>
      </CardContent>
    </Card>
  );
}
