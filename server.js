import express from "express";
import cors from "cors";
import ytDlp from "yt-dlp-exec";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*" }));

// Video bilgilerini almak için endpoint
app.get("/info", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).json({ error: "YouTube URL'si gerekli." });
    }

    // Bellek kullanımını azaltmak için gereksiz çıktıları kaldırdık.
    const output = await ytDlp(videoUrl, ["--dump-json"]);

    const formats = output.formats.map(({ format_note, ext, url }) => ({
      quality: format_note || "Audio",
      ext,
      url,
    }));

    res.json({
      title: output.title,
      thumbnail: output.thumbnail,
      formats,
    });
  } catch (error) {
    console.error("Error fetching video info:", error.message);
    res.status(500).json({ error: "Video bilgileri alınamadı." });
  }
});

// Video indirmek için endpoint
app.get("/download", (req, res) => {
  try {
    const formatUrl = req.query.formatUrl;
    if (!formatUrl) {
      return res.status(400).json({ error: "İndirme URL'si gerekli." });
    }

    // RAM tüketimini azaltmak için doğrudan yönlendirme yapıyoruz.
    res.redirect(formatUrl);
  } catch (error) {
    console.error("Error downloading video:", error.message);
    res.status(500).json({ error: "Video indirilemedi." });
  }
});

// Sunucuyu başlat
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
