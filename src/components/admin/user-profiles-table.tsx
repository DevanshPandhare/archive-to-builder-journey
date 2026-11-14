import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/api";
import { loadProfiles, type UserProfile } from "@/lib/app-settings";

export function UserProfilesTable() {
  const [rows, setRows] = useState<UserProfile[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const local = loadProfiles();
    setRows(local);
    api.get("/users/").then((res) => {
      const data = Array.isArray(res.data) ? res.data : res.data?.results;
      if (!Array.isArray(data)) return;
      const remote: UserProfile[] = data.map((u: any) => ({
        name: u.first_name || u.name || u.username || "",
        phone: u.phone_number || u.phone || "",
        email: u.email || "",
        address: u.address || "",
        submittedAt: u.date_joined || u.created_at || "",
      }));
      const seen = new Set<string>();
      setRows([...local, ...remote].filter((r) => {
        const k = (r.email || r.phone).toLowerCase();
        if (!k || seen.has(k)) return false; seen.add(k); return true;
      }));
    }).catch(() => {});
  }, []);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? rows.filter((r) => [r.name, r.phone, r.email, r.address].some((v) => v?.toLowerCase().includes(s))) : rows;
  }, [rows, q]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>Details users entered in the welcome form.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Search name, phone, email or address" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Email</TableHead><TableHead>Address</TableHead><TableHead>Submitted</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {shown.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No user details yet.</TableCell></TableRow>
              ) : shown.map((r, i) => (
                <TableRow key={r.email + i}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.phone}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell className="max-w-xs">{r.address}</TableCell>
                  <TableCell>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
