import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useGetUser from "../../hooks/useGetUser"; // Import useGetUser hook
import CommentForm from "../../components/CommentForm/CommentForm";
import CommentList from "../../components/CommentList/CommentList";
import {
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa"; // Icons

// Helper function to convert YouTube links to embeddable format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return ""; // Return empty string or null if no URL
  let videoId = null;

  if (url.includes("/shorts/")) {
    videoId = url
      .substring(url.lastIndexOf("/shorts/") + "/shorts/".length)
      .split("?")[0];
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url
      .substring(url.lastIndexOf("youtu.be/") + "youtu.be/".length)
      .split("?")[0];
  } else if (url.includes("/embed/")) {
    return url; // Already an embed link
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // Fallback for unknown formats or if not a YouTube video link that we can parse
  // console.warn('Could not parse YouTube video link:', url);
  return url; // Or return '' to not render iframe for unparseable links
};

const SolutionDetailPage = () => {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useGetUser(); // Get current user
  const [solution, setSolution] = useState(null);
  const [isLoadingSolution, setIsLoadingSolution] = useState(true);
  const [solutionError, setSolutionError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_MAILS;

  useEffect(() => {
    setIsLoadingSolution(true);
    setSolutionError(null);
    const fetchSolution = async () => {
      try {
        const docRef = doc(db, "solutions", solutionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSolution({ id: docSnap.id, ...docSnap.data() });
        } else {
          setSolutionError("Çözüm bulunamadı.");
        }
      } catch (err) {
        console.error("Çözüm detayları çekilirken hata: ", err);
        setSolutionError("Çözüm detayları yüklenemedi. Lütfen tekrar deneyin.");
      }
      setIsLoadingSolution(false);
    };

    if (solutionId) {
      fetchSolution();
    }
  }, [solutionId]);

  useEffect(() => {
    if (!solutionId) return;
    setIsLoadingComments(true);
    setCommentsError(null);
    const commentsCollection = collection(
      db,
      "solutions",
      solutionId,
      "comments"
    );
    const q = query(commentsCollection, orderBy("createdAt", "asc")); // Oldest comments first

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
        setIsLoadingComments(false);
      },
      (err) => {
        console.error("Yorumlar çekilirken hata: ", err);
        setCommentsError("Yorumlar yüklenemedi.");
        setIsLoadingComments(false);
      }
    );
    return () => unsubscribe(); // Cleanup listener
  }, [solutionId]);

  const handleDelete = async () => {
    if (
      !isAdmin ||
      !solutionId ||
      !window.confirm(
        "Bu çözümü kalıcı olarak silmek istediğinizden emin misiniz?"
      )
    )
      return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "solutions", solutionId));
      alert("Çözüm başarıyla silindi!");
      navigate("/forum");
    } catch (err) {
      console.error("Çözüm silinirken hata: ", err);
      alert("Çözüm silinemedi. Lütfen tekrar deneyin.");
      setIsDeleting(false);
    }
  };

  const handleCommentAdded = useCallback(() => {
    // Comments are real-time, so no explicit refresh needed here for onSnapshot
    // Could be used for optimistic updates or other UI feedback if desired
  }, []);

  if (userLoading || isLoadingSolution) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex justify-center items-center">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (solutionError) {
    return (
      <div className="min-h-[calc(100vh-80px)] container mx-auto p-4 flex flex-col justify-center items-center">
        <div className="alert alert-error shadow-lg max-w-md">
          <div>
            <span>{solutionError}</span>
          </div>
        </div>
        <Link to="/forum" className="btn btn-primary mt-6">
          <FaArrowLeft className="mr-2" /> Foruma Geri Dön
        </Link>
      </div>
    );
  }

  if (!solution) {
    return (
      <div className="min-h-[calc(100vh-80px)] container mx-auto p-4 flex flex-col justify-center items-center">
        <p className="text-2xl mb-4">Çözüm bulunamadı.</p>
        <Link to="/forum" className="btn btn-primary">
          <FaArrowLeft className="mr-2" /> Foruma Geri Dön
        </Link>
      </div>
    );
  }

  const formattedDate = solution.createdAt?.toDate
    ? new Date(solution.createdAt.toDate()).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Tarih bilgisi yok";

  return (
    <div className="bg-base-100 min-h-[calc(100vh-80px)] py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Back to Forum Link */}
        <div className="mb-6">
          <Link
            to="/forum"
            className="btn btn-ghost btn-sm text-primary hover:bg-primary/10"
          >
            <FaArrowLeft className="mr-2" /> Foruma Geri Dön
          </Link>
        </div>

        <article className="bg-base-200 shadow-xl rounded-lg overflow-hidden">
          {solution.imageUrl && (
            <figure className="w-full max-h-[500px] overflow-hidden bg-neutral-focus">
              <img
                src={solution.imageUrl}
                alt={solution.title}
                className="w-full h-full object-contain"
              />
            </figure>
          )}
          <div className="p-6 md:p-10">
            {/* Header Section: Title & Admin Actions */}
            <header className="mb-6 pb-4 border-b border-base-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-3 md:mb-0 break-words">
                  {solution.title}
                </h1>
                {isAdmin && (
                  <div className="flex gap-3 flex-shrink-0">
                    <Link
                      to={`/admin/edit-solution/${solution.id}`}
                      className="btn btn-sm btn-outline btn-warning"
                    >
                      <FaEdit className="mr-1" /> Düzenle
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="btn btn-sm btn-outline btn-error"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <span className="loading loading-xs"></span>
                      ) : (
                        <>
                          <FaTrash className="mr-1" /> Sil
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              {/* Metadata Section */}
              <div className="flex flex-wrap items-center text-sm text-base-content opacity-80 gap-x-4 gap-y-2">
                <span className="flex items-center">
                  <FaUser className="mr-2 text-secondary" />
                  {solution.authorEmail || "Admin"}
                </span>
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-secondary" />
                  {formattedDate}
                </span>
                {solution.category && (
                  <span className="badge badge-accent badge-outline">
                    <FaTag className="mr-1" />
                    {solution.category}
                  </span>
                )}
              </div>
              {solution.tags && solution.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {solution.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge badge-primary badge-outline text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Main Content Section */}
            {solution.shortDescription && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3 text-accent">
                  Özet
                </h2>
                <div className="prose prose-sm md:prose-base max-w-none text-base-content opacity-90">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {solution.shortDescription}
                  </ReactMarkdown>
                </div>
              </section>
            )}

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3 text-accent">
                Detaylar
              </h2>
              <div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-4xl font-bold my-5 text-primary"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-3xl font-bold my-4 text-primary"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-2xl font-semibold my-3 text-secondary"
                        {...props}
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        className="text-xl font-semibold my-2 text-secondary"
                        {...props}
                      />
                    ),
                    h5: ({ node, ...props }) => (
                      <h5 className="text-lg font-semibold my-1" {...props} />
                    ),
                    h6: ({ node, ...props }) => (
                      <h6 className="text-base font-semibold" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-4 leading-relaxed whitespace-pre-wrap"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-4 pl-5 space-y-1"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-4 pl-5 space-y-1"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-info hover:text-info-focus hover:underline"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <pre className="bg-neutral text-neutral-content p-4 rounded-md overflow-x-auto my-4 font-mono text-sm">
                          <code className={`language-${match[1]}`} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code
                          className="bg-base-300 text-accent px-1.5 py-0.5 rounded-sm font-mono text-sm"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-primary pl-4 italic my-4 py-2 bg-base-300/30"
                        {...props}
                      />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="my-6 border-base-300" {...props} />
                    ),
                    img: ({ node, ...props }) => (
                      <img
                        className="my-4 rounded-lg shadow-md max-w-full h-auto"
                        {...props}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="table-auto w-full" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-base-300" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-base-content/30 px-4 py-2 text-left font-semibold"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border border-base-content/30 px-4 py-2"
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                  }}
                >
                  {solution.description}
                </ReactMarkdown>
              </div>
            </section>

            {solution.videoLink && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-accent">
                  İlgili Video
                </h2>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={getYouTubeEmbedUrl(solution.videoLink)}
                    title={solution.title + " Video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </section>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="mt-10 pt-6 bg-base-200 shadow-xl rounded-lg p-6 md:p-8">
          <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-center text-primary">
            Yorumlar ({comments.length})
          </h2>
          <CommentList
            comments={comments}
            isLoading={isLoadingComments}
            error={commentsError}
            solutionId={solutionId}
          />
          <div className="mt-8 pt-6 border-t border-base-300">
            <h3 className="text-xl font-semibold mb-4 text-secondary">
              Yorumunu Bırak
            </h3>
            <CommentForm
              solutionId={solutionId}
              user={user}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SolutionDetailPage;
