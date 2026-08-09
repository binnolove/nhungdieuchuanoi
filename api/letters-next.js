import { db } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const { data, error } = await db().rpc("claim_next_letter");
    if (error) throw error;
    const row = data?.[0];
    if (!row) return res.status(200).json({ ok: true, found: false });
    return res.status(200).json({
      ok: true,
      found: true,
      letter: { id: row.id, text: row.text, createdAt: row.created_at }
    });
  } catch (e) {
    console.error("claim_next_letter error", e);
    return res.status(500).json({ ok: false, error: "Không thể nhận thư lúc này." });
  }
}
