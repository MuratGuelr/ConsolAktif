import React, { useState, useEffect } from "react";
import { useFirebaseApps } from "../../hooks/useFirebaseApps.js";
import { useAuth } from "../../hooks/useAuth";
import AppForm from "../ToolForm/AppForm.jsx";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCopy,
  FaDownload,
  FaCheck,
} from "react-icons/fa";
import { GoSortAsc } from "react-icons/go";
import { FaStar } from "react-icons/fa6";
import { IoAlertCircle } from "react-icons/io5";
import { toast } from "react-toastify";

const AppMarket = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("popularity");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [animateResults, setAnimateResults] = useState(false);
  const [selectedApps, setSelectedApps] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [prevSearchParams, setPrevSearchParams] = useState({
    query: "",
    category: "",
    sort: "popularity",
  });

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { user, isAdmin } = useAuth();

  // Firebase hook with custom options
  const { data, loading, error, addApp, updateApp, deleteApp } =
    useFirebaseApps(searchQuery, category, { sort, limit: 30 });

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle animation on search parameter changes
  useEffect(() => {
    if (
      searchQuery !== prevSearchParams.query ||
      category !== prevSearchParams.category ||
      sort !== prevSearchParams.sort
    ) {
      setAnimateResults(false);

      setTimeout(() => {
        setAnimateResults(true);
      }, 100);

      setPrevSearchParams({
        query: searchQuery,
        category: category,
        sort: sort,
      });
    }
  }, [searchQuery, category, sort]);

  // Handle form submission for adding/editing apps
  const handleFormSubmit = async (formData) => {
    try {
      if (currentApp) {
        await updateApp(currentApp.id, formData);
        toast.success("Uygulama başarıyla güncellendi");
      } else {
        await addApp(formData);
        toast.success("Uygulama başarıyla eklendi");
      }
      setIsFormOpen(false);
      setCurrentApp(null);
    } catch (err) {
      console.error("Form submission error:", err);
      toast.error("İşlem sırasında hata oluştu");
    }
  };

  // Open edit form with current app data
  const handleEditApp = (app) => {
    setCurrentApp(app);
    setIsFormOpen(true);
  };

  // Handle app deletion
  const handleDeleteApp = (app) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (appToDelete) {
      try {
        await deleteApp(appToDelete.id);
        toast.success("Uygulama başarıyla silindi");
        setIsDeleteModalOpen(false);
        setAppToDelete(null);
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Silme işlemi sırasında hata oluştu");
      }
    }
  };

  // Copy winget command to clipboard
  const copyWingetCommand = (app) => {
    const command = `winget install --id=${app.wingetId}`;
    navigator.clipboard.writeText(command);
    setCopiedId(app.id);
    toast.success(`${app.name} için komut kopyalandı!`);

    // Reset copy indicator after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Toggle app selection for batch installation
  const toggleAppSelection = (app) => {
    if (selectedApps.some((selected) => selected.id === app.id)) {
      setSelectedApps(
        selectedApps.filter((selected) => selected.id !== app.id)
      );
    } else {
      setSelectedApps([...selectedApps, app]);
    }
  };

  // Copy all selected winget commands
  const copyAllSelectedCommands = () => {
    if (selectedApps.length === 0) {
      toast.error("Lütfen önce uygulama seçin");
      return;
    }

    const commands = selectedApps
      .map((app) => `winget install --id=${app.wingetId}`)
      .join(" && ");

    navigator.clipboard.writeText(commands);
    toast.success(`${selectedApps.length} uygulama için komutlar kopyalandı!`);
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
            Windows Uygulama Marketi
          </h1>

          <div className="flex gap-2 mt-4 md:mt-0">
            {selectedApps.length > 0 && (
              <button
                className="btn btn-success gap-2"
                onClick={copyAllSelectedCommands}
              >
                <FaDownload size={18} />
                Seçili {selectedApps.length} Uygulamayı İndir
              </button>
            )}

            {isAdmin && (
              <button
                className="btn btn-primary gap-2"
                onClick={() => {
                  setCurrentApp(null);
                  setIsFormOpen(true);
                }}
              >
                <FaPlus size={18} />
                Yeni Ekle
              </button>
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
              placeholder="Uygulama ara..."
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
              <option value="">Tümü</option>
              <option value="productivity">Verimlilik</option>
              <option value="development">Geliştirme</option>
              <option value="media">Medya</option>
              <option value="utilities">Araçlar</option>
              <option value="gaming">Oyun</option>
              <option value="security">Güvenlik</option>
              <option value="communication">İletişim</option>
              <option value="design">Tasarım</option>
              <option value="education">Eğitim</option>
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
              <option value="popularity">Popülerliğe Göre</option>
              <option value="name">İsme Göre</option>
              <option value="recent">Eklenme Tarihine Göre</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="badge badge-neutral mb-4">
          {data?.total_count || 0} sonuç bulundu
        </div>

        {/* Selected Apps Count */}
        {selectedApps.length > 0 && (
          <div className="badge badge-success mb-4 ml-2">
            {selectedApps.length} uygulama seçildi
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error p-4 shadow-lg max-w-lg mx-auto mb-6">
            <IoAlertCircle className="stroke-current flex-shrink-0 h-6 w-6" />
            <span>Hata: {error}</span>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-start">
          {data?.items.map((app, index) => (
            <div
              key={app.id}
              className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border-2 
                ${
                  selectedApps.some((selected) => selected.id === app.id)
                    ? "border-success border-2"
                    : "border-base-300 hover:border-primary"
                } 
                hover:scale-[1.02] ${
                  animateResults ? "animate-fade-in-up" : "opacity-0"
                }`}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "forwards",
              }}
            >
              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <button
                    className="btn btn-circle btn-ghost btn-xs bg-base-200/70 hover:bg-base-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditApp(app);
                    }}
                    title="Düzenle"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-circle btn-ghost btn-xs bg-red-500/70 hover:bg-error text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteApp(app);
                    }}
                    title="Sil"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}

              {/* Main Card Content */}
              <div
                className="card-body p-4 cursor-pointer"
                onClick={() => toggleAppSelection(app)}
              >
                {/* Selection Indicator */}
                <div className="absolute top-2 left-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      selectedApps.some((selected) => selected.id === app.id)
                        ? "border-success bg-success text-white"
                        : "border-base-300 bg-base-100"
                    }`}
                  >
                    {selectedApps.some(
                      (selected) => selected.id === app.id
                    ) && <FaCheck size={10} />}
                  </div>
                </div>

                {/* App Icon and Name */}
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="avatar group relative">
                    <div className="w-20 h-20 rounded-xl bg-base-200 p-2 transition-all duration-300 hover:bg-primary/10 group-hover:scale-105">
                      <img
                        src={app.icon || "/placeholder-app-icon.png"}
                        alt={app.name}
                        className="object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/80?text=${app.name.charAt(
                            0
                          )}`;
                        }}
                      />
                    </div>
                    {/* Hover tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 absolute top-full  mt-2 p-2 text-start bg-base-300 rounded shadow-lg text-xs w-48 z-20 transition-opacity duration-300 pointer-events-none -left-12">
                      {app.description || `${app.name} uygulaması`}
                    </div>
                  </div>

                  <h2 className="font-semibold text-base">{app.name}</h2>

                  {/* Publisher with rating */}
                  <div className="flex items-center gap-2 text-xs opacity-80">
                    <span>{app.publisher}</span>
                    {app.rating && (
                      <div className="badge badge-warning badge-xs gap-1 h-4">
                        <FaStar size={8} />
                        <span>{app.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {app.category && (
                    <span className="badge badge-sm badge-outline">
                      {app.category}
                    </span>
                  )}
                  {app.free && (
                    <span className="badge badge-sm badge-success">
                      Ücretsiz
                    </span>
                  )}
                </div>

                {/* Winget Command Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyWingetCommand(app);
                  }}
                  className="btn btn-primary btn-sm mt-3 gap-2"
                >
                  {copiedId === app.id ? (
                    <>
                      <FaCheck size={14} />
                      Kopyalandı
                    </>
                  ) : (
                    <>
                      <FaCopy size={14} />
                      Winget Komutu
                    </>
                  )}
                </button>
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

        {/* App Form Modal */}
        {isFormOpen && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                {currentApp ? "Uygulamayı Düzenle" : "Yeni Uygulama Ekle"}
              </h3>
              <AppForm
                initialData={currentApp}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setCurrentApp(null);
                }}
              />
            </div>
            <form method="dialog" className="modal-backdrop">
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setCurrentApp(null);
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
              <h3 className="font-bold text-lg mb-4">Uygulamayı Sil</h3>
              <p>
                "<strong>{appToDelete?.name}</strong>" uygulamasını silmek
                istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setAppToDelete(null);
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
                  setAppToDelete(null);
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

export default AppMarket;
