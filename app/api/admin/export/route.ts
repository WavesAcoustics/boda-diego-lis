import { NextResponse } from "next/server";
import { requireAdminRoute } from "@/lib/auth-route";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  const auth = await requireAdminRoute();
  if ("error" in auth) return auth.error;

  const [{ data: guests }, { data: contributions }] = await Promise.all([
    auth.supabase.from("guests").select("*").order("created_at", { ascending: false }),
    auth.supabase
      .from("contributions")
      .select("*, gifts(name)")
      .order("created_at", { ascending: false })
  ]);

  const rows = [
    ["type", "name", "email", "status", "amount_mxn", "gift", "companions", "message_or_notes", "created_at"],
    ...(guests || []).map((guest) => [
      "rsvp",
      guest.name,
      "",
      guest.will_attend ? "attending" : "not_attending",
      "",
      "",
      guest.companions,
      guest.dietary_restrictions || "",
      guest.created_at
    ]),
    ...(contributions || []).map((item) => [
      "contribution",
      item.contributor_name,
      item.contributor_email,
      item.status,
      Number(item.amount) / 100,
      item.gifts?.name || "",
      "",
      item.message || "",
      item.created_at
    ])
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="diego-lis-export.csv"'
    }
  });
}
