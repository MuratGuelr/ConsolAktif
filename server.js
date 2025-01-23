// api/videoInfo.js (Vercel için serverless fonksiyon)
import { exec } from "child_process";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const videoUrl = req.query.url;
      if (!videoUrl) {
        return res.status(400).json({ error: "YouTube URL'si gerekli." });
      }

      // yt-dlp komutunu çalıştırıyoruz
      exec(`yt-dlp -j ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: "Video bilgileri alınamadı." });
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).json({ error: "Video bilgileri alınamadı." });
        }

        try {
          const output = JSON.parse(stdout);

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
        } catch (parseError) {
          console.error("Error parsing video info:", parseError.message);
          res.status(500).json({ error: "Video bilgileri alınamadı." });
        }
      });
    } catch (error) {
      console.error("Error in handler:", error.message);
      res.status(500).json({ error: "Video bilgileri alınamadı." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
