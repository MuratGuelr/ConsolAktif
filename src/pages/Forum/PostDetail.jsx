import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaComment,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import useForumPosts from "../../hooks/useForumPosts";
import useAuth from "../../hooks/useAuth";
import Loader from "../../loading/Loader";
import CommentSection from "../../components/Forum/CommentSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getPostById, deletePost, isAdmin } = useForumPosts();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(postId);
        if (!postData) {
          throw new Error("Post not found");
        }
        setPost(postData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, getPostById]);

  const handleEdit = () => {
    navigate(`/forum/edit/${postId}`);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      const success = await deletePost(postId);
      if (success) {
        navigate("/forum");
      }
    } else {
      setDeleteConfirm(true);
      // Auto-reset after 3 seconds
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  const handleBack = () => {
    navigate("/forum");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <p>{error || "Post not found"}</p>
        </div>
        <button onClick={handleBack} className="btn btn-outline mt-4">
          <FaArrowLeft className="mr-2" /> Back to Forum
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="btn btn-outline"
          aria-label="Geri dön"
        >
          <FaArrowLeft className="mr-2" /> Geri Dön
        </button>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="btn btn-outline btn-info"
              aria-label="Düzenle"
            >
              <FaEdit className="mr-2" /> Düzenle
            </button>
            <button
              onClick={handleDelete}
              className={`btn ${
                deleteConfirm ? "btn-error" : "btn-outline btn-error"
              }`}
              aria-label={deleteConfirm ? "Silmeyi onayla" : "Sil"}
            >
              <FaTrash className="mr-2" />{" "}
              {deleteConfirm ? "Silmeyi Onayla" : "Sil"}
            </button>
          </div>
        )}
      </div>

      {/* Post Header */}
      <article className="bg-base-100 rounded-lg shadow-lg overflow-hidden mb-8">
        {/* Post Image */}
        {post.imageUrl && (
          <figure className="w-full h-64 md:h-96 overflow-hidden">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </figure>
        )}

        {/* Post Content */}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="badge badge-primary">{post.category}</div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>

          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1" aria-hidden="true" />
              <time dateTime={format(new Date(post.createdAt), "yyyy-MM-dd")}>
                {format(new Date(post.createdAt), "dd.MM.yyyy")}
              </time>
            </div>
            <div className="flex items-center">
              <FaUser className="mr-1" aria-hidden="true" />
              <span>{post.createdBy}</span>
            </div>
            <div className="flex items-center">
              <FaComment className="mr-1" aria-hidden="true" />
              <span>{post.comments?.length || 0} yorum</span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Short Description */}
          <div className="text-lg font-medium mb-6">
            {post.shortDescription}
          </div>

          {/* Main Content */}
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.description}
            </ReactMarkdown>
          </div>

          {/* Video Section */}
          {post.videoUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Video</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={post.videoUrl}
                  title={`Video: ${post.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-96 rounded-lg"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <CommentSection postId={postId} comments={post.comments || []} />
      </div>
    </div>
  );
};

export default PostDetail;
