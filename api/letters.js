import crypto from "node:crypto";
import { db, cleanText, assertText } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Dùng POST để gửi thư." });
  }

  try {
    const text = cleanText(req.body?.text);
    assertText(text);

    const { data, error } = await db()
      .from("letters")
      .insert({ id: crypto.randomUUID(), text, status: "waiting" })
      .select("id")
      .single();

    if (error) throw error;
    return res.status(201).json({ ok: true, id: data.id });
  } catch (e) {
    console.error("send letter error", e);
    return res.status(e.status || 500).json({
      ok: false,
      error: e.status ? e.message : "Không thể gửi thư lúc này."
    });
  }
}
