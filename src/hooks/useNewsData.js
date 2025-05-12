import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // Assuming db is exported from here
import { getAllNews } from "../data/newsService"; // Adjust path if needed

const FETCH_HOURS = [8, 12, 18, 21]; // Allowed fetch hours

// Helper function to get the start Date of the latest applicable time slot for today
const getLatestSlotStartTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  let latestApplicableHour = -1;

  // Find the latest fetch hour that has passed or is current
  for (let i = FETCH_HOURS.length - 1; i >= 0; i--) {
    if (currentHour >= FETCH_HOURS[i]) {
      latestApplicableHour = FETCH_HOURS[i];
      break;
    }
  }

  // If before the first slot today, the cache must be from today's first slot or later to be valid
  // (Simplification: We only check if cache is from *today* after the latest slot started)
  if (latestApplicableHour === -1) {
    // Treat as needing data from the first slot (e.g., 8:00) today.
    // A cache from yesterday is invalid for today's first view before 8:00.
    const startOfToday = new Date();
    startOfToday.setHours(FETCH_HOURS[0], 0, 0, 0); // Target 8:00 today
    return startOfToday;
  }

  const slotStartTime = new Date();
  slotStartTime.setHours(latestApplicableHour, 0, 0, 0);
  return slotStartTime;
};

export function useNewsData(tag) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tag) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const cacheDocRef = doc(db, "newsCache", tag);
      const latestSlotStartTime = getLatestSlotStartTime();

      try {
        // 1. Check Firestore Cache
        const docSnap = await getDoc(cacheDocRef);

        if (docSnap.exists()) {
          const cacheData = docSnap.data();
          const cacheTimestamp =
            cacheData.timestamp instanceof Timestamp
              ? cacheData.timestamp.toDate()
              : new Date(0); // Handle case where timestamp might not be Firestore Timestamp

          // Check if cache is valid for the current time slot today
          // Cache must exist, have articles, and be from today's latest applicable slot or later
          if (cacheTimestamp >= latestSlotStartTime && cacheData.articles) {
            console.log(`Using cached news for tag: ${tag}`);
            setNews(cacheData.articles);
            setLoading(false);
            return; // Use cached data
          } else {
            console.log(`Cache outdated for tag: ${tag}. Fetching new data.`);
          }
        } else {
          console.log(`No cache found for tag: ${tag}. Fetching new data.`);
        }

        // 2. Fetch from API if cache is missing or outdated
        const fetchedArticles = await getAllNews({ tag });

        // Filter out articles from Chip Online
        const articlesWithoutChip = fetchedArticles.filter(
          (article) => article.source !== "Chip Online"
        );

        // Continue filtering for valid image URLs on the remaining articles
        const filteredArticles = articlesWithoutChip.filter(
          (article) => article.image && article.image.startsWith("http")
        );

        // 3. Update Firestore Cache
        await setDoc(cacheDocRef, {
          articles: filteredArticles,
          timestamp: serverTimestamp(), // Use server timestamp
          tag: tag,
        });
        console.log(`Fetched and cached news for tag: ${tag}`);

        setNews(filteredArticles);
      } catch (e) {
        console.error("Error fetching or caching news:", e);
        // Try to use potentially outdated cache as fallback if fetch fails?
        // Or just show error. For now, show error.
        const docSnap = await getDoc(cacheDocRef);
        if (docSnap.exists() && docSnap.data().articles) {
          console.warn(
            `API fetch failed for ${tag}, using potentially stale cache.`
          );
          setNews(docSnap.data().articles);
          setError(
            "Failed to fetch latest news, showing potentially older data. Error: " +
              e.message
          );
        } else {
          setError("Failed to fetch news: " + e.message);
          setNews([]); // Clear news on error if no cache exists
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function (optional, consider Cloud Function for robustness)
    // const cleanupOldCache = async () => {
    //   const twoDaysAgo = new Date();
    //   twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    //   const q = query(collection(db, 'newsCache'), where('timestamp', '<', Timestamp.fromDate(twoDaysAgo)));
    //   const snapshot = await getDocs(q);
    //   const batch = writeBatch(db);
    //   snapshot.forEach(doc => {
    //     console.log(`Deleting old cache for tag: ${doc.id}`);
    //     batch.delete(doc.ref);
    //   });
    //   await batch.commit();
    // };
    // Consider calling cleanupOldCache() less frequently or using a Cloud Function.
  }, [tag]); // Re-run effect when tag changes

  return { news, loading, error };
}
