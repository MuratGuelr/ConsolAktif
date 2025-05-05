import React, { useState, useEffect } from "react";
import { FaSave, FaTimes } from "react-icons/fa";

const AppForm = ({ initialData = null, onSubmit, onCancel }) => {
  // Form verisi için state
  const [formData, setFormData] = useState({
    name: "",
    publisher: "",
    description: "",
    icon: "",
    wingetId: "",
    category: "",
    free: true,
    rating: 0, // Rating 0-5 arası olacak
    popularity: 0, // Popülerlik 0-100 arası
    officialSite: "",
    tags: [],
  });

  // Geçici state'ler (ToolForm'daki gibi)
  const [tagInput, setTagInput] = useState(""); // Yeni etiket girmek için
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Düzenleme modunda formu doldur
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        publisher: initialData.publisher || "",
        description: initialData.description || "",
        icon: initialData.icon || "",
        wingetId: initialData.wingetId || "",
        category: initialData.category || "",
        free: initialData.free !== undefined ? initialData.free : true, // Boolean kontrolü
        rating: initialData.rating || 0,
        popularity: initialData.popularity || 0,
        officialSite: initialData.officialSite || "",
        tags: initialData.tags || [],
      });
    } else {
      // Yeni ekleme modunda formu sıfırla
      setFormData({
        name: "",
        publisher: "",
        description: "",
        icon: "",
        wingetId: "",
        category: "",
        free: true,
        rating: 0,
        popularity: 0,
        officialSite: "",
        tags: [],
      });
    }
    // Form yüklendiğinde inputları temizle
    setTagInput("");
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  // Genel input değişikliklerini yönetme
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;
    if (type === "checkbox") {
      processedValue = checked;
    } else if (type === "number" || type === "range") {
      // Sayısal değerleri Number'a çevir, boşsa 0 ata
      processedValue = value === "" ? 0 : Number(value);
    }

    setFormData({
      ...formData,
      [name]: processedValue,
    });

    // Alan değiştiğinde hatayı temizle
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Etiket ekleme
  const addTag = (e) => {
    // Eğer event objesi varsa (buton tıklaması), default davranışı engelle
    if (e) e.preventDefault();
    const tagToAdd = tagInput.trim();
    if (tagToAdd && !formData.tags.includes(tagToAdd)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagToAdd],
      });
      setTagInput(""); // Input'u temizle
    }
  };

  // Enter tuşu ile etiket ekleme
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Formun submit olmasını engelle
      addTag();
    }
  };

  // Etiket silme
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Uygulama adı gerekli";
    if (!formData.publisher.trim()) newErrors.publisher = "Yayıncı gerekli";
    if (!formData.wingetId.trim()) newErrors.wingetId = "Winget ID gerekli";
    if (formData.wingetId && !formData.wingetId.includes(".")) {
      newErrors.wingetId = "Winget ID formatı hatalı (örn: Firma.Uygulama)";
    }
    if (formData.icon && !formData.icon.startsWith("http")) {
      newErrors.icon = "Geçerli bir URL girin (http:// veya https://)";
    }
    if (formData.officialSite && !formData.officialSite.startsWith("http")) {
      newErrors.officialSite = "Geçerli bir URL girin (http:// veya https://)";
    }
    // Rating ve Popularity sınırları kontrol edilebilir (HTML min/max zaten yapar ama ekstra güvence)
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Puan 0 ile 5 arasında olmalı";
    }
    if (formData.popularity < 0 || formData.popularity > 100) {
      newErrors.popularity = "Popülerlik 0 ile 100 arasında olmalı";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Gönderilecek veriden geçici input state'lerini (newTag vb.) çıkarıyoruz
      // Bu örnekte sadece tagInput var, onu state'de ayrı tuttuğumuz için formData'dan çıkarmaya gerek yok.
      await onSubmit(formData); // Ana componente veriyi gönder
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({
        submit: error.message || "Form gönderilirken bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Kategori seçenekleri
  const categories = [
    { value: "productivity", label: "Verimlilik" },
    { value: "development", label: "Geliştirme" },
    { value: "media", label: "Medya" },
    { value: "utilities", label: "Araçlar" },
    { value: "gaming", label: "Oyun" },
    { value: "security", label: "Güvenlik" },
    { value: "communication", label: "İletişim" },
    { value: "design", label: "Tasarım" },
    { value: "education", label: "Eğitim" },
    // Diğerleri...
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      {" "}
      {/* Ana boşluk */}
      {/* Temel Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Uygulama Adı *</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Örn: Visual Studio Code"
            className={`input input-bordered w-full ${
              errors.name ? "input-error" : ""
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.name && (
            <span className="text-error text-xs mt-1">{errors.name}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Yayıncı *</span>
          </label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Örn: Microsoft"
            className={`input input-bordered w-full ${
              errors.publisher ? "input-error" : ""
            }`}
            disabled={isSubmitting}
            required
          />
          {errors.publisher && (
            <span className="text-error text-xs mt-1">{errors.publisher}</span>
          )}
        </div>
      </div>
      {/* Winget ID */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Winget ID *</span>
          <span className="label-text-alt text-xs">
            Format: Yayıncı.UygulamaAdı
          </span>
        </label>
        <input
          type="text"
          name="wingetId"
          value={formData.wingetId}
          onChange={handleChange}
          placeholder="Örn: Microsoft.VisualStudioCode"
          className={`input input-bordered w-full ${
            errors.wingetId ? "input-error" : ""
          }`}
          disabled={isSubmitting}
          required
        />
        {errors.wingetId && (
          <span className="text-error text-xs mt-1">{errors.wingetId}</span>
        )}
      </div>
      {/* İkon ve Resmi Site */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">İkon URL</span>
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="https://..."
            className={`input input-bordered w-full ${
              errors.icon ? "input-error" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.icon && (
            <span className="text-error text-xs mt-1">{errors.icon}</span>
          )}
          {formData.icon && !errors.icon && (
            <div className="mt-2 flex items-center gap-2">
              <div className="avatar">
                <div className="w-10 h-10 rounded-md bg-base-200 p-1">
                  <img
                    src={formData.icon}
                    alt="İkon Önizleme"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/40x40/png?text=${
                        formData.name?.charAt(0)?.toUpperCase() || "?"
                      }`;
                    }}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <span className="text-xs text-base-content/70">Önizleme</span>
            </div>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Resmi Site URL</span>
          </label>
          <input
            type="text"
            name="officialSite"
            value={formData.officialSite}
            onChange={handleChange}
            placeholder="https://..."
            className={`input input-bordered w-full ${
              errors.officialSite ? "input-error" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.officialSite && (
            <span className="text-error text-xs mt-1">
              {errors.officialSite}
            </span>
          )}
        </div>
      </div>
      {/* Açıklama */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Açıklama</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Uygulama hakkında kısa bilgi..."
          className="textarea textarea-bordered h-24"
          disabled={isSubmitting}
        />
      </div>
      {/* Kategori, Popülerlik ve Ücretsiz Durumu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Kategori</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
            disabled={isSubmitting}
          >
            <option value="">Kategori Seçin...</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Popülerlik (0-100)</span>
          </label>
          <input
            type="number"
            name="popularity"
            value={formData.popularity}
            onChange={handleChange}
            min="0"
            max="100"
            step="1"
            placeholder="75"
            className={`input input-bordered w-full ${
              errors.popularity ? "input-error" : ""
            }`}
            disabled={isSubmitting}
          />
          {errors.popularity && (
            <span className="text-error text-xs mt-1">{errors.popularity}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              name="free"
              checked={formData.free}
              onChange={handleChange}
              className="checkbox checkbox-primary"
              disabled={isSubmitting}
            />
            <span className="label-text font-medium">Ücretsiz Uygulama</span>
          </label>
        </div>
      </div>
      {/* Puanlama (Rating) */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Puan (0-5)</span>
        </label>
        <input
          type="range"
          name="rating"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          className={`range range-primary ${
            errors.rating ? "range-error" : ""
          }`} // DaisyUI range-error yok, alternatif? Belki border ekleyebiliriz?
          disabled={isSubmitting}
        />
        <div className="w-full flex justify-between text-xs px-1 mt-1">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
        <div className="text-center font-semibold mt-1 text-lg">
          {formData.rating.toFixed(1)}
        </div>
        {errors.rating && (
          <span className="text-error text-xs text-center mt-1">
            {errors.rating}
          </span>
        )}
      </div>
      {/* Etiketler (Tags) - ToolForm stili */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Etiketler</span>
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown} // Enter ile ekleme
            placeholder="Yeni etiket ekle (örn: utility)"
            className="input input-bordered flex-grow"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={addTag}
            className="btn btn-primary btn-outline"
            disabled={isSubmitting || !tagInput.trim()}
          >
            Etiket Ekle
          </button>
        </div>
        {/* Eklenmiş etiketler */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 p-2 border border-base-300 rounded-md min-h-[40px]">
            {formData.tags.map((tag) => (
              <div key={tag} className="badge badge-info gap-1 badge-lg">
                {" "}
                {/* Renk seçimi: info, primary, secondary vs. */}
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="btn btn-ghost btn-xs btn-circle"
                  aria-label={`Etiketi kaldır: ${tag}`}
                  disabled={isSubmitting}
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Genel Hata Mesajı */}
      {errors.submit && (
        <div className="alert alert-error p-2 text-sm shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-5 w-5"
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
          <span>{errors.submit}</span>
        </div>
      )}
      {/* Form Butonları (Modal içinde olduğu varsayılarak) */}
      <div className="modal-action mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={isSubmitting}
        >
          <FaTimes className="mr-1" /> İptal
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Kaydediliyor..."
          ) : (
            <>
              {" "}
              <FaSave className="mr-1" /> {initialData ? "Güncelle" : "Kaydet"}{" "}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AppForm;
