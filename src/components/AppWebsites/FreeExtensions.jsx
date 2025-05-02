import React, { useState, useEffect } from "react";
import { useFirebaseVideoTools } from "../../hooks/useFirebaseVideoTools";
import { useAuth } from "../../hooks/useAuth";
import ToolForm from "../../components/ToolForm/ToolForm";
import Login from "../../pages/Login/Login";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import { GoSortAsc } from "react-icons/go";
import { FaStar } from "react-icons/fa6";
import { IoAlertCircle } from "react-icons/io5";

const FreeExtensions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("rating");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);

  const { user, isAdmin, login, logout, error: authError } = useAuth();

  // Firebase hook with custom options
  const { data, loading, error, addTool, updateTool, deleteTool } =
    useFirebaseVideoTools(searchQuery, category, { sort, limit: 20 });

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {data?.items.map((item) => (
            <div
              key={item.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 mt-5"
            >
              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    className="btn btn-circle btn-sm btn-ghost"
                    onClick={() => handleEditTool(item)}
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    className="btn btn-circle btn-sm btn-ghost text-error"
                    onClick={() => handleDeleteTool(item)}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              )}

              <div
                className={`card-body rounded-md border-2 ${
                  item.price === 0 ? "border-success" : "border-info"
                }`}
              >
                <span
                  className={`${
                    item.price === 0
                      ? "bg-success text-slate-800 font-medium"
                      : "bg-info text-slate-800 font-medium"
                  } indicator-top badge badge-primary -mt-10`}
                >
                  {item.price === 0 ? "Ücretsiz" : `${item.price}$`}
                </span>
                <div className="flex items-center mb-3">
                  {item.icon && (
                    <div className="avatar mr-3">
                      <div className="w-16 h-16 rounded-xl">
                        <img
                          src={item.icon}
                          alt={`${item.name} logo`}
                          className="object-contain"
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
                  <div>
                    <h2 className="card-title">
                      {item.name} {item.version}
                    </h2>
                    <div className="text-sm opacity-70">{item.publisher}</div>
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`badge ${
                      item.price === 0 ? "badge-success" : "badge-info"
                    }`}
                  >
                    {item.price === 0 ? "Ücretsiz" : `${item.price}$`}
                  </span>

                  <span className="badge badge-outline">
                    {item.category === "software"
                      ? "Yazılım"
                      : item.category === "plugin"
                      ? "Eklenti"
                      : "Şablon"}
                  </span>

                  <span className="badge badge-warning gap-1">
                    <div className="flex">
                      {[...Array(Math.round(item.rating))].map((_, i) => (
                        <FaStar
                          key={i}
                          size={12}
                          fill="currentColor"
                          stroke="none"
                        />
                      ))}
                    </div>
                    <span className="text-xs opacity-80">({item.rating})</span>
                  </span>
                </div>
                <p className="text-md opacity-85 mb-3 line-clamp-2 bg-base-300 p-2 rounded-md">
                  {item.description}
                </p>
                {item.features && (
                  <div className="mb-3">
                    <h4 className="text-md font-semibold opacity-80 mb-1">
                      Özellikler:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="badge badge-ghost badge-sm">
                          {feature}
                        </span>
                      ))}
                      {item.features.length > 3 && (
                        <span className="badge badge-ghost badge-sm">
                          +{item.features.length - 3} daha
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div className="mx-auto">
                  {item.compatibleWith && (
                    <div className="text-md opacity-80 mb-3">
                      <span className="font-semibold">
                        Uyumlu Olduğu Yazılımlar:
                      </span>{" "}
                      <div className="flex flex-row gap-2 justify-center">
                        {item.compatibleWith.map((sw) => (
                          <img
                            src={`./apps/programs/${sw}.png`}
                            alt={sw}
                            className={`w-10 h-10 bg-base-200 p-1 rounded-md transition-all duration-300 hover:scale-105 cursor-pointer ${
                              item.price === 0
                                ? "hover:bg-success"
                                : "hover:bg-info"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mx-auto">
                  <div className="card-actions mb-2 text-md opacity-80">
                    <span className="font-semibold">
                      Uyumlu Olduğu Platformlar:
                    </span>{" "}
                  </div>
                  <div className="card-actions mb-2">
                    <div className="flex flex-row gap-1">
                      {item.platform.map((i) => (
                        <img
                          src={`./apps/platforms/${i}.png`}
                          alt={i}
                          className={`w-14 h-14 bg-base-200 p-1 rounded-md transition-all duration-300 hover:scale-105 cursor-pointer ${
                            item.price === 0
                              ? "hover:bg-success"
                              : "hover:bg-info"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn ${
                    item.price === 0
                      ? "btn-success text-md"
                      : "btn-info text-md"
                  }`}
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
