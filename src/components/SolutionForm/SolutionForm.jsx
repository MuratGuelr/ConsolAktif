import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

// Define categories - this could also come from a config file or Firestore itself
const availableCategories = [
  "Genel",
  "Teknik Sorun",
  "Sorun Giderme",
  "Nasıl Yapılır",
  "Ürün Geri Bildirimi",
  "Diğer",
];

const SolutionForm = ({ userEmail, solutionId, onFormSubmit }) => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(availableCategories[0]); // Default to first category
  const [tags, setTags] = useState(""); // Comma-separated tags
  const [showVideoLink, setShowVideoLink] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isAdmin = userEmail === import.meta.env.VITE_ADMIN_MAILS;
  const isEditMode = !!solutionId;

  useEffect(() => {
    if (isEditMode && isAdmin) {
      const fetchSolutionData = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, "solutions", solutionId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || "");
            setImageUrl(data.imageUrl || "");
            setShortDescription(data.shortDescription || "");
            setDescription(data.description || "");
            setCategory(data.category || availableCategories[0]);
            setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
            setShowVideoLink(!!data.videoLink);
            setVideoLink(data.videoLink || "");
          } else {
            setError("Düzenlenecek çözüm bulunamadı.");
          }
        } catch (err) {
          setError("Çözüm verileri yüklenirken hata oluştu.");
          console.error(err);
        }
        setIsLoading(false);
      };
      fetchSolutionData();
    }
  }, [solutionId, isEditMode, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setError("Yetkisiz işlem.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const solutionData = {
      title,
      imageUrl,
      shortDescription,
      description,
      category,
      tags: tagsArray,
      videoLink: showVideoLink ? videoLink : null,
      authorEmail: userEmail,
      ...(isEditMode
        ? { updatedAt: serverTimestamp() }
        : { createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
    };

    try {
      if (isEditMode) {
        const solutionRef = doc(db, "solutions", solutionId);
        await updateDoc(solutionRef, solutionData);
        setSuccessMessage("Çözüm başarıyla güncellendi!");
      } else {
        await addDoc(collection(db, "solutions"), solutionData);
        setSuccessMessage("Çözüm başarıyla eklendi!");
        setTitle("");
        setImageUrl("");
        setShortDescription("");
        setDescription("");
        setCategory(availableCategories[0]);
        setTags("");
        setShowVideoLink(false);
        setVideoLink("");
      }
      if (onFormSubmit) onFormSubmit();
    } catch (err) {
      setError(
        `Çözüm ${isEditMode ? "güncellenirken" : "eklenirken"} hata oluştu: ${
          err.message
        }`
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin && isEditMode) {
    return (
      <p className="text-error text-center p-4">
        Bu çözümü düzenleme yetkiniz yok.
      </p>
    );
  }
  if (!isAdmin && !isEditMode) {
    return (
      <p className="text-error text-center p-4">Çözüm ekleme yetkiniz yok.</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-4 md:p-6 bg-base-200 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        {isEditMode ? "Çözümü Düzenle" : "Yeni Çözüm Ekle"}
      </h2>

      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success shadow-lg">
          <div>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      <div className="form-control">
        <label className="label">
          <span className="label-text">Başlık</span>
        </label>
        <input
          type="text"
          placeholder="Çözüm Başlığı"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Görsel URL</span>
        </label>
        <input
          type="url"
          placeholder="https://ornek.com/gorsel.jpg"
          className="input input-bordered w-full"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Kategori</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Etiketler (virgülle ayrılmış)</span>
        </label>
        <input
          type="text"
          placeholder="örn: teknoloji, hata, güncelleme"
          className="input input-bordered w-full"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Kısa Açıklama</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full h-24"
          placeholder="Çözümün kısa bir özeti..."
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Tam Açıklama (Markdown destekli)</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full h-48"
          placeholder="Çözümün detaylı açıklaması..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Video Bağlantısı Ekle/Düzenle?</span>
          <input
            type="checkbox"
            checked={showVideoLink}
            onChange={(e) => setShowVideoLink(e.target.checked)}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>

      {showVideoLink && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Video Bağlantısı</span>
          </label>
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            className="input input-bordered w-full"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading || (!isAdmin && isEditMode && !solutionId)}
      >
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : isEditMode ? (
          "Çözümü Güncelle"
        ) : (
          "Çözüm Ekle"
        )}
      </button>
    </form>
  );
};

export default SolutionForm;
