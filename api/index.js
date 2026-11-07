import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN);

const referrals = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("MAWZZ REFERRAL BOT ACTIVE");
  }

  try {
    const update = req.body;

    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || "";

      if (text.startsWith("/start")) {
        await bot.sendMessage(chatId,
          "🚀 MAWZZ REFERRAL BOT\n\n" +
          "Perintah:\n" +
          "/referral LINK - Simpan referral\n" +
          "/list - Lihat referral\n" +
          "/stats - Statistik"
        );
      }

      else if (text.startsWith("/referral")) {
        const link = text.split(/\s+/)[1];

        if (!link || !/^https:\/\/t\.me\/[a-zA-Z0-9_]+\?start=[a-zA-Z0-9_-]+$/.test(link)) {
          await bot.sendMessage(chatId,
            "Format:\n/referral https://t.me/NamaBot?start=KODE"
          );
        } else {
          const list = referrals.get(chatId) || [];
          list.push({
            link,
            date: new Date().toISOString()
          });
          referrals.set(chatId, list);

          await bot.sendMessage(chatId,
            "✅ Link referral berhasil disimpan!\n\n" + link
          );
        }
      }

      else if (text === "/list") {
        const list = referrals.get(chatId) || [];

        await bot.sendMessage(chatId,
          list.length
            ? list.map((r, i) => `${i + 1}. ${r.link}`).join("\n")
            : "Belum ada referral."
        );
      }

      else if (text === "/stats") {
        const list = referrals.get(chatId) || [];
        await bot.sendMessage(chatId,
          `📊 Total link tersimpan: ${list.length}`
        );
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(200).json({ ok: true });
  }
}
