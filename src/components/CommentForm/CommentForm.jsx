import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useGetUser from "../../hooks/useGetUser";

const CommentForm = ({
  solutionId,
  parentId = null,
  parentAuthorDisplayName = null,
  onCommentPosted,
}) => {
  const { user } = useGetUser();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (parentId && parentAuthorDisplayName && commentText === "") {
      const initialText = `@${parentAuthorDisplayName.replace(/\s+/g, "")} `;
      setCommentText(initialText);
      if (textareaRef.current) {
        textareaRef.current.focus();
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(
              initialText.length,
              initialText.length
            );
          }
        }, 0);
      }
    }
  }, [parentId, parentAuthorDisplayName]);

  useEffect(() => {
    if (!parentId) {
      setCommentText("");
    }
  }, [parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Yorum yapmak için giriş yapmalısınız.");
      return;
    }
    const mentionPattern = /^@\S+\s*$/;
    if (
      !commentText.trim() ||
      (parentId && parentAuthorDisplayName && mentionPattern.test(commentText))
    ) {
      setError(
        parentId
          ? "Yanıtınıza bir mesaj eklemelisiniz."
          : "Yorum alanı boş bırakılamaz."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const commentData = {
        text: commentText,
        userId: user.uid,
        userDisplayName: user.displayName || "Anonim Kullanıcı",
        userPhotoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: [],
        dislikes: [],
        reactions: {},
        solutionId: solutionId,
        parentId: parentId,
      };

      if (!parentId) {
        commentData.parentId = null;
      }

      await addDoc(
        collection(db, "solutions", solutionId, "comments"),
        commentData
      );
      setCommentText("");
      if (onCommentPosted) {
        onCommentPosted();
      }
    } catch (err) {
      console.error("Yorum gönderilirken hata: ", err);
      setError("Yorum gönderilemedi. Lütfen tekrar deneyin.");
    }
    setIsSubmitting(false);
  };

  if (!user && !parentId) {
    return (
      <p className="text-sm text-base-content opacity-70 mt-4">
        Lütfen yorum bırakmak için{" "}
        <a href="/login" className="link link-primary">
          giriş yapın
        </a>
        .
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`mt-2 mb-4 ${
        parentId ? "ml-8 p-3 bg-base-200 rounded-md" : "p-1"
      }`}
    >
      <textarea
        ref={textareaRef}
        className="textarea textarea-bordered w-full h-20 text-sm"
        placeholder={
          parentId ? "Yanıtınızı buraya yazın..." : "Yorumunuzu buraya yazın..."
        }
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between mt-2">
        {error && <p className="text-error text-xs flex-grow">{error}</p>}
        {user ? (
          <button
            type="submit"
            className="btn btn-sm btn-primary ml-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : parentId ? (
              "Yanıtla"
            ) : (
              "Yorum Yap"
            )}
          </button>
        ) : (
          <p className="text-xs text-error ml-auto">
            Yanıtlamak için giriş yapmalısınız.
          </p>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
