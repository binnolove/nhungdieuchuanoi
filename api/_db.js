
import { createClient } from "@supabase/supabase-js";

export function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY.");
  return createClient(url, key, { auth: { persistSession: false } });
}

export function cleanText(value) {
  return typeof value === "string"
    ? value.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim()
    : "";
}

export function assertText(text) {
  if (!text || text.length > 4000) {
    const e = new Error("Lá thư cần có nội dung và không vượt quá 4.000 ký tự.");
    e.status = 400;
    throw e;
  }
}
