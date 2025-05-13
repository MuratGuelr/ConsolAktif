import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

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

  console.log(`Trying to fetch news with tag: "${tag}", cache ID: ${docId}`);

  // CollectAPI'nin desteklediği ve alternatif olabilecek tüm etiketler
  const supportedTags = {
    // Ana kategoriler
    general: ["general", "news"],
    technology: ["technology", "tech"],
    economy: ["economy", "finance", "business"],
    sport: ["sport", "sports", "game", "games", "entertainment"],
  };

  // Etiket için alternatif etiketler tespit et
  const alternativeTags = supportedTags[tag] || [tag];

  // Firebase'de kayıtlı veri varsa dön
  if (snap.exists()) {
    const cachedArticles = snap.data().articles;
    console.log(
      `Found ${cachedArticles.length} cached articles for tag "${tag}"`
    );
    // Eğer cache boşsa ve alternatif tag varsa dene
    if (cachedArticles.length === 0 && alternativeTags.length > 1) {
      console.log(`Cache for "${tag}" is empty, will try alternative tags`);
      // Cache yok sayılacak, API'den devam edilecek
    } else {
      return cachedArticles;
    }
  }

  // Firebase'de yoksa API'den çek
  // Birkaç sayfa veriyi tek seferde çekmek için
  const allArticles = [];

  try {
    console.log(
      `No cache found or cache empty for tag "${tag}", fetching from API...`
    );

    // Daha fazla sayfa veri getir
    const pagesToFetch = 10; // 10 sayfa veri çekelim

    for (let i = 0; i < pagesToFetch; i++) {
      const url = `${API_URL}?country=${country}&tag=${tag}&paging=${i}`;
      console.log(`Fetching page ${i} from API with URL: ${url}`);

      const res = await fetch(url, {
        headers: {
          "content-type": "application/json",
          authorization: API_KEY,
        },
      });

      if (!res.ok) {
        console.error(`API error (${res.status}): ${res.statusText}`);
        throw new Error(
          `API'den haberler alınamadı (sayfa ${i}, status: ${res.status})`
        );
      }

      const data = await res.json();

      console.log(`API response for "${tag}", page ${i}:`, {
        success: data.success,
        resultCount: data.result?.length || 0,
      });

      if (!data.success)
        throw new Error(
          `API başarısız döndü (sayfa ${i}): ${
            data.message || "Bilinmeyen hata"
          }`
        );

      // Her sayfadan gelen geçerli resimli haberleri birleştir
      if (data.result && data.result.length) {
        // Sadece geçerli resim URL'si olan haberleri filtrele
        const validArticles = data.result.filter((article) =>
          isValidImageUrl(article.image)
        );

        console.log(
          `Page ${i}: Found ${data.result.length} articles, ${validArticles.length} with valid images`
        );

        allArticles.push(...validArticles);
      } else {
        // Boş sayfa gelirse daha fazla veri olmadığı anlaşılır, döngüden çık
        console.log(`Page ${i} is empty, stopping pagination`);
        break;
      }

      // Haber sayısı 50'yi geçtiyse yeterli
      if (allArticles.length >= 50) {
        console.log(
          `Collected ${allArticles.length} articles, stopping at page ${i}`
        );
        break;
      }
    }

    console.log(`Total articles collected for "${tag}": ${allArticles.length}`);

    // Sonuç bulunamadıysa, alternatif tag denensin mi?
    if (allArticles.length === 0 && alternativeTags.length > 1) {
      // İlk etiket (mevcut etiket) dışındaki alternatif etiketleri bul
      const otherAlternatives = alternativeTags.filter((t) => t !== tag);

      if (otherAlternatives.length > 0) {
        const nextTag = otherAlternatives[0]; // İlk alternatifi seç

        console.log(
          `No news found with tag "${tag}", trying alternative tag "${nextTag}" automatically`
        );

        // Alternatif tag ile yeniden deneme (rekursif çağrı)
        // NOT: Sonsuz döngü riski var, ama alternativeTags içinden mevcut tag'i filtrelediğimiz için
        // ve her seferinde farklı bir tag kullandığımız için bu risk minimumdur
        return getAllNews({ tag: nextTag, country });
      }
    }

    // Firebase'e tek bir belge olarak kaydet
    if (allArticles.length > 0) {
      await setDoc(newsRef, { articles: allArticles });
      console.log(
        `Saved ${allArticles.length} articles to Firebase cache for "${tag}"`
      );
    } else {
      console.warn(
        `No articles found for tag "${tag}", not caching empty results`
      );
    }

    return allArticles;
  } catch (error) {
    console.error(`Error fetching news for tag "${tag}":`, error);
    throw error;
  }
}

// This function fetches and combines news from all categories
export async function getAllCategoriesNews() {
  try {
    console.log("Fetching news from all categories...");

    // Categories to fetch
    const categories = ["technology", "general", "economy", "sport"];
    const allNewsArticles = [];
    const todayId = getTodayId();

    // Fetch each category from Firebase cache
    for (const category of categories) {
      const docId = `${todayId}_${category}_all`;
      const newsRef = doc(collection(db, "news"), docId);
      const snap = await getDoc(newsRef);

      if (
        snap.exists() &&
        snap.data().articles &&
        snap.data().articles.length > 0
      ) {
        console.log(
          `Found ${
            snap.data().articles.length
          } cached articles for "${category}"`
        );

        // Add category field to each article for filtering
        const articlesWithCategory = snap.data().articles.map((article) => ({
          ...article,
          category,
        }));

        allNewsArticles.push(...articlesWithCategory);
      } else {
        console.log(`No cached articles found for "${category}"`);
      }
    }

    // Filter out Chip Online articles
    const articlesWithoutChip = allNewsArticles.filter(
      (article) => article.source !== "Chip Online"
    );
    console.log(
      `Filtered out Chip Online, ${articlesWithoutChip.length} articles remaining out of ${allNewsArticles.length}`
    );

    // Remove duplicates (if any) based on URL
    const uniqueArticles = [];
    const seenUrls = new Set();

    for (const article of articlesWithoutChip) {
      if (article.url && !seenUrls.has(article.url)) {
        seenUrls.add(article.url);
        uniqueArticles.push(article);
      }
    }

    console.log(`Total combined unique articles: ${uniqueArticles.length}`);

    // Sort by newest first (assuming articles already have date or can be sorted by source)
    uniqueArticles.sort((a, b) => {
      // If there's a date field, use it for sorting
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      // Otherwise, don't change order (preserve API's default ordering)
      return 0;
    });

    return uniqueArticles;
  } catch (error) {
    console.error("Error fetching combined news:", error);
    throw error;
  }
}

// Client-side paginasyon için yardımcı fonksiyon
export function getPaginatedNews(articles, page = 0, itemsPerPage = 9) {
  if (!articles || !articles.length) return [];

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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
