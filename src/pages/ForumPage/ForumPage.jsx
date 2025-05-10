import React, { useState, useEffect, useMemo } from "react";
import SolutionCard from "../../components/SolutionCard/SolutionCard";
import SliderCard from "../../components/SliderCard/SliderCard";
import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  limit,
} from "firebase/firestore";
import { Link } from "react-router-dom"; // For admin link
import useGetUser from "../../hooks/useGetUser"; // For admin link conditional rendering
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaExclamationCircle,
} from "react-icons/fa"; // Added icons
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Define categories - this should ideally match those in SolutionForm.jsx
const availableCategories = [
  "Tüm Kategoriler",
  "Genel",
  "Teknik Sorun",
  "Sorun Giderme",
  "Nasıl Yapılır",
  "Ürün Geri Bildirimi",
  "Diğer",
];

const ForumPage = () => {
  const [allSolutions, setAllSolutions] = useState([]);
  const [sliderSolutions, setSliderSolutions] = useState([]); // State for slider solutions
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSlider, setIsLoadingSlider] = useState(true); // Loading state for slider
  const [error, setError] = useState(null);
  const { user } = useGetUser(); // For admin link
  const isAdmin = user && user.email === import.meta.env.VITE_ADMIN_MAILS;

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("updatedAt_desc"); // Default sort by updatedAt desc
  const [selectedCategory, setSelectedCategory] = useState(
    availableCategories[0]
  ); // Default to 'All Categories'
  const [selectedTag, setSelectedTag] = useState(""); // Single tag for now

  // Fetch solutions for the main grid (filtered and sorted)
  useEffect(() => {
    setIsLoading(true);
    let q = collection(db, "solutions");

    if (selectedCategory && selectedCategory !== "Tüm Kategoriler") {
      q = query(q, where("category", "==", selectedCategory));
    }
    if (selectedTag) {
      q = query(q, where("tags", "array-contains", selectedTag));
    }

    // Determine orderBy field and direction
    let orderByField = "updatedAt"; // Default
    let orderByDirection = "desc";
    if (sortOrder === "createdAt_asc") {
      orderByField = "createdAt";
      orderByDirection = "asc";
    } else if (sortOrder === "createdAt_desc") {
      orderByField = "createdAt";
      orderByDirection = "desc";
    } else if (sortOrder === "updatedAt_asc") {
      orderByField = "updatedAt";
      orderByDirection = "asc";
    }

    q = query(q, orderBy(orderByField, orderByDirection));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const solutionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllSolutions(solutionsData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Çözümler çekilirken hata oluştu: ", err);
        setError(
          "Çözümler yüklenemedi. Lütfen teknik destek ile iletişime geçin."
        );
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [selectedCategory, selectedTag, sortOrder]);

  // Fetch solutions for the slider (e.g., 5 most recently updated)
  useEffect(() => {
    setIsLoadingSlider(true);
    const sliderQuery = query(
      collection(db, "solutions"),
      orderBy("updatedAt", "desc"),
      limit(5)
    );
    const unsubscribeSlider = onSnapshot(
      sliderQuery,
      (querySnapshot) => {
        const sliderData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSliderSolutions(sliderData);
        setIsLoadingSlider(false);
      },
      (err) => {
        console.error("Slider çözümleri çekilirken hata: ", err);
        // setError for slider could be different or handled silently
        setIsLoadingSlider(false);
      }
    );
    return () => unsubscribeSlider();
  }, []);

  const filteredSolutions = useMemo(() => {
    if (!searchTerm) return allSolutions;
    return allSolutions.filter(
      (solution) =>
        solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.shortDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (solution.tags &&
          solution.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
  }, [allSolutions, searchTerm]);

  // Get all unique tags from solutions for the tag filter (could be a dropdown)
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    allSolutions.forEach((solution) => {
      if (solution.tags && Array.isArray(solution.tags)) {
        solution.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return ["Tüm Etiketler", ...Array.from(tagsSet).sort()];
  }, [allSolutions]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <header className="py-6 mb-8 border-b border-base-300">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-0">
            Forum & Çözümler
          </h1>
          {isAdmin && (
            <Link to="/admin/add-solution" className="btn btn-primary btn-md">
              <FaPlus className="mr-2" /> Yeni Çözüm Ekle
            </Link>
          )}
        </div>
      </header>

      {/* Slider Section */}
      <section className="mb-10">
        {isLoadingSlider && (
          <div className="h-64 sm:h-80 flex justify-center items-center bg-base-200 rounded-xl shadow-lg">
            <span className="loading loading-lg loading-spinner text-primary"></span>
          </div>
        )}
        {!isLoadingSlider && sliderSolutions.length > 0 && (
          <div className="carousel w-full rounded-xl shadow-xl h-64 sm:h-80 bg-neutral overflow-hidden">
            {sliderSolutions.map((sol, index) => (
              <div
                key={sol.id || index}
                id={`slide${index}`}
                className="carousel-item relative w-full"
              >
                <SliderCard solution={sol} />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-3 right-3 sm:left-5 sm:right-5 top-1/2">
                  <a
                    href={`#slide${
                      (index - 1 + sliderSolutions.length) %
                      sliderSolutions.length
                    }`}
                    className="btn btn-circle btn-sm md:btn-md bg-black/30 hover:bg-black/50 border-none text-white"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${(index + 1) % sliderSolutions.length}`}
                    className="btn btn-circle btn-sm md:btn-md bg-black/30 hover:bg-black/50 border-none text-white"
                  >
                    ❯
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoadingSlider && sliderSolutions.length === 0 && (
          <div className="h-64 sm:h-80 flex flex-col justify-center items-center bg-base-200 rounded-xl shadow-lg p-6 text-center">
            <FaExclamationCircle className="text-4xl text-base-content/50 mb-4" />
            <p className="text-xl text-base-content opacity-70">
              Öne çıkan çözüm bulunamadı.
            </p>
            <p className="text-sm text-base-content opacity-50 mt-1">
              Yakında yeni çözümler eklenecektir.
            </p>
          </div>
        )}
      </section>

      {/* Filters Section */}
      <section className="mb-10 p-4 sm:p-6 bg-base-200 rounded-xl shadow-lg">
        <div className="flex items-center mb-5">
          <FaFilter className="text-xl text-primary mr-3" />
          <h2 className="text-2xl font-semibold text-primary">
            Çözümleri Filtrele & Sırala
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Ara</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Başlık, içerik veya etikette ara..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Sırala</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="updatedAt_desc">En Yeni (Güncellenme)</option>
              <option value="updatedAt_asc">En Eski (Güncellenme)</option>
              <option value="createdAt_desc">En Yeni (Oluşturulma)</option>
              <option value="createdAt_asc">En Eski (Oluşturulma)</option>
              {/* Add more like popularity, title etc. later */}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Kategori</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              <span className="label-text font-medium">Etiket</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedTag}
              onChange={(e) =>
                setSelectedTag(
                  e.target.value === "Tüm Etiketler" ? "" : e.target.value
                )
              }
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Solutions Grid Section */}
      <main>
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-xl loading-spinner text-primary"></span>
          </div>
        )}
        {error && (
          <div className="alert alert-error shadow-lg my-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-bold">Bir Hata Oluştu!</h3>
              <div className="text-xs">{error}</div>
            </div>
          </div>
        )}
        {!isLoading && !error && filteredSolutions.length === 0 && (
          <div className="text-center py-20 bg-base-200 rounded-xl shadow-lg">
            <FaExclamationCircle className="text-5xl text-base-content/40 mx-auto mb-6" />
            <p className="text-2xl font-semibold text-base-content opacity-80 mb-2">
              Aradığınız Kriterlere Uygun Çözüm Bulunamadı
            </p>
            <p className="text-base-content opacity-60">
              Lütfen filtrelerinizi değiştirmeyi veya arama teriminizi
              genişletmeyi deneyin.
            </p>
          </div>
        )}
        {!isLoading && !error && filteredSolutions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredSolutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ForumPage;
