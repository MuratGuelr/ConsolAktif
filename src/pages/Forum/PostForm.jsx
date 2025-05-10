import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave, FaImage, FaVideo } from "react-icons/fa";
import useForumPosts from "../../hooks/useForumPosts";
import useAuth from "../../hooks/useAuth";
import Loader from "../../loading/Loader";

const PostForm = () => {
  const { postId } = useParams();
  const isEditMode = !!postId;
  const navigate = useNavigate();

  const { addPost, updatePost, getPostById, categories, isAdmin } =
    useForumPosts();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "Other",
    imageUrl: "",
    hasVideo: false,
    videoUrl: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/forum");
    }
  }, [isAdmin, navigate]);

  // Load post data if in edit mode
  useEffect(() => {
    const fetchPost = async () => {
      if (isEditMode) {
        try {
          const postData = await getPostById(postId);
          if (!postData) {
            throw new Error("Post not found");
          }

          setFormData({
            title: postData.title || "",
            shortDescription: postData.shortDescription || "",
            description: postData.description || "",
            category: postData.category || "Other",
            imageUrl: postData.imageUrl || "",
            hasVideo: !!postData.videoUrl,
            videoUrl: postData.videoUrl || "",
          });

          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [isEditMode, postId, getPostById]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Reset image error when URL changes
    if (name === "imageUrl") {
      setImagePreviewError(false);
    }
  };

  const handleImageError = () => {
    setImagePreviewError(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // Prepare post data
      const postData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl.trim() || null,
        videoUrl: formData.hasVideo ? formData.videoUrl : null,
      };

      let result;
      if (isEditMode) {
        result = await updatePost(postId, postData);
      } else {
        result = await addPost(postData);
      }

      if (result) {
        navigate(isEditMode ? `/forum/post/${postId}` : "/forum");
      } else {
        throw new Error("Failed to save post");
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(isEditMode ? `/forum/post/${postId}` : "/forum");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button onClick={handleCancel} className="btn btn-outline">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Çözüm Düzenle" : "Yeni Çözüm Ekle"}
        </h1>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <p>{error}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-base-100 rounded-lg shadow-lg p-6"
      >
        {/* Title */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium">Başlık*</span>
          </label>
          <input
            type="text"
            name="title"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Category */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium">Kategori*</span>
          </label>
          <select
            name="category"
            className="select select-bordered w-full"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Image URL */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium">Resim URL</span>
          </label>
          <div className="input-group">
            <span className="bg-base-300 px-3 flex items-center">
              <FaImage />
            </span>
            <input
              type="url"
              name="imageUrl"
              className="input input-bordered w-full"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />
          </div>
          <label className="label">
            <span className="label-text-alt">
              Resim için doğrudan URL adresi girin
            </span>
          </label>

          {/* Image Preview */}
          {formData.imageUrl && !imagePreviewError && (
            <div className="mt-2">
              <p className="text-sm mb-1">Önizleme:</p>
              <div className="w-full max-w-xs overflow-hidden rounded-lg border border-base-300">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-auto object-cover"
                  onError={handleImageError}
                />
              </div>
            </div>
          )}

          {formData.imageUrl && imagePreviewError && (
            <div className="text-error text-sm mt-1">
              Resim URL'si geçersiz veya erişilemez.
            </div>
          )}
        </div>

        {/* Short Description */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium">Kısa Açıklama*</span>
          </label>
          <textarea
            name="shortDescription"
            className="textarea textarea-bordered h-20"
            value={formData.shortDescription}
            onChange={handleInputChange}
            required
            maxLength={200}
          ></textarea>
          <label className="label">
            <span className="label-text-alt">
              {formData.shortDescription.length}/200 karakter
            </span>
          </label>
        </div>

        {/* Main Description */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium">Detaylı Açıklama*</span>
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered h-48"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <label className="label">
            <span className="label-text-alt">
              Markdown formatı desteklenmektedir.
            </span>
          </label>
        </div>

        {/* Video URL Toggle */}
        <div className="form-control mb-4">
          <label className="label cursor-pointer">
            <span className="label-text font-medium">Video Ekle</span>
            <input
              type="checkbox"
              name="hasVideo"
              className="toggle toggle-primary"
              checked={formData.hasVideo}
              onChange={handleInputChange}
            />
          </label>
        </div>

        {/* Video URL - Conditional */}
        {formData.hasVideo && (
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-medium">Video URL</span>
            </label>
            <div className="input-group">
              <span className="bg-base-300 px-3 flex items-center">
                <FaVideo />
              </span>
              <input
                type="url"
                name="videoUrl"
                className="input input-bordered w-full"
                placeholder="https://www.youtube.com/embed/..."
                value={formData.videoUrl}
                onChange={handleInputChange}
                required={formData.hasVideo}
              />
            </div>
            <label className="label">
              <span className="label-text-alt">
                YouTube embed URL formatında olmalıdır (örn:
                https://www.youtube.com/embed/VIDEO_ID)
              </span>
            </label>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleCancel}
            disabled={submitting}
          >
            İptal
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${submitting ? "loading" : ""}`}
            disabled={submitting}
          >
            <FaSave className="mr-2" />
            {isEditMode ? "Güncelle" : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
