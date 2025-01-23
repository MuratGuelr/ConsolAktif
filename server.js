// api/videoInfo.js (Vercel için serverless fonksiyon)
import { exec } from "child_process";
import ytDlp from "yt-dlp";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const videoUrl = req.query.url;
      if (!videoUrl) {
        return res.status(400).json({ error: "YouTube URL'si gerekli." });
      }

      // yt-dlp komutunu çalıştırıyoruz
      ytDlp(videoUrl, { dumpSingleJson: true, format: "best" })
        .then((output) => {
          const formats = output.formats
            .filter((format) => format.format_note || format.vcodec !== "none")
            .map((format) => ({
              quality: format.format_note || "Audio Only",
              ext: format.ext,
              url: format.url,
              type: format.vcodec === "none" ? "audio" : "video",
            }));

          res.json({
            title: output.title,
            thumbnail: output.thumbnail,
            formats: formats,
          });
        })
        .catch((error) => {
          console.error("Error fetching video info:", error.message);
          res.status(500).json({ error: "Video bilgileri alınamadı." });
        });
    } catch (error) {
      console.error("Error in handler:", error.message);
      res.status(500).json({ error: "Video bilgileri alınamadı." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
