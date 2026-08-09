import crypto from "node:crypto";
import { db, cleanText, assertText } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const parentId = String(req.query?.id || "").trim();
    if (!parentId) return res.status(400).json({ ok: false, error: "Thiếu mã lá thư." });

    const text = cleanText(req.body?.text ?? req.body?.reply);
    assertText(text);

    const { data, error } = await db().rpc("reply_to_letter", {
      p_parent_id: parentId,
      p_text: text,
      p_new_id: crypto.randomUUID()
    });

    if (error) throw error;
    if (!data?.[0]) {
      return res.status(409).json({ ok: false, error: "Lá thư này không còn chờ hồi đáp." });
    }

    return res.status(201).json({ ok: true, id: data[0].id });
  } catch (e) {
    console.error("reply_to_letter error", e);
    return res.status(e.status || 500).json({
      ok: false,
      error: e.status ? e.message : "Không thể hồi đáp lúc này."
    });
  }
}
