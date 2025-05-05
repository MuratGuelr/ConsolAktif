import React, { useState, useEffect } from "react";
import { useFirebaseVideoTools } from "../../hooks/useFirebaseVideoTools";
import { useAuth } from "../../hooks/useAuth";
import ToolForm from "../../components/ToolForm/ToolForm";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { GoSortAsc } from "react-icons/go";
import { FaStar } from "react-icons/fa6";
import { IoAlertCircle } from "react-icons/io5";

const FreeExtensions = () => {
  const [searchInput, setSearchInput] = useState(""); // Kullanıcı girdisi için
  const [searchQuery, setSearchQuery] = useState(""); // Firebase sorgusu için
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("rating");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [animateResults, setAnimateResults] = useState(false);
  const [prevSearchParams, setPrevSearchParams] = useState({
    query: "",
    category: "",
    sort: "rating",
  });

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { user, isAdmin, login, logout, error: authError } = useAuth();

  useEffect(() => {
    document.title = "ConsolAktif Eklenti Marketi";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/apps/auto-editor/all.png";
    }
  }, []);

  // Firebase hook with custom options
  const { data, loading, error, addTool, updateTool, deleteTool } =
    useFirebaseVideoTools(searchQuery, category, { sort, limit: 20 });

  // Trigger animation after initial data load
  useEffect(() => {
    if (data && !loading && !initialLoadComplete) {
      // Short delay to ensure DOM is ready
      setTimeout(() => {
        setAnimateResults(true);
        setInitialLoadComplete(true);
      }, 100);
    }
  }, [data, loading, initialLoadComplete]);

  // Arama inputu değiştiğinde debounce ile sorguyu güncelle
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300); // 300ms gecikme ile sorguyu güncelle

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Arama parametreleri değiştiğinde animasyon kontrolü
  useEffect(() => {
    // Arama parametreleri değiştiyse animasyonu başlat
    if (
      searchQuery !== prevSearchParams.query ||
      category !== prevSearchParams.category ||
      sort !== prevSearchParams.sort
    ) {
      setAnimateResults(false); // Önce animasyonu resetle

      // Sonuçlar için bir sonraki render'da animasyonu etkinleştir
      setTimeout(() => {
        setAnimateResults(true);
      }, 100);

      // Önceki parametreleri güncelle
      setPrevSearchParams({
        query: searchQuery,
        category: category,
        sort: sort,
      });
    }
  }, [searchQuery, category, sort]);

  // Handle form submission for adding/editing tools
  const handleFormSubmit = async (formData) => {
    try {
      if (currentTool) {
        // Update existing tool
        await updateTool(currentTool.id, formData);
      } else {
        // Add new tool
        await addTool(formData);
      }
      setIsFormOpen(false);
      setCurrentTool(null);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  // Open edit form with current tool data
  const handleEditTool = (tool) => {
    setCurrentTool(tool);
    setIsFormOpen(true);
  };

  // Handle tool deletion
  const handleDeleteTool = (tool) => {
    setToolToDelete(tool);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (toolToDelete) {
      try {
        await deleteTool(toolToDelete.id);
        setIsDeleteModalOpen(false);
        setToolToDelete(null);
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center p-8 min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="bg-base-200">
      <div className="container mx-auto p-4 bg-base-200 text-base-content min-h-screen">
        {/* Header with Admin Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-center md:text-left">
            Eklenti Marketi
          </h1>

          <div className="flex gap-2 mt-4 md:mt-0">
            {isAdmin ? (
              <>
                <button
                  className="btn btn-primary gap-2"
                  onClick={() => {
                    setCurrentTool(null);
                    setIsFormOpen(true);
                  }}
                >
                  <FaPlus size={18} />
                  Yeni Ekle
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FaSearch size={16} /> Ara
              </span>
            </label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Program veya eklenti ara..."
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <FaFilter size={14} /> Kategori
              </span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="all">Tümü</option>
              <option value="free">Ücretsiz</option>
              <option value="paid">Ücretli</option>
              <option value="software">Yazılımlar</option>
              <option value="plugin">Eklentiler</option>
              <option value="preset">Hazır Şablonlar</option>
              <option value="davinci-resolve">DaVinci Resolve</option>
              <option value="premiere-pro">Premiere Pro</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <GoSortAsc size={20} /> Sıralama
              </span>
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="rating">Puanlamaya Göre</option>
              <option value="name">İsme Göre</option>
              <option value="price">Fiyata Göre</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="badge badge-neutral mb-4">
          {data?.total_count || 0} sonuç bulundu
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error p-4 shadow-lg max-w-lg mx-auto mb-6">
            <IoAlertCircle className="stroke-current flex-shrink-0 h-6 w-6" />
            <span>Hata: {error}</span>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.items.map((item, index) => (
            <div
              key={item.id}
              className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                item.price === 0
                  ? "border-success/30 hover:border-success"
                  : "border-info/30 hover:border-info"
              } hover:scale-[1.02] ${
                animateResults ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="card-body p-5">
                {/* Admin Kontrolleri - Hover'da görünür */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2 opacity-100 transition-all duration-300">
                    <button
                      className="btn btn-circle btn-xs btn-ghost bg-base-200 hover:bg-base-300"
                      onClick={() => handleEditTool(item)}
                      title="Düzenle"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-circle btn-xs btn-ghost bg-red-500 hover:bg-error hover:text-white"
                      onClick={() => handleDeleteTool(item)}
                      title="Sil"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}

                {/* Üst Kısım: Logo, Başlık ve Fiyat */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Logo */}
                  {item.icon && (
                    <div className="avatar">
                      <div
                        className={`w-12 h-12 rounded-lg bg-base-200 transition-all duration-300 ${
                          item.price === 0
                            ? "hover:bg-success/10"
                            : "hover:bg-info/10"
                        }`}
                      >
                        <img
                          src={item.icon}
                          alt={`${item.name}`}
                          className="object-contain p-1"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/48?text=" +
                              item.name.charAt(0);
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Başlık ve Yayıncı */}
                  <div className="flex-1">
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="text-xs opacity-70">{item.publisher}</p>
                  </div>

                  {/* Fiyat */}
                  <div>
                    <span
                      className={`badge ${
                        item.price === 0 ? "badge-success" : "badge-info"
                      } badge-lg`}
                    >
                      {item.price === 0 ? "Ücretsiz" : `${item.price}$`}
                    </span>
                  </div>
                </div>

                {/* Kategori ve Puan */}
                <div className="flex gap-2 mb-3">
                  <span className="badge badge-outline">
                    {item.category === "software"
                      ? "Yazılım"
                      : item.category === "plugin"
                      ? "Eklenti"
                      : "Şablon"}
                  </span>

                  {/* Puan */}
                  <div className="badge badge-warning gap-1">
                    <FaStar size={12} />
                    <span>{item.rating}</span>
                  </div>

                  {/* Versiyon */}
                  {item.version && (
                    <span className="badge badge-ghost">{item.version}</span>
                  )}
                </div>

                {/* Açıklama */}
                <p className="text-sm mb-4 line-clamp-2 bg-base-200/50 p-2 rounded">
                  {item.description}
                </p>

                {/* Özellikler (Kompakt) */}
                {item.features && item.features.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="badge badge-sm badge-ghost hover:bg-base-300 transition-colors duration-300"
                        >
                          {feature}
                        </span>
                      ))}
                      {item.features.length > 3 && (
                        <span className="badge badge-sm badge-ghost hover:bg-base-300 transition-colors duration-300">
                          +{item.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* İki Sütuna Bölünmüş Alt Kısım */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Uyumlu Yazılımlar */}
                  {item.compatibleWith && item.compatibleWith.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 text-center">
                        Uyumlu Yazılımlar
                      </p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {item.compatibleWith.map((sw) => (
                          <div key={sw} className="tooltip" data-tip={sw}>
                            <img
                              src={`./apps/programs/${sw}.png`}
                              alt={sw}
                              className={`w-8 h-8 rounded bg-base-200 p-1 transition-all duration-300 hover:scale-110 ${
                                item.price === 0
                                  ? "hover:bg-success/20"
                                  : "hover:bg-info/20"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Platformlar */}
                  {item.platform && item.platform.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 text-center">
                        Platformlar
                      </p>
                      <div className="flex flex-wrap justify-center gap-1">
                        {item.platform.map((platform) => (
                          <div
                            key={platform}
                            className="tooltip"
                            data-tip={platform}
                          >
                            <img
                              src={`./apps/platforms/${platform}.png`}
                              alt={platform}
                              className={`w-8 h-8 rounded bg-base-200 p-1 transition-all duration-300 hover:scale-110 ${
                                item.price === 0
                                  ? "hover:bg-success/20"
                                  : "hover:bg-info/20"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Buton */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-sm w-full ${
                    item.price === 0 ? "btn-success" : "btn-info"
                  } hover:brightness-110 transition-all duration-300 hover:shadow`}
                >
                  Sitesine Git
                </a>
              </div>
            </div>
          ))}
        </div>

        {data?.items.length === 0 && (
          <div className="alert alert-info shadow-lg my-10 max-w-lg mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Arama kriterlerinize uygun sonuç bulunamadı.</span>
          </div>
        )}

        {/* Tool Form Modal */}
        {isFormOpen && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {currentTool ? "Aracı Düzenle" : "Yeni Araç Ekle"}
              </h3>
              <ToolForm
                initialData={currentTool}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setCurrentTool(null);
                }}
              />
            </div>
            <form method="dialog" className="modal-backdrop">
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setCurrentTool(null);
                }}
              >
                close
              </button>
            </form>
          </dialog>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Aracı Sil</h3>
              <p>
                "<strong>{toolToDelete?.name}</strong>" aracını silmek
                istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setToolToDelete(null);
                  }}
                >
                  İptal
                </button>
                <button className="btn btn-error" onClick={confirmDelete}>
                  Sil
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setToolToDelete(null);
                }}
              >
                close
              </button>
            </form>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default FreeExtensions;
