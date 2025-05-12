import { useEffect, useState } from "react";
import { getAllNews, getPaginatedNews } from "../../data/newsService";

const FILTERS = [
  { label: "Teknoloji", tag: "technology" },
  { label: "Haftanın Ücretsiz Oyunları", tag: "games" },
];

const ITEMS_PER_PAGE = 9; // src/data/newsService.js ile aynı sayı olmalı

export default function News() {
  const [news, setNews] = useState([]);
  const [allNews, setAllNews] = useState([]); // Tüm haberler
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tag, setTag] = useState("technology");
  const [page, setPage] = useState(0);

  useEffect(() => {
    document.title = "ConsolAktif | Teknoloji Haberleri";
    const favicon = document.querySelector("link[rel~='icon']");
    favicon.href = "/logo/logo.png";
  }, []);

  // Tüm haberleri tek seferde çek ve sakla
  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllNews({ tag })
      .then((articles) => {
        // Resmi olmayan haberleri filtrele
        const filteredArticles = articles.filter(
          (article) => article.image && article.image.startsWith("http")
        );
        setAllNews(filteredArticles);
        // Sadece ilk sayfa için gereken haberleri göster
        setNews(getPaginatedNews(filteredArticles, 0));
        setPage(0); // Yeni tag'de sayfa sıfırlanır
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tag]); // Sadece tag değiştiğinde API'ye istek at

  // Sayfa değiştikçe yerel veriyi slice et
  useEffect(() => {
    if (allNews.length > 0) {
      setNews(getPaginatedNews(allNews, page));
    }
  }, [page, allNews]);

  const handleFilter = (newTag) => {
    setTag(newTag);
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  // Oyun haberlerinde özel boş durum gösterimi
  if (!allNews.length && tag === "games") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Haberler</h1>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.tag}
              className={`btn btn-sm btn-outline ${
                tag === f.tag ? "btn-primary" : ""
              }`}
              onClick={() => handleFilter(f.tag)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="card w-full bg-base-300 shadow-xl max-w-2xl mx-auto">
          <figure className="px-10 pt-10">
            <img src="/notfind.jpg" alt="Free games" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl">
              Bu Hafta Ücretsiz Oyun Bulunamadı
            </h2>
            <p>
              Bu hafta için ücretsiz oyun haberi henüz eklenmemiş. Daha sonra
              tekrar kontrol edebilirsiniz.
            </p>
            <div className="card-actions mt-4">
              <button
                className="btn btn-primary"
                onClick={() => handleFilter("technology")}
              >
                Teknoloji Haberlerine Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="alert alert-info">Bu sayfa için haber bulunamadı.</div>
    );
  }

  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);

  // Pagination için sayfa numaralarını oluştur
  const renderPagination = () => {
    const pageButtons = [];

    // Eğer toplam sayfa 7'den azsa hepsini göster
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            className={`join-item btn ${page === i ? "btn-active" : ""}`}
            onClick={() => handlePageClick(i)}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      // Başta her zaman 1. sayfa görünür
      pageButtons.push(
        <button
          key={0}
          className={`join-item btn ${page === 0 ? "btn-active" : ""}`}
          onClick={() => handlePageClick(0)}
        >
          1
        </button>
      );

      // İlk sayfa bölgesi
      if (page > 2) {
        pageButtons.push(
          <button key="dots1" className="join-item btn btn-disabled">
            ...
          </button>
        );
      }

      // Orta bölge - aktif sayfa civarı
      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);

      for (let i = start; i <= end; i++) {
        if (i === 0 || i === totalPages - 1) continue; // İlk ve son sayfayı atla (ayrıca gösteriliyor)
        pageButtons.push(
          <button
            key={i}
            className={`join-item btn ${page === i ? "btn-active" : ""}`}
            onClick={() => handlePageClick(i)}
          >
            {i + 1}
          </button>
        );
      }

      // Son sayfa bölgesi
      if (page < totalPages - 3) {
        pageButtons.push(
          <button key="dots2" className="join-item btn btn-disabled">
            ...
          </button>
        );
      }

      // Son sayfa her zaman görünür
      if (totalPages > 1) {
        pageButtons.push(
          <button
            key={totalPages - 1}
            className={`join-item btn ${
              page === totalPages - 1 ? "btn-active" : ""
            }`}
            onClick={() => handlePageClick(totalPages - 1)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return <div className="join">{pageButtons}</div>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Haberler</h1>
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.tag}
            className={`btn btn-sm btn-outline ${
              tag === f.tag ? "btn-primary" : ""
            }`}
            onClick={() => handleFilter(f.tag)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card bg-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-200"
          >
            <figure>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{item.name}</h2>
              <p className="line-clamp-3">{item.description}</p>
              <div className="card-actions justify-between items-center mt-2">
                <span className="badge badge-outline">{item.source}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="flex justify-center mt-8">{renderPagination()}</div>
    </div>
  );
}
