import { useEffect, useState, useMemo } from "react";
import { useNewsData } from "../../hooks/useNewsData";
import { getPaginatedNews } from "../../data/newsService";
import { BsArrowLeft, BsArrowRight, BsFilter, BsSearch } from "react-icons/bs";
import { HiOutlineAdjustments } from "react-icons/hi";
import { IoNewspaperOutline } from "react-icons/io5";
import { RiComputerLine } from "react-icons/ri";
import { BiWorld, BiMoney, BiFootball } from "react-icons/bi";

const FILTERS = [
  { label: "Tümü", tag: "all", icon: <IoNewspaperOutline className="mr-1" /> },
  {
    label: "Teknoloji",
    tag: "technology",
    icon: <RiComputerLine className="mr-1" />,
  },
  { label: "Genel", tag: "general", icon: <BiWorld className="mr-1" /> },
  { label: "Ekonomi", tag: "economy", icon: <BiMoney className="mr-1" /> },
  { label: "Spor", tag: "sport", icon: <BiFootball className="mr-1" /> },
];

const ITEMS_PER_PAGE_OPTIONS = [9, 12, 18, 24];

export default function News() {
  const [tag, setTag] = useState("all");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "source"

  const { news: allNews, loading, error } = useNewsData(tag);

  const [currentNewsPage, setCurrentNewsPage] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Process news: apply client-side filtering and sorting
  const processedNews = useMemo(() => {
    if (!allNews || allNews.length === 0) return [];

    // Apply search filter if we have a search term
    let filtered = searchTerm.trim()
      ? allNews.filter((item) => {
          const searchTermLower = searchTerm.toLowerCase();
          // Split search term into keywords for more flexible matching
          const keywords = searchTermLower.split(/\s+/).filter(Boolean);

          // Function to check if a text contains any of the keywords
          const containsAnyKeyword = (text) => {
            if (!text) return false;
            text = text.toLowerCase();

            // Check if any keyword is included in the text
            return keywords.some((keyword) => text.includes(keyword));
          };

          // Check if any field contains any of the keywords
          return (
            containsAnyKeyword(item.name) ||
            containsAnyKeyword(item.description) ||
            containsAnyKeyword(item.source)
          );
        })
      : [...allNews];

    // Apply sorting
    if (sortBy === "newest") {
      // Assume news comes pre-sorted by newest from API
      // No additional sorting needed
    } else if (sortBy === "oldest") {
      filtered = [...filtered].reverse();
    } else if (sortBy === "source") {
      filtered = [...filtered].sort((a, b) =>
        (a.source || "").localeCompare(b.source || "")
      );
    }

    return filtered;
  }, [allNews, searchTerm, sortBy]);

  useEffect(() => {
    document.title = "ConsolAktif | Haberler";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/logo/logo.png";
    }
  }, []);

  // Animate cards when page or processedNews changes
  useEffect(() => {
    if (processedNews.length > 0) {
      setCurrentNewsPage(getPaginatedNews(processedNews, page, itemsPerPage));
    } else {
      setCurrentNewsPage([]);
    }
    // We will apply animation class directly during map
  }, [page, processedNews, itemsPerPage]);

  const handleFilter = (newTag) => {
    setTag(newTag);
    setPage(0);
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already applied via useMemo
    // Just reset to page 0 when search changes
    setPage(0);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    // Calculate the first item on the current page
    const firstItemIndex = page * itemsPerPage;
    // Calculate what page that item would be on with the new items per page
    const newPage = Math.floor(firstItemIndex / newItemsPerPage);

    setItemsPerPage(newItemsPerPage);
    setPage(newPage);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
    setPage(0);
  };

  // --- Loading State ---
  if (loading && (!allNews || allNews.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  // --- Error State ---
  if (error && (!allNews || allNews.length === 0)) {
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

  // --- No News Found State ---
  if (!loading && processedNews.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16 animate-fade-in-up">
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

        {error && allNews && allNews.length === 0 && (
          <div
            className="alert alert-warning shadow-lg mb-6 animate-fade-in-down"
            style={{ animationDelay: "100ms" }}
          >
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

        <div
          className="card w-full bg-base-200 shadow-xl max-w-2xl mx-auto border border-base-content/10 mt-8 animate-zoom-in"
          style={{ animationDelay: "200ms" }}
        >
          <figure className="px-10 pt-10">
            <img src="/notfind.jpg" alt="No News" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title text-2xl mb-2">Haber Bulunamadı</h2>
            <p className="text-base-content/80">
              {searchTerm
                ? `"${searchTerm}" aramanız için haber bulunamadı. Lütfen farklı bir arama terimi deneyin.`
                : "Bu kategoride haber bulunamadı. Lütfen daha sonra tekrar kontrol ediniz."}
            </p>
            <div className="card-actions mt-6 flex flex-col sm:flex-row gap-3">
              {searchTerm && (
                <button
                  className="btn btn-secondary btn-outline animate-fade-in-left"
                  onClick={clearFilters}
                  style={{ animationDelay: "300ms" }}
                >
                  Filtreleri Temizle
                </button>
              )}
              <button
                className="btn btn-primary btn-outline animate-fade-in-right"
                onClick={() => handleFilter("technology")}
                style={{ animationDelay: "400ms" }}
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
  const totalPages = Math.ceil(processedNews.length / itemsPerPage);

  // --- Main Content --- (News Display)
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 bg-base-100 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Güncel{" "}
        {tag === "technology"
          ? "Teknoloji Haberleri"
          : tag === "sport"
          ? "Spor Haberleri"
          : tag === "economy"
          ? "Ekonomi Haberleri"
          : tag === "all"
          ? "Tüm Haberler"
          : "Genel Haberler"}{" "}
      </h1>

      {/* Improved Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-base-200 rounded-xl p-1.5 shadow-md flex flex-wrap justify-center">
          {FILTERS.map((f) => (
            <button
              key={f.tag}
              onClick={() => handleFilter(f.tag)}
              className={`flex items-center px-4 py-2.5 rounded-lg mx-1 my-1 transition-all duration-300 ${
                tag === f.tag
                  ? "bg-primary text-primary-content shadow-md font-medium"
                  : "bg-base-200 hover:bg-base-300 text-base-content"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters & Search - Redesigned */}
      <div className="mb-8 bg-base-200 rounded-xl overflow-hidden shadow-lg border border-base-300">
        <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <span
              className="font-semibold text-lg flex items-center cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            >
              <HiOutlineAdjustments className="mr-2 text-xl" /> Filtreler
            </span>
            <button className="btn btn-sm btn-circle btn-ghost ml-2">
              {showFilters ? "−" : "+"}
            </button>

            {(searchTerm || sortBy !== "newest") && (
              <button
                className="btn btn-sm btn-outline btn-error rounded-full ml-3 px-4"
                onClick={clearFilters}
              >
                Filtreleri Temizle
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-auto flex">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Haberlerde ara..."
                className="input input-bordered w-full pr-10 md:w-72 rounded-lg focus:ring-2 focus:ring-primary/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-primary transition-colors"
              >
                <BsSearch className="text-lg" />
              </button>
            </div>
          </form>
        </div>

        {showFilters && (
          <div className="p-5 pt-2 border-t border-base-300 bg-base-200/50 animate-fade-in-up">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="label font-medium flex items-center">
                  <span className="text-base-content/80">Sıralama</span>
                </label>
                <select
                  className="select select-bordered w-full rounded-lg bg-base-100 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="source">Kaynağa Göre</option>
                </select>
              </div>

              <div>
                <label className="label font-medium flex items-center">
                  <span className="text-base-content/80">
                    Sayfa Başına Haber
                  </span>
                </label>
                <select
                  className="select select-bordered w-full rounded-lg bg-base-100 cursor-pointer"
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                >
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats and Background Loading Indicator */}
      <div className="flex justify-between items-center mb-6">
        <div className="badge badge-lg bg-base-200 text-base-content py-3 px-4">
          <span className="font-medium mr-1">{processedNews.length}</span> haber
          bulundu
          {searchTerm && <span className="ml-1">"{searchTerm}" için</span>}
        </div>

        {loading && allNews && allNews.length > 0 && (
          <div className="flex items-center gap-2 badge badge-lg badge-primary py-3 px-4">
            <span className="loading loading-spinner loading-xs"></span>
            Haberler Yükleniyor...
          </div>
        )}
      </div>

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
                className="card bg-base-300 shadow-xl hover:shadow-2xl border border-transparent hover:border-primary/50 
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
                    {/* Show category badge when in "all" view */}
                    {tag === "all" && item.category && (
                      <span
                        className={`badge badge-sm ${
                          item.category === "technology"
                            ? "badge-primary"
                            : item.category === "economy"
                            ? "badge-secondary"
                            : item.category === "sport"
                            ? "badge-accent"
                            : "badge-info"
                        } text-xs ml-1`}
                      >
                        {item.category === "technology"
                          ? "Teknoloji"
                          : item.category === "economy"
                          ? "Ekonomi"
                          : item.category === "sport"
                          ? "Spor"
                          : "Genel"}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))
          : !loading &&
            processedNews.length === 0 && (
              // Styled empty state for tags
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

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-2">
            {/* Previous Page Button */}
            <button
              className="btn btn-circle btn-outline"
              onClick={() => handlePageClick(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <BsArrowLeft className="text-lg" />
            </button>

            {/* Page Numbers */}
            <div className="join">
              {renderEnhancedPagination(page, totalPages, handlePageClick)}
            </div>

            {/* Next Page Button */}
            <button
              className="btn btn-circle btn-outline"
              onClick={() =>
                handlePageClick(Math.min(totalPages - 1, page + 1))
              }
              disabled={page >= totalPages - 1}
            >
              <BsArrowRight className="text-lg" />
            </button>
          </div>

          <div className="text-sm text-base-content/70">
            {processedNews.length > 0 && (
              <span>
                Gösterilen: {page * itemsPerPage + 1} -{" "}
                {Math.min((page + 1) * itemsPerPage, processedNews.length)} /
                Toplam: {processedNews.length} haber
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Pagination Renderer
const renderEnhancedPagination = (currentPage, totalPages, handlePageClick) => {
  const pageButtons = [];

  // Logic for showing which page numbers
  // Always show first and last page, and a few pages around current page
  const showFirst = 0;
  const showLast = totalPages - 1;

  // Determine range of pages to show around current page
  const rangeSize = 3; // Show 3 pages around current page
  const rangeStart = Math.max(1, currentPage - 1); // At least show one page before current
  const rangeEnd = Math.min(showLast - 1, currentPage + 1); // At least show one page after current

  // Helper to add a page button
  const addPageButton = (pageIndex) => {
    pageButtons.push(
      <button
        key={pageIndex}
        onClick={() => handlePageClick(pageIndex)}
        className={`join-item btn ${
          currentPage === pageIndex ? "btn-active btn-primary" : ""
        }`}
      >
        {pageIndex + 1}
      </button>
    );
  };

  // Helper to add ellipsis
  const addEllipsis = (key) => {
    pageButtons.push(
      <button key={key} className="join-item btn btn-disabled">
        ...
      </button>
    );
  };

  // First page
  addPageButton(showFirst);

  // Ellipsis after first page if needed
  if (rangeStart > 1) {
    addEllipsis("start-ellipsis");
  }

  // Pages around current page
  for (let i = rangeStart; i <= rangeEnd; i++) {
    // Skip first and last page as they're always shown separately
    if (i !== showFirst && i !== showLast) {
      addPageButton(i);
    }
  }

  // Ellipsis before last page if needed
  if (rangeEnd < showLast - 1) {
    addEllipsis("end-ellipsis");
  }

  // Last page (if not the same as first page)
  if (showLast > 0) {
    addPageButton(showLast);
  }

  return pageButtons;
};
