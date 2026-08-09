import { db } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const { error } = await db().from("letters").select("id").limit(1);
    if (error) throw error;
    return res.status(200).json({ ok: true, service: "nhung-dieu-chua-noi", version: "v5-serverless" });
  } catch (e) {
    console.error("health error", e);
    return res.status(500).json({ ok: false, error: "Database chưa được kết nối." });
  }
}
