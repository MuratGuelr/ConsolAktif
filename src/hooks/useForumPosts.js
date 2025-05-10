import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  getDoc,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
  waitForPendingWrites,
} from "firebase/firestore";
import { toast } from "react-toastify";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_MAILS;

const useForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState("online");
  const [categories, setCategories] = useState([
    "Hardware",
    "Software",
    "Network",
    "Security",
    "Cloud",
    "Mobile",
    "Other",
  ]);

  // Check if user is admin
  const isAdmin = auth.currentUser?.email === ADMIN_EMAIL;

  // Handle network errors
  const handleNetworkError = async (err) => {
    console.error("Firebase network error:", err);

    // Check for specific network-related error codes
    if (
      err.code === "failed-precondition" ||
      err.code === "unavailable" ||
      err.code === "resource-exhausted" ||
      err.code === "network-request-failed"
    ) {
      setNetworkStatus("offline");

      // Try to reconnect
      try {
        // Wait for pending writes to complete
        await waitForPendingWrites(db);

        // Disable and re-enable network to force reconnection
        await disableNetwork(db);
        await enableNetwork(db);

        setNetworkStatus("online");

        console.log("Successfully reconnected to Firebase");
      } catch (reconnectErr) {
        console.error("Failed to reconnect:", reconnectErr);
      }
    }

    return err;
  };

  // Fetch all posts
  const fetchPosts = async (
    sortBy = "createdAt",
    sortOrder = "desc",
    filterCategory = null,
    searchTerm = ""
  ) => {
    try {
      setLoading(true);
      setError(null);

      let postsQuery = query(
        collection(db, "forumPosts"),
        orderBy(sortBy, sortOrder)
      );

      if (filterCategory) {
        postsQuery = query(
          collection(db, "forumPosts"),
          where("category", "==", filterCategory),
          orderBy(sortBy, sortOrder)
        );
      }

      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      // Apply search filter if provided
      const filteredPosts = searchTerm
        ? postsData.filter(
            (post) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              post.shortDescription
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              post.description.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : postsData;

      setPosts(filteredPosts);
      setNetworkStatus("online"); // Update network status on successful fetch
      setLoading(false);
    } catch (err) {
      const handledError = await handleNetworkError(err);
      setError(handledError.message);
      setLoading(false);
      toast.error(`Çözümler yüklenemedi: ${handledError.message}`);
    }
  };

  // Get a single post by ID
  const getPostById = async (postId) => {
    try {
      setError(null);
      const postDoc = await getDoc(doc(db, "forumPosts", postId));
      if (postDoc.exists()) {
        return {
          id: postDoc.id,
          ...postDoc.data(),
          createdAt: postDoc.data().createdAt?.toDate() || new Date(),
        };
      } else {
        throw new Error("Çözüm bulunamadı");
      }
    } catch (err) {
      const handledError = await handleNetworkError(err);
      setError(handledError.message);
      toast.error(`Çözüm yüklenemedi: ${handledError.message}`);
      return null;
    }
  };

  // Add a new post
  const addPost = async (postData) => {
    try {
      setError(null);
      if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
        throw new Error("Sadece admin çözüm ekleyebilir");
      }

      const newPost = {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: auth.currentUser.email,
        comments: [],
      };

      const docRef = await addDoc(collection(db, "forumPosts"), newPost);
      toast.success("Çözüm başarıyla eklendi");

      // Refresh posts list
      fetchPosts();
      return docRef.id;
    } catch (err) {
      const handledError = await handleNetworkError(err);
      setError(handledError.message);
      toast.error(`Çözüm eklenemedi: ${handledError.message}`);
      return null;
    }
  };

  // Update an existing post
  const updatePost = async (postId, updatedData) => {
    try {
      setError(null);
      if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
        throw new Error("Sadece admin çözümleri güncelleyebilir");
      }

      const postRef = doc(db, "forumPosts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Çözüm bulunamadı");
      }

      await updateDoc(postRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });

      toast.success("Çözüm başarıyla güncellendi");
      fetchPosts();
      return true;
    } catch (err) {
      const handledError = await handleNetworkError(err);
      setError(handledError.message);
      toast.error(`Çözüm güncellenemedi: ${handledError.message}`);
      return false;
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    try {
      setError(null);
      if (!auth.currentUser || auth.currentUser.email !== ADMIN_EMAIL) {
        throw new Error("Sadece admin çözümleri silebilir");
      }

      const postRef = doc(db, "forumPosts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Çözüm bulunamadı");
      }

      await deleteDoc(postRef);
      toast.success("Çözüm başarıyla silindi");
      fetchPosts();
      return true;
    } catch (err) {
      const handledError = await handleNetworkError(err);
      setError(handledError.message);
      toast.error(`Çözüm silinemedi: ${handledError.message}`);
      return false;
    }
  };

  // Add a comment to a post
  const addComment = async (postId, commentText) => {
    try {
      setError(null);
      if (!auth.currentUser) {
        throw new Error("Yorum yapabilmek için giriş yapmalısınız");
      }

      const postRef = doc(db, "forumPosts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Çözüm bulunamadı");
      }

      const currentComments = postSnap.data().comments || [];
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        createdAt: new Date(),
        createdBy: auth.currentUser.email,
        userDisplayName: auth.currentUser.displayName || auth.currentUser.email,
      };

      await updateDoc(postRef, {
        comments: [...currentComments, newComment],
      });

      toast.success("Yorum eklendi");
      return true;
    } catch (err) {
      const handledError = await handleNetworkError(err);
      setError(handledError.message);
      toast.error(`Yorum eklenemedi: ${handledError.message}`);
      return false;
    }
  };

  // Delete a comment
  const deleteComment = async (postId, commentId) => {
    try {
      setError(null);
      const postRef = doc(db, "forumPosts", postId);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Çözüm bulunamadı");
      }

      const currentComments = postSnap.data().comments || [];
      const commentToDelete = currentComments.find((c) => c.id === commentId);

      if (!commentToDelete) {
        throw new Error("Yorum bulunamadı");
      }

      // Only admin or comment author can delete
      if (
        auth.currentUser.email !== ADMIN_EMAIL &&
        auth.currentUser.email !== commentToDelete.createdBy
      ) {
        throw new Error("Bu yorumu silme yetkiniz yok");
      }

      const updatedComments = currentComments.filter((c) => c.id !== commentId);

      await updateDoc(postRef, {
        comments: updatedComments,
      });

      toast.success("Yorum silindi");
      return true;
    } catch (err) {
      const handledError = await handleNetworkError(err);
      setError(handledError.message);
      toast.error(`Yorum silinemedi: ${handledError.message}`);
      return false;
    }
  };

  // Check connection status
  const checkConnection = async () => {
    try {
      // Try to get a document to test connection
      await getDoc(doc(db, "connection_test", "test"));
      setNetworkStatus("online");
      return true;
    } catch (err) {
      await handleNetworkError(err);
      return false;
    }
  };

  // Check network status on mount and set up periodic checks
  useEffect(() => {
    // Initial fetch
    fetchPosts();

    // Set up periodic connection check
    const connectionCheckInterval = setInterval(() => {
      if (networkStatus === "offline") {
        checkConnection();
      }
    }, 10000); // Check every 10 seconds if offline

    return () => {
      clearInterval(connectionCheckInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    posts,
    loading,
    error,
    categories,
    networkStatus,
    fetchPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost,
    addComment,
    deleteComment,
    checkConnection,
    isAdmin,
  };
};

export default useForumPosts;
