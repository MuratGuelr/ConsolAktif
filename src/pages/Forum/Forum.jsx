import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useForumPosts from "../../hooks/useForumPosts";
import useAuth from "../../hooks/useAuth";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaPlus,
  FaSync,
  FaExclamationTriangle,
  FaWifi,
} from "react-icons/fa";
import PostCard from "../../components/Forum/PostCard";
import ForumHero from "../../components/Forum/ForumHero";
import Loader from "../../loading/Loader";

const Forum = () => {
  const {
    posts,
    loading,
    error,
    categories,
    fetchPosts,
    isAdmin,
    networkStatus,
    checkConnection,
  } = useForumPosts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNetworkToast, setShowNetworkToast] = useState(false);

  useEffect(() => {
    fetchPosts(sortBy, sortOrder, selectedCategory || null, searchTerm);
  }, [sortBy, sortOrder, selectedCategory]);

  // Show network toast when status changes
  useEffect(() => {
    if (networkStatus === "offline") {
      setShowNetworkToast(true);
      // Hide toast after 10 seconds
      const timer = setTimeout(() => {
        setShowNetworkToast(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [networkStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(sortBy, sortOrder, selectedCategory || null, searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const handleAddNewPost = () => {
    navigate("/forum/new");
  };

  const handlePostClick = (postId) => {
    navigate(`/forum/post/${postId}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Try to check connection first
    await checkConnection();

    // Then fetch posts
    await fetchPosts(sortBy, sortOrder, selectedCategory || null, searchTerm);

    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <ForumHero />

      {/* Network Status Toast - Fixed position */}
      {showNetworkToast && networkStatus === "offline" && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-warning">
            <FaWifiSlash className="text-lg" />
            <span>Bağlantı sorunu yaşıyoruz. Çevrimdışı moddasınız.</span>
            <div>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowNetworkToast(false)}
              >
                Kapat
              </button>
              <button
                className="btn btn-sm btn-primary ml-2"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader size="small" />
                ) : (
                  <FaSync className="mr-1" />
                )}
                Yenile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Network Status Alert - Inline */}
      {networkStatus === "offline" && !showNetworkToast && (
        <div className="flex justify-center">
          <button
            className="btn btn-sm btn-warning gap-2 my-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FaWifiSlash />
            {isRefreshing ? (
              <Loader size="small" />
            ) : (
              "Çevrimdışı - Yenilemek için tıklayın"
            )}
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 w-full">
              <div className="input-group w-full">
                <input
                  type="text"
                  placeholder="Çözümlerde ara..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <FaSearch />
                </button>
              </div>
            </form>

            {/* Filter & Sort Buttons */}
            <div className="flex gap-2">
              <button
                className="btn btn-outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" /> Filtreler
              </button>

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline">
                  <FaSort className="mr-2" /> Sırala
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <button
                      className={sortBy === "createdAt" ? "active" : ""}
                      onClick={() => setSortBy("createdAt")}
                    >
                      Tarih{" "}
                      {sortBy === "createdAt" &&
                        (sortOrder === "desc" ? "↓" : "↑")}
                    </button>
                  </li>
                  <li>
                    <button
                      className={sortBy === "title" ? "active" : ""}
                      onClick={() => setSortBy("title")}
                    >
                      Başlık{" "}
                      {sortBy === "title" && (sortOrder === "desc" ? "↓" : "↑")}
                    </button>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <button onClick={handleSortOrderToggle}>
                      {sortOrder === "desc" ? "Azalan" : "Artan"}
                    </button>
                  </li>
                </ul>
              </div>

              {isAdmin && (
                <button
                  className="btn btn-primary"
                  onClick={handleAddNewPost}
                  disabled={networkStatus === "offline"}
                >
                  <FaPlus className="mr-2" /> Yeni Çözüm
                </button>
              )}

              {/* Network Status Indicator */}
              <div
                className="tooltip"
                data-tip={
                  networkStatus === "online" ? "Çevrimiçi" : "Çevrimdışı"
                }
              >
                <button
                  className={`btn btn-circle btn-sm ${
                    networkStatus === "online" ? "btn-success" : "btn-warning"
                  }`}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader size="small" />
                  ) : networkStatus === "online" ? (
                    <FaWifi />
                  ) : (
                    <FaWifiSlash />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options - Collapsible */}
          {showFilters && (
            <div className="bg-base-100 p-4 rounded-lg shadow-md mb-4 animate-fadeIn">
              <h3 className="font-semibold mb-2">Kategoriler</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm ${
                    selectedCategory === "" ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => handleCategoryChange("")}
                >
                  Tümü
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`btn btn-sm ${
                      selectedCategory === category
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <div>
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
            <div className="flex-none">
              <button
                className="btn btn-sm btn-outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? <Loader size="small" /> : <FaSync />} Yeniden
                Dene
              </button>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Çözüm bulunamadı</h3>
            <p className="text-gray-500">
              {searchTerm || selectedCategory
                ? "Arama kriterlerinizi veya filtrelerinizi değiştirmeyi deneyin"
                : "İlk çözümü ekleyen siz olun!"}
            </p>
            {isAdmin && (
              <button
                className="btn btn-primary mt-4"
                onClick={handleAddNewPost}
                disabled={networkStatus === "offline"}
              >
                Çözüm Ekle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
