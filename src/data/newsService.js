import { db } from "../firebase/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const API_URL = "https://api.collectapi.com/news/getNews";
const API_KEY = import.meta.env.VITE_NEWS_API;
const ITEMS_PER_PAGE = 9; // Bir sayfada gösterilecek haber sayısı

function getTodayId() {
  const today = new Date();
  return today.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Geçersiz resim URL'lerini kontrol eden yardımcı fonksiyon
function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (!url.startsWith("http")) return false;

  // Google Analytics ve diğer izleme URL'lerini filtrele
  if (
    url.includes("google-analytics.com") ||
    url.includes("utm.gif") ||
    url.includes("__utm.gif") ||
    url.includes("pixel") ||
    url.includes("tracker")
  ) {
    return false;
  }

  return true;
}

// Tüm haberleri tek seferde çekip Firebase'e kaydeden fonksiyon
export async function getAllNews({ tag = "technology", country = "tr" } = {}) {
  const todayId = getTodayId();
  const docId = `${todayId}_${tag}_all`;
  const newsRef = doc(collection(db, "news"), docId);
  const snap = await getDoc(newsRef);

  // Firebase'de kayıtlı veri varsa dön
  if (snap.exists()) {
    return snap.data().articles;
  }

  // Firebase'de yoksa API'den çek
  // Birkaç sayfa veriyi tek seferde çekmek için
  const allArticles = [];

  try {
    // Daha fazla sayfa veri getir
    const pagesToFetch = 10; // 10 sayfa veri çekelim

    for (let i = 0; i < pagesToFetch; i++) {
      const url = `${API_URL}?country=${country}&tag=${tag}&paging=${i}`;
      const res = await fetch(url, {
        headers: {
          "content-type": "application/json",
          authorization: `apikey ${API_KEY}`,
        },
      });

      if (!res.ok) throw new Error(`API'den haberler alınamadı (sayfa ${i})`);

      const data = await res.json();

      if (!data.success) throw new Error(`API başarısız döndü (sayfa ${i})`);

      // Her sayfadan gelen geçerli resimli haberleri birleştir
      if (data.result && data.result.length) {
        // Sadece geçerli resim URL'si olan haberleri filtrele
        const validArticles = data.result.filter((article) =>
          isValidImageUrl(article.image)
        );

        allArticles.push(...validArticles);
      } else {
        // Boş sayfa gelirse daha fazla veri olmadığı anlaşılır, döngüden çık
        break;
      }

      // Haber sayısı 50'yi geçtiyse yeterli
      if (allArticles.length >= 50) break;
    }

    // Firebase'e tek bir belge olarak kaydet
    await setDoc(newsRef, { articles: allArticles });
    return allArticles;
  } catch (error) {
    console.error("Haberler çekilirken hata:", error);
    throw error;
  }
}

// Client-side paginasyon için yardımcı fonksiyon
export function getPaginatedNews(articles, page = 0) {
  if (!articles || !articles.length) return [];

  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return articles.slice(startIndex, endIndex);
}

// Eski API - geriye uyumluluk için tutalım
export async function getNews({
  tag = "technology",
  page = 0,
  country = "tr",
} = {}) {
  const allArticles = await getAllNews({ tag, country });
  return getPaginatedNews(allArticles, page);
}
