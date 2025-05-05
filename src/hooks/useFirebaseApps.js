// hooks/useFirebaseApps.js
import { useState, useEffect, useRef, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit as firestoreLimit, // 'limit' is a reserved keyword
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getFirestore, // Firestore instance'ı almak için
  Timestamp, // Timestamp kullanmak için
} from "firebase/firestore";
import { db } from "../firebase/firebase"; // Firebase config dosyanızın yolu

/**
 * Firebase Firestore'dan uygulama verilerini çekmek, filtrelemek,
 * sıralamak ve yönetmek için özel hook.
 *
 * @param {string} searchQuery - Arama sorgusu (istemci tarafında filtrelenir).
 * @param {string} category - Kategoriye göre filtreleme (Firestore sorgusu).
 * @param {Object} options - Ekstra seçenekler { sort: string, limit?: number }.
 * @returns {Object} { data, loading, error, addApp, updateApp, deleteApp }
 */
export const useFirebaseApps = (
  searchQuery = "",
  category = "",
  options = {}
) => {
  const [data, setData] = useState({ items: [], total_count: 0 }); // Veri yapısını başlangıçta tanımla
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parametrelerin önceki değerlerini tutmak için ref.
  // Bu, gereksiz yere listener'ı yeniden bağlamayı önlemeye yardımcı olabilir,
  // ancak ana kontrol useEffect'in bağımlılık dizisindedir.
  const prevParams = useRef({ searchQuery, category, options });

  // Firestore collection referansı
  const appsCollectionRef = collection(db, "apps"); // 'apps' koleksiyonunuzun adı

  // Değişkenleri (deps) useCallback ile sarmalayarak gereksiz render'ları önle
  const sortOption = options.sort || "popularity"; // Varsayılan sıralama
  const limitOption = options.limit; // Limit opsiyonel

  useEffect(() => {
    console.log("useFirebaseApps Effect Triggered:", {
      searchQuery,
      category,
      sortOption,
      limitOption,
    });
    setLoading(true);
    setError(null); // Yeni sorgu başlarken hatayı temizle

    // Firestore sorgusunu oluşturma
    let q = query(appsCollectionRef); // Temel sorgu

    // 1. Kategoriye Göre Filtreleme (varsa)
    if (category) {
      q = query(q, where("category", "==", category));
    }

    // 2. Sıralama
    // Firestore'da sıralama yaparken, eşitlik filtresi uygulanan alandan
    // farklı bir alana göre sıralama yapıyorsanız index gerekebilir.
    // createdAt için 'desc' (en yeni) veya 'asc' (en eski)
    // popularity için 'desc' (en popüler)
    // name için 'asc' (A-Z)
    let orderByField = "popularity";
    let orderByDirection = "desc";

    if (sortOption === "name") {
      orderByField = "name";
      orderByDirection = "asc";
    } else if (sortOption === "recent") {
      // Firestore'da genellikle Timestamp türünde bir 'createdAt' alanı olur
      orderByField = "createdAt";
      orderByDirection = "desc";
    } else {
      // Varsayılan 'popularity'
      orderByField = "popularity";
      orderByDirection = "desc";
    }
    // Eğer 'createdAt' alanı Timestamp değilse veya yoksa, bu satırı kaldırın veya düzenleyin.
    // Firestore'da sıralama yaparken null/undefined değerler sorun yaratabilir.
    q = query(q, orderBy(orderByField, orderByDirection));

    // 3. Limit (varsa)
    if (limitOption > 0) {
      q = query(q, firestoreLimit(limitOption));
    }

    // onSnapshot ile gerçek zamanlı dinleyiciyi bağla
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          // Döküman verisini ve ID'sini al
          results.push({ id: doc.id, ...doc.data() });
        });

        // İstemci Tarafında Arama Filtrelemesi (Firebase'in temel sorguları yetersizse)
        // Büyük veri setlerinde performansı etkileyebilir.
        // Daha iyi performans için Algolia gibi 3. parti servisler düşünülebilir.
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase().trim();
          results = results.filter(
            (app) =>
              (app.name && app.name.toLowerCase().includes(lowerQuery)) ||
              (app.publisher &&
                app.publisher.toLowerCase().includes(lowerQuery)) ||
              (app.description &&
                app.description.toLowerCase().includes(lowerQuery)) ||
              (app.wingetId &&
                app.wingetId.toLowerCase().includes(lowerQuery)) ||
              (app.tags &&
                app.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
          );
        }

        // Veriyi state'e yaz
        setData({
          items: results,
          total_count: results.length, // İstemci tarafı filtrelemeden sonraki sayı
          // Not: Firestore'dan dönen toplam belge sayısını almak (limit olmadan)
          // genellikle ayrı bir 'count' sorgusu gerektirir.
          // Şimdilik filtrelenmiş sonuç sayısını gösteriyoruz.
        });
        setLoading(false);
        setError(null); // Başarılı olunca hatayı temizle
        console.log("Data fetched/updated:", results.length);
      },
      (err) => {
        // Hata durumunda
        console.error("Firebase onSnapshot error:", err);
        setError(`Veri alınırken hata: ${err.message}`);
        setData({ items: [], total_count: 0 }); // Hata durumunda veriyi sıfırla
        setLoading(false);
      }
    );

    // Component unmount edildiğinde veya bağımlılıklar değiştiğinde
    // dinleyiciyi sonlandır (unsubscribe)
    return () => {
      console.log("Unsubscribing Firebase listener");
      unsubscribe();
    };

    // useEffect bağımlılıkları: Bu değerler değiştiğinde effect yeniden çalışır.
  }, [searchQuery, category, sortOption, limitOption]); // appsCollectionRef genellikle değişmez, eklemeye gerek yok

  // ----- CRUD Fonksiyonları -----

  // Yeni uygulama ekleme
  const addApp = useCallback(
    async (appData) => {
      try {
        // createdAt ve updatedAt alanlarını ekleyelim (Timestamp olarak)
        const dataToAdd = {
          ...appData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        const docRef = await addDoc(appsCollectionRef, dataToAdd);
        console.log("App added with ID:", docRef.id);
        return docRef.id; // Başarılı olursa ID'yi döndür
      } catch (err) {
        console.error("Error adding document: ", err);
        // Hata mesajını daha kullanıcı dostu hale getirebilirsiniz
        throw new Error(`Uygulama eklenirken hata oluştu: ${err.message}`);
      }
    },
    [appsCollectionRef]
  ); // appsCollectionRef değişmeyeceği için boş bağımlılık

  // Uygulama güncelleme
  const updateApp = useCallback(
    async (appId, appData) => {
      if (!appId) {
        throw new Error("Güncelleme için Uygulama ID'si gerekli.");
      }
      const appDocRef = doc(db, "apps", appId); // Güncellenecek dökümanın referansı
      try {
        // updatedAt alanını güncelleyelim
        const dataToUpdate = {
          ...appData,
          updatedAt: Timestamp.now(),
        };
        // createdAt alanını güncellememek daha mantıklı olabilir
        delete dataToUpdate.createdAt; // Varolan createdAt'ı koru

        await updateDoc(appDocRef, dataToUpdate);
        console.log("App updated with ID:", appId);
      } catch (err) {
        console.error("Error updating document: ", err);
        throw new Error(`Uygulama güncellenirken hata oluştu: ${err.message}`);
      }
    },
    [db]
  ); // db değişmeyeceği için bağımlılık

  // Uygulama silme
  const deleteApp = useCallback(
    async (appId) => {
      if (!appId) {
        throw new Error("Silme için Uygulama ID'si gerekli.");
      }
      const appDocRef = doc(db, "apps", appId); // Silinecek dökümanın referansı
      try {
        await deleteDoc(appDocRef);
        console.log("App deleted with ID:", appId);
      } catch (err) {
        console.error("Error deleting document: ", err);
        throw new Error(`Uygulama silinirken hata oluştu: ${err.message}`);
      }
    },
    [db]
  ); // db değişmeyeceği için bağımlılık

  // Hook'un döndürdüğü değerler
  return { data, loading, error, addApp, updateApp, deleteApp };
};
