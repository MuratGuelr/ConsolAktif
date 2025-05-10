import { format } from "date-fns";
import { FaComment, FaCalendarAlt } from "react-icons/fa";

const PostCard = ({ post, onClick }) => {
  const { title, shortDescription, imageUrl, createdAt, category, comments } =
    post;

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer h-full"
      onClick={onClick}
    >
      {/* Image */}
      <figure className="h-48 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Resim Yok</span>
          </div>
        )}
      </figure>

      <div className="card-body">
        {/* Category Badge */}
        <div className="card-actions justify-start mb-1">
          <div className="badge badge-primary">{category}</div>
        </div>

        {/* Title */}
        <h2 className="card-title line-clamp-2">{title}</h2>

        {/* Short Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {shortDescription}
        </p>

        {/* Footer */}
        <div className="card-actions justify-between mt-auto">
          <div className="flex items-center text-xs text-gray-500">
            <FaCalendarAlt className="mr-1" />
            <span>{format(new Date(createdAt), "dd.MM.yyyy")}</span>
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <FaComment className="mr-1" />
            <span>{comments?.length || 0} yorum</span>
          </div>
        </div>

        {/* Button */}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm">Detaylar</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
