import React from "react";
// import { formatDistanceToNow } from "date-fns"; // Artık CommentItem içinde kullanılacak
// import { tr } from "date-fns/locale"; // Artık CommentItem içinde kullanılacak
import CommentItem from "../CommentItem/CommentItem"; // Yeni CommentItem bileşenini import et

const CommentList = ({ comments, isLoading, error, solutionId }) => {
  // solutionId prop olarak eklendi
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <span className="loading loading-dots loading-md text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-error text-center py-4">
        Yorumlar yüklenirken hata oluştu: {error}
      </p>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <p className="text-center text-base-content opacity-70 py-4">
        Henüz hiç yorum yapılmamış. İlk yorumu sen yap!
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          solutionId={solutionId}
        />
        // Eski yorum renderlama kodu CommentItem içine taşındı.
        // <div key={comment.id} className="chat chat-start">
        //   <div className="chat-image avatar">
        //     <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
        //       {comment.userPhotoURL ? (
        //         <img
        //           src={comment.userPhotoURL}
        //           alt={comment.userDisplayName || "Kullanıcı"}
        //         />
        //       ) : (
        //         <span className="text-xl">
        //           {comment.userDisplayName
        //             ? comment.userDisplayName.charAt(0).toUpperCase()
        //             : "K"}
        //         </span>
        //       )}
        //     </div>
        //   </div>
        //   <div className="chat-header">
        //     {comment.userDisplayName || "Anonim Kullanıcı"}
        //     {comment.createdAt?.toDate && (
        //       <time className="text-xs opacity-50 ml-2">
        //         {formatDistanceToNow(comment.createdAt.toDate(), {
        //           addSuffix: true,
        //           locale: tr,
        //         })}
        //       </time>
        //     )}
        //   </div>
        //   <div className="chat-bubble chat-bubble-primary">
        //     <p style={{ whiteSpace: "pre-wrap" }}>{comment.text}</p>
        //   </div>
        // </div>
      ))}
    </div>
  );
};

export default CommentList;
