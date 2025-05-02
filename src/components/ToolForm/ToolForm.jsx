import React, { useState, useEffect } from "react";

const ToolForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "software",
    price: 0,
    publisher: "",
    version: "",
    platform: [],
    features: [],
    rating: 4.0,
    url: "",
    icon: "",
    tags: [],
    compatibleWith: [],
    pricingType: "free",
  });

  const [platformInput, setPlatformInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [compatibleInput, setCompatibleInput] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure arrays
        platform: initialData.platform || [],
        features: initialData.features || [],
        tags: initialData.tags || [],
        compatibleWith: initialData.compatibleWith || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle number conversion
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Platform list handlers
  const addPlatform = () => {
    if (
      platformInput.trim() &&
      !formData.platform.includes(platformInput.trim())
    ) {
      setFormData({
        ...formData,
        platform: [...formData.platform, platformInput.trim()],
      });
      setPlatformInput("");
    }
  };

  const removePlatform = (platform) => {
    setFormData({
      ...formData,
      platform: formData.platform.filter((p) => p !== platform),
    });
  };

  // Feature list handlers
  const addFeature = () => {
    if (
      featureInput.trim() &&
      !formData.features.includes(featureInput.trim())
    ) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    });
  };

  // Tag list handlers
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  // Compatible software handlers
  const addCompatible = () => {
    if (
      compatibleInput.trim() &&
      !formData.compatibleWith.includes(compatibleInput.trim())
    ) {
      setFormData({
        ...formData,
        compatibleWith: [...formData.compatibleWith, compatibleInput.trim()],
      });
      setCompatibleInput("");
    }
  };

  const removeCompatible = (software) => {
    setFormData({
      ...formData,
      compatibleWith: formData.compatibleWith.filter((s) => s !== software),
    });
  };

  // Handle price type changes
  const handlePriceTypeChange = (type) => {
    setFormData({
      ...formData,
      pricingType: type,
      price: type === "free" ? 0 : formData.price,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Common software options for compatibility
  const softwareOptions = [
    { id: "davinci-resolve", name: "DaVinci Resolve" },
    { id: "adobe-premiere-pro", name: "Adobe Premiere Pro" },
    { id: "final-cut-pro", name: "Final Cut Pro" },
    { id: "after-effects", name: "After Effects" },
  ];

  // Platform options
  const platformOptions = [
    "Windows",
    "macOS",
    "Linux",
    "Web",
    "iOS",
    "Android",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">İsim</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Araç ismi"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Kategorisi</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select select-bordered w-full"
            required
          >
            <option value="software">Yazılım</option>
            <option value="plugin">Eklenti</option>
            <option value="preset">Hazır Şablon</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Açıklama</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Araç hakkında kısa açıklama"
          className="textarea textarea-bordered h-24"
          required
        />
      </div>

      {/* Price Info */}
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Fiyatlandırma:</span>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="free"
              name="pricingType"
              className="radio radio-primary"
              checked={formData.pricingType === "free"}
              onChange={() => handlePriceTypeChange("free")}
            />
            <label htmlFor="free">Ücretsiz</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="paid"
              name="pricingType"
              className="radio radio-primary"
              checked={formData.pricingType === "paid"}
              onChange={() => handlePriceTypeChange("paid")}
            />
            <label htmlFor="paid">Ücretli</label>
          </div>
        </div>

        {formData.pricingType === "paid" && (
          <div className="form-control">
            <label className="label">
              <span className="label-text">Fiyat (USD)</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="input input-bordered w-full md:w-1/3"
              required
            />
          </div>
        )}
      </div>

      {/* Publisher & Version */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Geliştiricisi/Yayıncısı</span>
          </label>
          <input
            type="text"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Geliştirici firma veya kişi"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Versiyonu</span>
          </label>
          <input
            type="text"
            name="version"
            value={formData.version}
            onChange={handleChange}
            placeholder="Örn: 1.0.2"
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Platforms */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Platformlar</span>
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <select
            value={platformInput}
            onChange={(e) => setPlatformInput(e.target.value)}
            className="select select-bordered flex-grow"
          >
            <option value="">Platform seçin</option>
            {platformOptions.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addPlatform}
            className="btn btn-primary"
          >
            Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.platform.map((platform, index) => (
            <div key={index} className="badge badge-primary gap-2">
              {platform}
              <button
                type="button"
                onClick={() => removePlatform(platform)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Özellikler</span>
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            placeholder="Yeni özellik"
            className="input input-bordered flex-grow"
          />
          <button
            type="button"
            onClick={addFeature}
            className="btn btn-primary"
          >
            Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="badge badge-secondary gap-2">
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(feature)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Compatible Software */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Uyumlu Olduğu Yazılımlar</span>
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <select
            value={compatibleInput}
            onChange={(e) => setCompatibleInput(e.target.value)}
            className="select select-bordered flex-grow"
          >
            <option value="">Yazılım seçin</option>
            {softwareOptions.map((software) => (
              <option key={software.id} value={software.id}>
                {software.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addCompatible}
            className="btn btn-primary"
          >
            Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.compatibleWith.map((software, index) => (
            <div key={index} className="badge badge-accent gap-2">
              {softwareOptions.find((s) => s.id === software)?.name || software}
              <button
                type="button"
                onClick={() => removeCompatible(software)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Etiketler</span>
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Yeni etiket"
            className="input input-bordered flex-grow"
          />
          <button type="button" onClick={addTag} className="btn btn-primary">
            Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags.map((tag, index) => (
            <div key={index} className="badge badge-info gap-2">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="btn btn-ghost btn-xs btn-circle"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Puanlama (1-5)</span>
        </label>
        <input
          type="range"
          name="rating"
          min="1"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          className="range range-primary"
        />
        <div className="w-full flex justify-between text-xs px-2">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
        <div className="text-center font-bold mt-2">{formData.rating}</div>
      </div>

      {/* URL & Icon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Web Sitesi URL</span>
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">İkon URL</span>
          </label>
          <input
            type="url"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            placeholder="https://example.com/icon.png"
            className="input input-bordered w-full"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-outline">
          İptal
        </button>
        <button type="submit" className="btn btn-primary">
          Kaydet
        </button>
      </div>
    </form>
  );
};

export default ToolForm;
