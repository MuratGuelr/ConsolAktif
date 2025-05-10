import { useState } from "react";
import { format } from "date-fns";
import { FaUser, FaTrash } from "react-icons/fa";
import useForumPosts from "../../hooks/useForumPosts";
import useAuth from "../../hooks/useAuth";

const CommentSection = ({ postId, comments = [] }) => {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment, deleteComment, isAdmin } = useForumPosts();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      await addComment(postId, commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(postId, commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const canDeleteComment = (comment) => {
    return isAdmin || (user && user.email === comment.createdBy);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Yorumlar ({comments.length})</h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="form-control">
            <label htmlFor="commentText" className="label">
              <span className="label-text">Yorumunuz</span>
            </label>
            <textarea
              id="commentText"
              name="commentText"
              className="textarea textarea-bordered h-24"
              placeholder="Yorumunuzu buraya yazın..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              aria-label="Yorum metni"
            ></textarea>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting || !commentText.trim()}
              aria-label="Yorum ekle"
            >
              Yorum Ekle
            </button>
          </div>
        </form>
      ) : (
        <div className="alert alert-info mb-8" role="alert">
          <p>Yorum yapabilmek için giriş yapmalısınız.</p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Henüz yorum yok. İlk yorumu siz yapın!</p>
        </div>
      ) : (
        <div className="space-y-6" role="list">
          {comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => (
              <article
                key={comment.id}
                className="bg-base-200 rounded-lg p-4 relative"
                role="listitem"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="avatar placeholder mr-2">
                      <div
                        className="bg-neutral text-neutral-content rounded-full w-8"
                        aria-hidden="true"
                      >
                        <span>{comment.userDisplayName?.charAt(0) || "U"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{comment.userDisplayName}</p>
                      <time
                        dateTime={format(
                          new Date(comment.createdAt),
                          "yyyy-MM-dd'T'HH:mm:ss"
                        )}
                        className="text-xs text-gray-500"
                      >
                        {format(
                          new Date(comment.createdAt),
                          "dd.MM.yyyy HH:mm"
                        )}
                      </time>
                    </div>
                  </div>

                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="btn btn-ghost btn-xs text-error"
                      aria-label="Yorumu sil"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>

                <p className="mt-2 whitespace-pre-wrap">{comment.text}</p>
              </article>
            ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
