import express from "express";
import cors from "cors";
import ytDlp from "yt-dlp-exec"; // Default export ile import ediyoruz.

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Video bilgilerini almak için endpoint
app.get("/info", async (req, res) => {
  try {
    const videoUrl = req.query.url;

    if (!videoUrl) {
      return res.status(400).json({ error: "YouTube URL'si gerekli." });
    }

    // yt-dlp kullanarak video bilgilerini alıyoruz.
    const output = await ytDlp(videoUrl, {
      dumpSingleJson: true,
      format: "best",
    });

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
  } catch (error) {
    console.error("Error fetching video info:", error.message);
    res.status(500).json({ error: "Video bilgileri alınamadı." });
  }
});

// Video indirmek için endpoint
app.get("/download", async (req, res) => {
  try {
    const formatUrl = req.query.formatUrl;

    if (!formatUrl) {
      return res.status(400).json({ error: "İndirme URL'si gerekli." });
    }

    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.setHeader("Content-Type", "video/mp4");

    const downloadProcess = ytDlp(formatUrl, {
      stdio: ["ignore", "pipe", "ignore"],
    });
    downloadProcess.stdout.pipe(res);
  } catch (error) {
    console.error("Error downloading video:", error.message);
    res.status(500).json({ error: "Video indirilemedi." });
  }
});

// Sunucuyu başlat
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://:${PORT}`);
});

export default app;
