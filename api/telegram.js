// api/telegram.js — положи в КОРЕНЬ проекта (не в src/)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Bot credentials not configured" });
  }

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
      },
    );
    const data = await response.json();
    if (!response.ok || !data.ok) {
      return res
        .status(502)
        .json({ error: data.description || "Telegram error" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Network error: " + err.message });
  }
}
