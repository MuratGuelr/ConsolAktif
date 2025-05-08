import React from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale"; // Türkçe gösterim için

const VideoCard = ({ video }) => {
  if (!video || !video.snippet) {
    // Veri yoksa veya snippet alanı eksikse bir placeholder veya null döndür
    return (
      <div className="card bg-base-100 shadow-xl animate-pulse">
        <div className="aspect-video bg-gray-300 w-full"></div>
        <div className="card-body p-4">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="card-actions justify-end mt-2">
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  const videoId = video.id; // YouTube video ID'si (eğer video objesi doğrudan video item'ı ise)
  // Eğer playlistItem ise video.snippet.resourceId.videoId olabilir. Hook'un dönüşüne göre ayarla.
  const title = video.snippet.title;
  // En iyi kalitedeki thumbnail'ı dene, yoksa düşerek git
  const thumbnailUrl =
    video.snippet.thumbnails?.maxres?.url ||
    video.snippet.thumbnails?.standard?.url ||
    video.snippet.thumbnails?.high?.url ||
    video.snippet.thumbnails?.medium?.url ||
    video.snippet.thumbnails?.default?.url;
  const publishedAt = video.snippet.publishedAt;
  const views = video.statistics?.viewCount;
  const duration = video.formattedDuration; // useGetYoutubeVideos hook'unda eklediğin formatlanmış süre

  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), {
        addSuffix: true,
        locale: tr,
      })
    : "";

  return (
    <div className="card bg-base-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      <figure className="relative aspect-video">
        {" "}
        {/* aspect-video ile orantılı yükseklik */}
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-gray-700 w-full h-full flex items-center justify-center text-gray-400">
              Thumbnail Yok
            </div>
          )}
          {duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {duration}
            </span>
          )}
        </a>
      </figure>
      <div className="card-body p-4 flex-grow">
        <h2 className="card-title text-md md:text-lg leading-tight">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover line-clamp-2"
            title={title}
          >
            {title}
          </a>
        </h2>
        <div className="text-xs text-gray-400 mt-1 flex flex-wrap justify-between items-center gap-x-2">
          {timeAgo && <span className="whitespace-nowrap">{timeAgo}</span>}
          {views && (
            <span className="whitespace-nowrap">
              {Number(views).toLocaleString("tr-TR")} görüntüleme
            </span>
          )}
        </div>
      </div>
      <div className="card-actions justify-end p-4 pt-0">
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
        >
          YouTube'da İzle
        </a>
      </div>
    </div>
  );
};

export default VideoCard;
