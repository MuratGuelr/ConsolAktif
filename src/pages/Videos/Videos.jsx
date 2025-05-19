// src/pages/Videos/Videos.jsx
import React, { useEffect, useState, useMemo } from "react";
import VideoCard from "../../components/VideoCard/VideoCard";
import useGetYoutubeVideos from "../../hooks/useGetYoutubeVideos";

const ITEMS_PER_PAGE = 25;

const Videos = () => {
  const { videos: rawVideos, loading, error } = useGetYoutubeVideos();
  const [sortType, setSortType] = useState("latest"); // 'latest', 'popular', 'oldest'
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = "ConsolAktif | Tüm Videolar";
  }, []);

  // Videoları sıralama
  const sortedVideos = useMemo(() => {
    if (!rawVideos) return [];
    let sortableVideos = [...rawVideos];

    if (sortType === "popular") {
      sortableVideos.sort(
        (a, b) =>
          (Number(b.statistics?.viewCount) || 0) -
          (Number(a.statistics?.viewCount) || 0)
      );
    } else if (sortType === "oldest") {
      sortableVideos.sort(
        (a, b) =>
          new Date(a.snippet?.publishedAt) - new Date(b.snippet?.publishedAt)
      );
    } else if (sortType === "latest") {
      // useGetYoutubeVideos hook'u zaten en yeniden eskiye doğru getiriyorsa bu satır gerekmeyebilir.
      // Eğer getirmiyorsa, burada yeniden sıralama yapın:
      sortableVideos.sort(
        (a, b) =>
          new Date(b.snippet?.publishedAt) - new Date(a.snippet?.publishedAt)
      );
    }
    return sortableVideos;
  }, [rawVideos, sortType]);

  // Sayfalama için mevcut sayfadaki videolar
  const currentVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedVideos.slice(startIndex, endIndex);
  }, [sortedVideos, currentPage]);

  const totalPages = Math.ceil(sortedVideos.length / ITEMS_PER_PAGE);

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    setCurrentPage(1); // Sıralama değiştiğinde ilk sayfaya dön
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0); // Sayfa değiştiğinde üste scroll et
    }
  };

  // --- Yükleme ve Hata Durumları ---
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          Tüm Videolar Yükleniyor...
        </h1>
        <div className="mb-8 flex justify-center space-x-2">
          <div className="btn btn-ghost btn-disabled animate-pulse h-12 w-32 bg-gray-300"></div>
          <div className="btn btn-ghost btn-disabled animate-pulse h-12 w-32 bg-gray-300"></div>
          <div className="btn btn-ghost btn-disabled animate-pulse h-12 w-32 bg-gray-300"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <VideoCard key={index} video={null} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold text-error mb-4">
          Bir Hata Oluştu
        </h1>
        <p className="text-gray-400">
          Videolar yüklenirken bir sorunla karşılaşıldı.
        </p>
        <p className="text-sm text-gray-500 mt-2">{error.toString()}</p>
      </div>
    );
  }

  if (!rawVideos || rawVideos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Videolar</h1>
        <p className="text-gray-400">Henüz hiç video bulunmuyor.</p>
      </div>
    );
  }

  // --- Ana İçerik ---
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        Tüm <span className="text-primary">Videolarım</span> (
        {sortedVideos.length})
      </h1>

      {/* Sıralama Butonları */}
      <div className="mb-8 flex flex-wrap justify-center items-center gap-2 sm:gap-4">
        <button
          onClick={() => handleSortChange("latest")}
          className={`btn ${
            sortType === "latest" ? "btn-primary" : "btn-ghost"
          }`}
        >
          Son Yüklenenler
        </button>
        <button
          onClick={() => handleSortChange("popular")}
          className={`btn ${
            sortType === "popular" ? "btn-primary" : "btn-ghost"
          }`}
        >
          Popüler
        </button>
        <button
          onClick={() => handleSortChange("oldest")}
          className={`btn ${
            sortType === "oldest" ? "btn-primary" : "btn-ghost"
          }`}
        >
          İlk Yüklenenler
        </button>
      </div>

      {/* Video Kartları Grid'i */}
      {currentVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentVideos.map((videoItem) => (
            <VideoCard key={videoItem.id || videoItem.etag} video={videoItem} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-10 text-lg">
          Bu kritere uygun video bulunamadı.
        </p>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="join">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="join-item btn btn-outline"
            >
              «
            </button>
            {/* Sayfa numaralarını dinamik olarak oluşturmak daha iyi olabilir, özellikle çok sayfa varsa */}
            {/* Basit bir gösterim: */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // Sadece mevcut sayfa ve etrafındaki birkaç sayfayı göster
              if (
                pageNum === 1 || // İlk sayfa
                pageNum === totalPages || // Son sayfa
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) // Mevcut sayfa ve komsuları
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`join-item btn ${
                      currentPage === pageNum ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === currentPage - 2 && currentPage > 3) ||
                (pageNum === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                // ... (üç nokta) gösterimi
                return (
                  <button
                    key={pageNum}
                    className="join-item btn btn-disabled btn-outline"
                  >
                    ...
                  </button>
                );
              }
              return null;
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="join-item btn btn-outline"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
