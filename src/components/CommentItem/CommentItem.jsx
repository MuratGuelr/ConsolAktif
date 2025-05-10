import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
} from "firebase/firestore";
import useGetUser from "../../hooks/useGetUser";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaThumbsUp,
  FaThumbsDown,
  FaSmile,
  FaRegCommentDots,
} from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import CommentForm from "../CommentForm/CommentForm";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "😡"];

const CommentItem = ({ comment, solutionId, depth = 0 }) => {
  const { user } = useGetUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isProcessing, setIsProcessing] = useState(false);
  const [likeDislikeProcessing, setLikeDislikeProcessing] = useState(false);
  const [reactionProcessing, setReactionProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const modalRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_MAILS;
  const isAuthor = user && user.uid === comment.userId;
  const canEditOrDelete = isAdmin || isAuthor;

  const currentLikes = comment.likes || [];
  const currentDislikes = comment.dislikes || [];
  const currentReactions = comment.reactions || {};

  const userHasLiked = user && currentLikes.includes(user.uid);
  const userHasDisliked = user && currentDislikes.includes(user.uid);

  let userReaction = null;
  if (user) {
    for (const emoji in currentReactions) {
      if (currentReactions[emoji].includes(user.uid)) {
        userReaction = emoji;
        break;
      }
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      if (showDeleteModal) {
        modalElement.showModal();
      } else {
        if (modalElement.open) {
          modalElement.close();
        }
      }
    }
  }, [showDeleteModal]);

  const handleEdit = async () => {
    if (!editedText.trim()) {
      setError("Yorum boş bırakılamaz.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const commentRef = doc(
        db,
        "solutions",
        solutionId,
        "comments",
        comment.id
      );
      await updateDoc(commentRef, {
        text: editedText,
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Yorum güncellenirken hata: ", err);
      setError("Yorum güncellenemedi. Lütfen tekrar deneyin.");
    }
    setIsProcessing(false);
  };

  const confirmDelete = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const commentRef = doc(
        db,
        "solutions",
        solutionId,
        "comments",
        comment.id
      );
      await deleteDoc(commentRef);
    } catch (err) {
      console.error("Yorum silinirken hata: ", err);
      setError("Yorum silinemedi. Lütfen tekrar deneyin.");
    }
    setIsProcessing(false);
    setShowDeleteModal(false);
  };

  const openDeleteModal = () => {
    setError(null);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleLike = async () => {
    if (!user) {
      setError("Beğenmek için giriş yapmalısınız.");
      return;
    }
    if (likeDislikeProcessing || reactionProcessing) return;
    setLikeDislikeProcessing(true);
    setError(null);
    const commentRef = doc(db, "solutions", solutionId, "comments", comment.id);
    try {
      if (userHasLiked) {
        await updateDoc(commentRef, {
          likes: arrayRemove(user.uid),
        });
      } else {
        const updates = { likes: arrayUnion(user.uid) };
        if (userHasDisliked) {
          updates.dislikes = arrayRemove(user.uid);
        }
        await updateDoc(commentRef, updates);
      }
    } catch (err) {
      console.error("Beğeni işlenirken hata: ", err);
      setError("İşlem gerçekleştirilemedi. Tekrar deneyin.");
    }
    setLikeDislikeProcessing(false);
  };

  const handleDislike = async () => {
    if (!user) {
      setError("Beğenmemek için giriş yapmalısınız.");
      return;
    }
    if (likeDislikeProcessing || reactionProcessing) return;
    setLikeDislikeProcessing(true);
    setError(null);
    const commentRef = doc(db, "solutions", solutionId, "comments", comment.id);
    try {
      if (userHasDisliked) {
        await updateDoc(commentRef, {
          dislikes: arrayRemove(user.uid),
        });
      } else {
        const updates = { dislikes: arrayUnion(user.uid) };
        if (userHasLiked) {
          updates.likes = arrayRemove(user.uid);
        }
        await updateDoc(commentRef, updates);
      }
    } catch (err) {
      console.error("Beğenmeme işlenirken hata: ", err);
      setError("İşlem gerçekleştirilemedi. Tekrar deneyin.");
    }
    setLikeDislikeProcessing(false);
  };

  const handleReaction = async (emoji) => {
    if (!user) {
      setError("Tepki vermek için giriş yapmalısınız.");
      setShowEmojiPicker(false);
      return;
    }
    if (reactionProcessing || likeDislikeProcessing) return;
    setReactionProcessing(true);
    setError(null);
    const commentRef = doc(db, "solutions", solutionId, "comments", comment.id);
    const batch = writeBatch(db);

    try {
      const currentEmojiReactions = currentReactions[emoji] || [];
      const userHasReactedWithThisEmoji = currentEmojiReactions.includes(
        user.uid
      );

      for (const existingEmoji in currentReactions) {
        if (
          existingEmoji !== emoji &&
          currentReactions[existingEmoji].includes(user.uid)
        ) {
          batch.update(commentRef, {
            [`reactions.${existingEmoji}`]: arrayRemove(user.uid),
          });
        }
      }

      if (userHasReactedWithThisEmoji) {
        batch.update(commentRef, {
          [`reactions.${emoji}`]: arrayRemove(user.uid),
        });
      } else {
        batch.update(commentRef, {
          [`reactions.${emoji}`]: arrayUnion(user.uid),
        });
      }
      await batch.commit();
    } catch (err) {
      console.error("Emoji tepkisi işlenirken hata: ", err);
      setError("Tepki işlenemedi. Lütfen tekrar deneyin.");
    }
    setReactionProcessing(false);
    setShowEmojiPicker(false);
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
    if (!showReplyForm) {
      setError(null);
    }
  };

  const renderCommentText = (text) => {
    if (comment.parentId && text) {
      const mentionMatch = text.match(/^(@\S+)(\s+.*)?$/s);
      if (mentionMatch) {
        const mention = mentionMatch[1];
        const message = mentionMatch[2] || "";
        return (
          <>
            <span className="text-accent font-semibold mr-1">{mention}</span>
            <span style={{ whiteSpace: "pre-wrap" }}>
              {message.trimStart()}
            </span>
          </>
        );
      }
    }
    return <span style={{ whiteSpace: "pre-wrap" }}>{text}</span>;
  };

  return (
    <>
      <div
        className={`bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 group relative ${
          comment.parentId
            ? `mt-3 ${depth > 0 ? `ml-${Math.min(12, 4 + depth * 4)}` : "ml-8"}`
            : "mb-5"
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="avatar flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center ring-1 ring-base-300">
              {comment.userPhotoURL ? (
                <img
                  src={comment.userPhotoURL}
                  alt={comment.userDisplayName || "Kullanıcı"}
                  className="rounded-full"
                />
              ) : (
                <span className="text-xl font-semibold text-base-content opacity-80">
                  {comment.userDisplayName
                    ? comment.userDisplayName.charAt(0).toUpperCase()
                    : "K"}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold text-base-content">
                  {comment.userDisplayName || "Anonim Kullanıcı"}
                </span>
                {comment.createdAt?.toDate && (
                  <time className="text-xs text-base-content opacity-60 ml-2">
                    {formatDistanceToNow(comment.createdAt.toDate(), {
                      addSuffix: true,
                      locale: tr,
                    })}
                    {comment.updatedAt &&
                      comment.createdAt.seconds !==
                        comment.updatedAt.seconds && (
                        <span className="italic opacity-80 ml-1">
                          (düzenlendi)
                        </span>
                      )}
                  </time>
                )}
              </div>
              {canEditOrDelete && !isEditing && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setError(null);
                    }}
                    className="btn btn-xs btn-ghost text-info hover:bg-info hover:text-info-content p-1"
                    title="Düzenle"
                    disabled={likeDislikeProcessing || reactionProcessing}
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={openDeleteModal}
                    className="btn btn-xs btn-ghost text-error hover:bg-error hover:text-error-content p-1"
                    title="Sil"
                    disabled={likeDislikeProcessing || reactionProcessing}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2 w-full">
                <textarea
                  className="textarea textarea-bordered w-full h-24 mb-2 focus:border-primary transition-colors"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  disabled={isProcessing}
                  autoFocus
                />
                {error && <p className="text-error text-xs mb-2">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="btn btn-sm btn-primary"
                    disabled={
                      isProcessing ||
                      likeDislikeProcessing ||
                      reactionProcessing
                    }
                  >
                    <FaSave className="mr-1" />{" "}
                    {isProcessing ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                      setEditedText(comment.text);
                    }}
                    className="btn btn-sm btn-ghost"
                    disabled={
                      isProcessing ||
                      likeDislikeProcessing ||
                      reactionProcessing
                    }
                  >
                    <FaTimes className="mr-1" /> İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1 prose prose-sm max-w-none text-base-content opacity-90">
                {renderCommentText(comment.text)}
              </div>
            )}

            {!isEditing && (
              <div className="mt-3 flex items-center gap-3 text-xs text-base-content opacity-80">
                <button
                  onClick={handleLike}
                  className={`flex items-center p-1 rounded-md hover:bg-base-200 transition-colors ${
                    userHasLiked
                      ? "text-success font-semibold"
                      : "hover:text-success"
                  }`}
                  disabled={
                    !user || likeDislikeProcessing || reactionProcessing
                  }
                  title="Beğen"
                >
                  <FaThumbsUp size={14} className="mr-1" />{" "}
                  {currentLikes.length > 0 ? currentLikes.length : ""}
                </button>
                <button
                  onClick={handleDislike}
                  className={`flex items-center p-1 rounded-md hover:bg-base-200 transition-colors ${
                    userHasDisliked
                      ? "text-error font-semibold"
                      : "hover:text-error"
                  }`}
                  disabled={
                    !user || likeDislikeProcessing || reactionProcessing
                  }
                  title="Beğenme"
                >
                  <FaThumbsDown size={14} className="mr-1" />{" "}
                  {currentDislikes.length > 0 ? currentDislikes.length : ""}
                </button>
                <button
                  onClick={toggleReplyForm}
                  className={`flex items-center p-1 rounded-md hover:bg-base-200 transition-colors ${
                    showReplyForm
                      ? "text-primary font-semibold"
                      : "hover:text-primary"
                  }`}
                  disabled={reactionProcessing || likeDislikeProcessing}
                  title="Yanıtla"
                >
                  <FaRegCommentDots size={14} className="mr-1" /> Yanıtla
                </button>
                <div
                  className="relative ml-auto flex items-center gap-1.5"
                  ref={emojiPickerRef}
                >
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`flex items-center p-1 rounded-md hover:bg-base-200 transition-colors ${
                      userReaction
                        ? "text-accent font-semibold"
                        : "hover:text-accent"
                    }`}
                    disabled={
                      !user || reactionProcessing || likeDislikeProcessing
                    }
                    title="Tepki Ver"
                  >
                    <FaSmile size={14} className="mr-1" />
                    {userReaction && (
                      <span className="text-sm mr-1">{userReaction}</span>
                    )}
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 right-0 bg-base-200 p-1.5 rounded-lg shadow-xl flex gap-1 z-20 border border-base-300">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(emoji)}
                          className={`p-1.5 rounded-md hover:bg-base-300 transition-colors text-xl ${
                            userReaction === emoji
                              ? "bg-primary text-primary-content scale-110"
                              : ""
                          }`}
                          disabled={reactionProcessing}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                  {Object.entries(currentReactions)
                    .filter(([emoji, users]) => users.length > 0)
                    .sort(
                      ([, usersA], [, usersB]) => usersB.length - usersA.length
                    )
                    .map(([emoji, users]) => (
                      <div
                        key={emoji}
                        className={`flex items-center bg-base-200 hover:bg-base-300 transition-colors rounded-full px-2 py-1 cursor-pointer ${
                          userReaction === emoji ? "ring-1 ring-accent" : ""
                        }`}
                        title={`${users.length} ${emoji}`}
                        onClick={() => handleReaction(emoji)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleReaction(emoji)
                        }
                      >
                        <span className="text-sm">{emoji}</span>
                        <span className="ml-1 text-xs font-medium">
                          {users.length}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {!isEditing && showReplyForm && (
              <CommentForm
                solutionId={solutionId}
                parentId={comment.id}
                parentAuthorDisplayName={
                  comment.userDisplayName || "Anonim Kullanıcı"
                }
                onCommentPosted={() => {
                  setShowReplyForm(false);
                }}
              />
            )}

            {!isEditing && error && (
              <p className="text-error text-xs mt-2">{error}</p>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <button
              onClick={closeDeleteModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              disabled={isProcessing}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-error">
              <FaExclamationTriangle className="inline mr-2 mb-1" />
              Yorum Silme Onayı
            </h3>
            <p className="py-4">
              Bu yorumu kalıcı olarak silmek istediğinizden emin misiniz? Bu
              işlem geri alınamaz.
            </p>
            {error && <p className="text-error text-sm mb-3">Hata: {error}</p>}
            <div className="modal-action">
              <button
                onClick={closeDeleteModal}
                className="btn btn-ghost"
                disabled={isProcessing}
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <>
                    <FaTrash className="mr-1" />
                    Evet, Sil
                  </>
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeDeleteModal} disabled={isProcessing}>
              kapat
            </button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default CommentItem;
