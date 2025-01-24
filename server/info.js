import ytDlp from "yt-dlp-exec";

export async function handler(event) {
  try {
    const videoUrl = event.queryStringParameters.url;
    if (!videoUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "YouTube URL'si gerekli." }),
      };
    }

    const output = await ytDlp(videoUrl, ["--dump-json"]);

    const formats = output.formats.map(({ format_note, ext, url }) => ({
      quality: format_note || "Audio",
      ext,
      url,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: output.title,
        thumbnail: output.thumbnail,
        formats,
      }),
    };
  } catch (error) {
    console.error("Error fetching video info:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Video bilgileri alınamadı." }),
    };
  }
}
