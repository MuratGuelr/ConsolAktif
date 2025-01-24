export async function handler(event) {
  try {
    const formatUrl = event.queryStringParameters.formatUrl;
    if (!formatUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "İndirme URL'si gerekli." }),
      };
    }

    return {
      statusCode: 302,
      headers: {
        Location: formatUrl,
      },
    };
  } catch (error) {
    console.error("Error downloading video:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Video indirilemedi." }),
    };
  }
}
