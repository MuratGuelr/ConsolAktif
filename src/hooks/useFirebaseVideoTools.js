// src/hooks/useFirebaseVideoTools.js
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  startAfter,
} from "firebase/firestore";

/**
 * Hook to fetch video editing software and plugins data from Firebase
 * With realtime updates and CRUD operations
 *
 * @param {string} searchQuery - Search query
 * @param {string} category - Filter by category (software, plugin, free, paid, etc.)
 * @param {Object} options - Additional options for sorting and pagination
 * @returns {Object} { data, loading, error, addTool, updateTool, deleteTool }
 */
export const useFirebaseVideoTools = (
  searchQuery = "",
  category = "all",
  options = {}
) => {
  const [data, setData] = useState({ total_count: 0, items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Build the query
    let baseQuery = collection(db, "videoEditingTools");
    let queryConstraints = [];

    // Apply category filters
    if (category && category !== "all") {
      if (category === "free") {
        queryConstraints.push(where("price", "==", 0));
      } else if (category === "paid") {
        queryConstraints.push(where("price", ">", 0));
      } else if (["software", "plugin", "preset"].includes(category)) {
        queryConstraints.push(where("category", "==", category));
      } else if (
        category === "davinci-resolve" ||
        category === "premiere-pro"
      ) {
        // For compatibility filtering, we'll use a client-side filter since Firestore
        // doesn't easily support array-contains with multiple values
        // Note: For a production app, consider using a different data structure
      }
    }

    // Apply sorting
    if (options.sort) {
      if (options.sort === "rating") {
        queryConstraints.push(orderBy("rating", "desc"));
      } else if (options.sort === "name") {
        queryConstraints.push(orderBy("name"));
      } else if (options.sort === "price") {
        queryConstraints.push(orderBy("price"));
      }
    } else {
      // Default sort
      queryConstraints.push(orderBy("rating", "desc"));
    }

    // Apply pagination
    if (options.limit) {
      queryConstraints.push(limit(options.limit));
    }

    // If there's a last document and we're paginating
    if (lastDoc && options.paginate) {
      queryConstraints.push(startAfter(lastDoc));
    }

    const firestoreQuery = query(baseQuery, ...queryConstraints);

    // Setup realtime listener
    const unsubscribe = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        try {
          // Get documents
          let items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Set last document for pagination
          if (items.length > 0) {
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
          }

          // Client-side filtering for search and special category filters
          if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            items = items.filter(
              (item) =>
                item.name?.toLowerCase().includes(lowerQuery) ||
                item.description?.toLowerCase().includes(lowerQuery) ||
                item.tags?.some((tag) =>
                  tag.toLowerCase().includes(lowerQuery)
                ) ||
                (item.features &&
                  item.features.some((feature) =>
                    feature.toLowerCase().includes(lowerQuery)
                  ))
            );
          }

          // Handle special category filters
          if (category === "davinci-resolve") {
            items = items.filter(
              (item) =>
                item.id === "davinci-resolve" ||
                (item.compatibleWith &&
                  item.compatibleWith.includes("davinci-resolve"))
            );
          } else if (category === "premiere-pro") {
            items = items.filter(
              (item) =>
                item.id === "adobe-premiere-pro" ||
                (item.compatibleWith &&
                  item.compatibleWith.includes("adobe-premiere-pro"))
            );
          }

          setData({
            total_count: items.length,
            items,
          });
          setError(null);
        } catch (err) {
          setError("Veri çekme hatası: " + (err.message || "Bilinmeyen hata"));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Firebase hatası: " + err.message);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe from the listener when component unmounts
    return () => unsubscribe();
  }, [searchQuery, category, options.sort, options.limit, options.paginate]);

  // Function to add a new tool
  const addTool = async (toolData) => {
    try {
      const docRef = await addDoc(
        collection(db, "videoEditingTools"),
        toolData
      );
      return { id: docRef.id, ...toolData };
    } catch (err) {
      setError("Ekleme hatası: " + err.message);
      throw err;
    }
  };

  // Function to update a tool
  const updateTool = async (id, toolData) => {
    try {
      const docRef = doc(db, "videoEditingTools", id);
      await updateDoc(docRef, toolData);
      return { id, ...toolData };
    } catch (err) {
      setError("Güncelleme hatası: " + err.message);
      throw err;
    }
  };

  // Function to delete a tool
  const deleteTool = async (id) => {
    try {
      await deleteDoc(doc(db, "videoEditingTools", id));
      return id;
    } catch (err) {
      setError("Silme hatası: " + err.message);
      throw err;
    }
  };

  // Function to load more items (pagination)
  const loadMore = () => {
    if (lastDoc) {
      return useFirebaseVideoTools(searchQuery, category, {
        ...options,
        paginate: true,
      });
    }
    return null;
  };

  return {
    data,
    loading,
    error,
    addTool,
    updateTool,
    deleteTool,
    loadMore,
  };
};

export default useFirebaseVideoTools;
