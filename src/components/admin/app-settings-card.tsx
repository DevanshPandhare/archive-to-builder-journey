import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings, type ListingKind } from "@/lib/app-settings";

const FEES: { key: ListingKind; label: string }[] = [
  { key: "RENTAL", label: "Rental listing fee (₹)" },
  { key: "PG", label: "PG listing fee (₹)" },
  { key: "ROOMMATE", label: "Roommate listing fee (₹)" },
];

export function AppSettingsCard() {
  const [s, setS] = useState<AppSettings>(DEFAULT_SETTINGS);
  useEffect(() => setS(loadSettings()), []);
  const save = () => {
    if (s.swipeLimit < 1 || Object.values(s.fees).some((f) => f < 0)) return toast.error("Please enter valid numbers");
    saveSettings(s); toast.success("Settings saved");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Roommate swipe limit and listing fees. Saved in this browser until the server supports it.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="swipe-limit">Swipes per account</Label>
          <Input id="swipe-limit" type="number" min={1} value={s.swipeLimit} onChange={(e) => setS({ ...s, swipeLimit: Number(e.target.value) })} />
        </div>
        {FEES.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={`fee-${f.key}`}>{f.label}</Label>
            <Input id={`fee-${f.key}`} type="number" min={0} value={s.fees[f.key]} onChange={(e) => setS({ ...s, fees: { ...s.fees, [f.key]: Number(e.target.value) } })} />
          </div>
        ))}
        <div className="sm:col-span-2"><Button onClick={save}>Save settings</Button></div>
      </CardContent>
    </Card>
  );
}
