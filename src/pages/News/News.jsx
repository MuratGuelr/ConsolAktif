import { useEffect, useState } from "react";
import { useNewsData } from "../../hooks/useNewsData";
import { getPaginatedNews } from "../../data/newsService";

const FILTERS = [
  { label: "Teknoloji", tag: "technology" },
  { label: "Haftanın Ücretsiz Oyunları", tag: "games" },
];

const ITEMS_PER_PAGE = 9;

export default function News() {
  const [tag, setTag] = useState("technology");
  const [page, setPage] = useState(0);

  const { news: allNews, loading, error } = useNewsData(tag);

  const [currentNewsPage, setCurrentNewsPage] = useState([]);

  useEffect(() => {
    document.title = "ConsolAktif | Haberler";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/logo/logo.png";
    }
  }, []);

  // Animate cards when page or allNews changes
  useEffect(() => {
    if (allNews.length > 0) {
      setCurrentNewsPage(getPaginatedNews(allNews, page));
    } else {
      setCurrentNewsPage([]);
    }
    // We will apply animation class directly during map
  }, [page, allNews]);

  const handleFilter = (newTag) => {
    setTag(newTag);
    setPage(0);
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
    window.scrollTo(0, 0);
  };

  // --- Loading State --- (Keep as is or use Skeleton components for better UX)
  if (loading && !allNews.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  // --- Error State --- (Keep as is)
  if (error && !allNews.length) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Hata! {error}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- No Games Found State --- (Keep similar, maybe update styling)
  if (!loading && !allNews.length && tag === "games") {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Use Tabs for filters here too for consistency */}
        <div role="tablist" className="tabs tabs-lifted justify-center mb-12">
          {FILTERS.map((f) => (
            <a
              key={f.tag}
              role="tab"
              className={`tab ${
                tag === f.tag ? "tab-active font-semibold" : ""
              }`}
              onClick={() => handleFilter(f.tag)} // Use onClick on the 'a' tag
            >
              {f.label}
            </a>
          ))}
        </div>

        {error && (
          <div className="alert alert-warning shadow-lg mb-6">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="card w-full bg-base-200 shadow-xl max-w-2xl mx-auto border border-base-content/10 mt-8">
          <figure className="px-10 pt-10">
            <img src="/notfind.jpg" alt="Free games" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl mb-2">
              Bu Hafta Ücretsiz Oyun Bulunamadı
            </h2>
            <p className="text-base-content/80">
              Bu hafta için ücretsiz oyun haberi henüz eklenmemiş. Daha sonra
              tekrar kontrol edebilirsiniz.
            </p>
            <div className="card-actions mt-6">
              <button
                className="btn btn-primary btn-outline"
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

  // Calculate total pages for pagination
  const totalPages = Math.ceil(allNews.length / ITEMS_PER_PAGE);

  // --- Main Content --- (News Display)
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 bg-base-100 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Güncel Teknoloji Haberleri
      </h1>

      {/* Filters as Tabs */}
      <div role="tablist" className="tabs tabs-lifted justify-center mb-12">
        {FILTERS.map((f) => (
          <a
            key={f.tag}
            role="tab"
            // Apply active class based on current tag
            className={`tab ${tag === f.tag ? "tab-active font-semibold" : ""}`}
            // Use onClick on the 'a' tag itself for better accessibility
            onClick={() => handleFilter(f.tag)}
          >
            {f.label}
          </a>
        ))}
      </div>

      {/* Stale Data Error (if applicable) */}
      {error && allNews.length > 0 && (
        <div className="alert alert-warning shadow-lg mb-6">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Background Loading Indicator (if applicable) */}
      {loading && allNews.length > 0 && (
        <div className="flex justify-center items-center gap-2 mb-6 text-sm text-base-content/70">
          <span className="loading loading-sm loading-spinner text-primary"></span>
          Güncelleniyor...
        </div>
      )}

      {/* News Card Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentNewsPage.length > 0
          ? currentNewsPage.map((item, index) => (
              <a
                key={item.url || index} // Use index as fallback key
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                // Apply animation class and staggered delay
                className="card bg-base-200 shadow-xl hover:shadow-2xl border border-transparent hover:border-primary/50 
                           transform transition-all duration-300 ease-in-out hover:-translate-y-1 group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }} // Staggered delay
              >
                {/* Figure with hover overlay effect */}
                <figure className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.svg";
                      e.target.classList.add("opacity-60");
                    }}
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </figure>
                <div className="card-body p-5">
                  <h2 className="card-title text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h2>
                  <p className="line-clamp-3 text-base-content/80 text-sm mb-4">
                    {item.description}
                  </p>
                  <div className="card-actions justify-end items-center mt-auto pt-2">
                    <span className="badge badge-primary-content badge-outline text-xs font-medium">
                      {item.source}
                    </span>
                  </div>
                </div>
              </a>
            ))
          : !loading &&
            allNews.length === 0 &&
            tag !== "games" && (
              // Styled empty state for non-game tags
              <div className="col-span-full text-center py-16 bg-base-200 rounded-lg shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-base-content/30 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />{" "}
                </svg>
                <p className="text-xl text-base-content/70">
                  Bu kategori için haber bulunamadı.
                </p>
              </div>
            )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 md:mt-16">
          {/* Use btn-sm for smaller pagination, adjust styling */}
          <div className="join rounded-lg shadow-sm">
            {renderPagination(page, totalPages, handlePageClick)}{" "}
            {/* Pass state/handlers */}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Refactored Pagination Renderer ---
// Moved outside component for clarity, receives needed props
const renderPagination = (currentPage, totalPages, handlePageClick) => {
  const pageButtons = [];
  const page = currentPage; // Rename for clarity inside function

  // Logic remains the same, but uses props and applies btn-sm
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`join-item btn btn-sm ${
            page === i ? "btn-active btn-primary" : "btn-ghost"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }
  } else {
    // First Page Button
    pageButtons.push(
      <button
        key={0}
        className={`join-item btn btn-sm ${
          page === 0 ? "btn-active btn-primary" : "btn-ghost"
        }`}
        onClick={() => handlePageClick(0)}
      >
        1
      </button>
    );

    // Ellipsis Start
    if (page > 2) {
      pageButtons.push(
        <button key="dots1" className="join-item btn btn-sm btn-disabled">
          ...
        </button>
      );
    }

    // Middle Buttons
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages - 2, page + 1);

    for (let i = start; i <= end; i++) {
      if (i === 0 || i === totalPages - 1) continue;
      pageButtons.push(
        <button
          key={i}
          className={`join-item btn btn-sm ${
            page === i ? "btn-active btn-primary" : "btn-ghost"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }

    // Ellipsis End
    if (page < totalPages - 3) {
      pageButtons.push(
        <button key="dots2" className="join-item btn btn-sm btn-disabled">
          ...
        </button>
      );
    }

    // Last Page Button
    if (totalPages > 1) {
      pageButtons.push(
        <button
          key={totalPages - 1}
          className={`join-item btn btn-sm ${
            page === totalPages - 1 ? "btn-active btn-primary" : "btn-ghost"
          }`}
          onClick={() => handlePageClick(totalPages - 1)}
        >
          {totalPages}
        </button>
      );
    }
  }

  // Return the buttons wrapped in the join container (already done in the main component)
  return pageButtons;
};
