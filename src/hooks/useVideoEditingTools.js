import { useState, useEffect, useRef } from "react";

/**
 * Hook to fetch video editing software and plugins data
 * Optimize edilmiş versiyonda gereksiz data çekimleri engellenmiştir
 *
 * @param {string} query - Search query
 * @param {string} category - Filter by category (software, plugin, free, paid, etc.)
 * @param {Object} options - Additional options
 * @returns {Object} { data, loading, error, refetch }
 */
export const useVideoEditingTools = (
  query = "",
  category = "all",
  options = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Son çağrılan parametreleri izleyen ref
  const prevParams = useRef({ query, category, options });

  // Veri tabanı (genellikle API'den gelecek, şimdilik mock data)
  const videoEditingDatabase = [
    // Video Editing Software - Free
    {
      id: "davinci-resolve",
      name: "DaVinci Resolve",
      description:
        "Professional video editing, color correction, visual effects, and audio post-production, all in one software.",
      category: "software",
      pricingType: "freemium", // Free version available with paid Studio version
      price: 0,
      publisher: "Blackmagic Design",
      version: "18.5",
      platform: ["Windows", "macOS", "Linux"],
      features: [
        "Video Editing",
        "Color Correction",
        "Visual Effects",
        "Audio Post",
        "Motion Graphics",
      ],
      rating: 4.8,
      url: "https://www.blackmagicdesign.com/products/davinciresolve/",
      icon: "https://www.blackmagicdesign.com/favicon.ico",
      tags: ["professional", "all-in-one", "color grading"],
    },
    {
      id: "hitfilm-express",
      name: "HitFilm Express",
      description:
        "Free video editing and visual effects software with professional-grade features.",
      category: "software",
      pricingType: "freemium",
      price: 0,
      publisher: "FXhome",
      version: "2022.1",
      platform: ["Windows", "macOS"],
      features: ["Video Editing", "Visual Effects", "Compositing"],
      rating: 4.6,
      url: "https://fxhome.com/product/hitfilm-express",
      icon: "https://fxhome.com/favicon.ico",
      tags: ["free", "effects", "compositing"],
    },
    {
      id: "kdenlive",
      name: "Kdenlive",
      description:
        "Open-source video editing software with professional features.",
      category: "software",
      pricingType: "free",
      price: 0,
      publisher: "KDE",
      version: "23.04.0",
      platform: ["Windows", "macOS", "Linux"],
      features: ["Video Editing", "Audio Editing", "Transitions", "Effects"],
      rating: 4.4,
      url: "https://kdenlive.org/",
      icon: "https://kdenlive.org/wp-content/uploads/2016/11/favicon.png",
      tags: ["open-source", "free", "multi-platform"],
    },
    {
      id: "shotcut",
      name: "Shotcut",
      description: "Free, open-source, cross-platform video editor.",
      category: "software",
      pricingType: "free",
      price: 0,
      publisher: "Meltytech, LLC",
      version: "23.01.31",
      platform: ["Windows", "macOS", "Linux"],
      features: ["Video Editing", "Audio Editing", "Keyframes", "Effects"],
      rating: 4.3,
      url: "https://www.shotcut.org/",
      icon: "https://www.shotcut.org/favicon.ico",
      tags: ["open-source", "free", "cross-platform"],
    },
    {
      id: "openshot",
      name: "OpenShot",
      description:
        "Free and open-source video editor for Linux, Mac, and Windows.",
      category: "software",
      pricingType: "free",
      price: 0,
      publisher: "OpenShot Studios, LLC",
      version: "3.1.1",
      platform: ["Windows", "macOS", "Linux"],
      features: ["Video Editing", "Animation", "Transitions", "3D Effects"],
      rating: 4.1,
      url: "https://www.openshot.org/",
      icon: "https://www.openshot.org/static/favicon.ico",
      tags: ["beginner-friendly", "open-source", "free"],
    },
    {
      id: "olive",
      name: "Olive",
      description:
        "Free non-linear video editor aiming to provide a fully-featured alternative to high-end professional video editing software.",
      category: "software",
      pricingType: "free",
      price: 0,
      publisher: "Olive Team",
      version: "0.1.2",
      platform: ["Windows", "macOS", "Linux"],
      features: ["Video Editing", "Audio Editing", "Effects"],
      rating: 4.0,
      url: "https://www.olivevideoeditor.org/",
      icon: "https://www.olivevideoeditor.org/favicon.ico",
      tags: ["open-source", "free", "professional"],
    },

    // Video Editing Software - Paid
    {
      id: "adobe-premiere-pro",
      name: "Adobe Premiere Pro",
      description:
        "Industry-leading video editing software for film, TV, and web.",
      category: "software",
      pricingType: "subscription",
      price: 20.99, // Monthly subscription price in USD
      publisher: "Adobe Inc.",
      version: "23.5",
      platform: ["Windows", "macOS"],
      features: [
        "Video Editing",
        "Audio Editing",
        "Color Correction",
        "Motion Graphics",
        "Effects",
      ],
      rating: 4.7,
      url: "https://www.adobe.com/products/premiere.html",
      icon: "https://www.adobe.com/content/dam/cc/icons/premiere.svg",
      tags: ["professional", "industry-standard", "creative cloud"],
    },
    {
      id: "final-cut-pro",
      name: "Final Cut Pro",
      description: "Apple's professional video editing software for macOS.",
      category: "software",
      pricingType: "one-time",
      price: 299.99, // One-time purchase price in USD
      publisher: "Apple Inc.",
      version: "10.6.8",
      platform: ["macOS"],
      features: [
        "Video Editing",
        "Color Grading",
        "Motion Graphics",
        "Audio Editing",
      ],
      rating: 4.8,
      url: "https://www.apple.com/final-cut-pro/",
      icon: "https://www.apple.com/v/final-cut-pro/m/images/overview/icon_fcpx__dhhfurlygm6q_large.png",
      tags: ["mac-only", "professional", "apple-ecosystem"],
    },
    {
      id: "vegas-pro",
      name: "VEGAS Pro",
      description: "Professional video and audio editing software.",
      category: "software",
      pricingType: "one-time",
      price: 399.99, // One-time purchase price in USD
      publisher: "VEGAS Creative Software",
      version: "20",
      platform: ["Windows"],
      features: [
        "Video Editing",
        "Audio Editing",
        "DVD Authoring",
        "Streaming",
      ],
      rating: 4.5,
      url: "https://www.vegascreativesoftware.com/us/vegas-pro/",
      icon: "https://www.vegascreativesoftware.com/favicon.ico",
      tags: ["windows-only", "professional", "comprehensive"],
    },

    // Free Plugins for DaVinci Resolve
    {
      id: "resolve-fx-beauty",
      name: "Beauty FX",
      description:
        "Free beauty and skin enhancing effects for DaVinci Resolve.",
      category: "plugin",
      pricingType: "free",
      price: 0,
      publisher: "Blackmagic Design",
      version: "18.0",
      compatibleWith: ["davinci-resolve"],
      features: ["Skin Smoothing", "Color Enhancement", "Face Refinement"],
      rating: 4.7,
      url: "https://www.blackmagicdesign.com/products/davinciresolve/resolvefx",
      icon: "https://www.blackmagicdesign.com/favicon.ico",
      tags: ["free", "beauty", "enhancement"],
    },
    {
      id: "davinci-neural-engine",
      name: "Neural Engine FX",
      description:
        "Free neural network-based effects and enhancements for DaVinci Resolve.",
      category: "plugin",
      pricingType: "free",
      price: 0,
      publisher: "Blackmagic Design",
      version: "18.0",
      compatibleWith: ["davinci-resolve"],
      features: ["AI Face Refinement", "Object Removal", "Super Scale"],
      rating: 4.8,
      url: "https://www.blackmagicdesign.com/products/davinciresolve/resolvefx",
      icon: "https://www.blackmagicdesign.com/favicon.ico",
      tags: ["free", "AI", "neural-network"],
    },

    // Free Plugins for Premiere Pro
    {
      id: "premiere-pro-auto-reframe",
      name: "Auto Reframe",
      description:
        "Free Adobe Premiere Pro plugin that automatically reframes videos for different aspect ratios.",
      category: "plugin",
      pricingType: "free",
      price: 0,
      publisher: "Adobe Inc.",
      version: "23.0",
      compatibleWith: ["adobe-premiere-pro"],
      features: ["Auto Reframing", "Smart Cropping", "Aspect Ratio Adjustment"],
      rating: 4.6,
      url: "https://helpx.adobe.com/premiere-pro/using/auto-reframe.html",
      icon: "https://www.adobe.com/content/dam/cc/icons/premiere.svg",
      tags: ["free", "reframing", "social media"],
    },
    {
      id: "film-impact-transitions",
      name: "Film Impact Transitions (Free Pack)",
      description: "Free transitions pack for Adobe Premiere Pro.",
      category: "plugin",
      pricingType: "free",
      price: 0,
      publisher: "Film Impact",
      version: "6.0",
      compatibleWith: ["adobe-premiere-pro"],
      features: ["Video Transitions", "Motion Effects", "Presets"],
      rating: 4.4,
      url: "https://www.filmimpact.net/free-transitions/",
      icon: "https://www.filmimpact.net/wp-content/uploads/2019/07/cropped-favicon-100x100.png",
      tags: ["free", "transitions", "effects"],
    },

    // Free Effects and Presets
    {
      id: "motion-array-free",
      name: "Motion Array Free Templates",
      description:
        "Free templates, presets and effects for various video editing software.",
      category: "preset",
      pricingType: "free",
      price: 0,
      publisher: "Motion Array",
      version: "2023",
      compatibleWith: [
        "adobe-premiere-pro",
        "davinci-resolve",
        "final-cut-pro",
        "after-effects",
      ],
      features: ["Templates", "Presets", "Effects", "Transitions"],
      rating: 4.5,
      url: "https://motionarray.com/browse/free/",
      icon: "https://motionarray.com/favicon.ico",
      tags: ["free", "templates", "presets"],
    },
    {
      id: "rocketstock-free",
      name: "RocketStock Free Video Assets",
      description: "Free video elements, templates, and effects.",
      category: "preset",
      pricingType: "free",
      price: 0,
      publisher: "RocketStock",
      version: "2023",
      compatibleWith: [
        "adobe-premiere-pro",
        "after-effects",
        "davinci-resolve",
      ],
      features: ["Video Elements", "Templates", "Effects", "Sound Effects"],
      rating: 4.3,
      url: "https://www.rocketstock.com/free-after-effects-templates/",
      icon: "https://www.rocketstock.com/favicon.ico",
      tags: ["free", "templates", "assets"],
    },

    // Free Visual Effects Software
    {
      id: "natron",
      name: "Natron",
      description:
        "Open-source compositing software for visual effects and motion graphics.",
      category: "software",
      pricingType: "free",
      price: 0,
      publisher: "Natron Community",
      version: "2.5.0",
      platform: ["Windows", "macOS", "Linux"],
      features: ["Compositing", "Keying", "Rotoscoping", "Tracking"],
      rating: 4.2,
      url: "https://natrongithub.github.io/",
      icon: "https://natrongithub.github.io/favicon.ico",
      tags: ["open-source", "free", "node-based"],
    },
    {
      id: "blender",
      name: "Blender",
      description:
        "Free and open-source 3D creation software with video editing capabilities.",
      category: "software",
      pricingType: "free",
      price: 0,
      publisher: "Blender Foundation",
      version: "3.6",
      platform: ["Windows", "macOS", "Linux"],
      features: [
        "3D Modeling",
        "Video Editing",
        "Animation",
        "VFX",
        "Compositing",
      ],
      rating: 4.7,
      url: "https://www.blender.org/",
      icon: "https://www.blender.org/favicon.ico",
      tags: ["open-source", "free", "3D", "all-in-one"],
    },
  ];

  // Parametrelerin değişip değişmediğini kontrol etme
  const paramsChanged = () => {
    const optSort = options.sort || "";
    const optLimit = options.limit || 0;
    const optOffset = options.offset || 0;

    const prevSort = prevParams.current.options.sort || "";
    const prevLimit = prevParams.current.options.limit || 0;
    const prevOffset = prevParams.current.options.offset || 0;

    if (
      query !== prevParams.current.query ||
      category !== prevParams.current.category ||
      optSort !== prevSort ||
      optLimit !== prevLimit ||
      optOffset !== prevOffset
    ) {
      prevParams.current = { query, category, options: { ...options } };
      return true;
    }

    return false;
  };

  // Veri filtreleme fonksiyonu
  const filterData = () => {
    let filteredData = [...videoEditingDatabase];

    // Arama sorgusuna göre filtreleme
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          (item.features &&
            item.features.some((feature) =>
              feature.toLowerCase().includes(lowerQuery)
            ))
      );
    }

    // Kategoriye göre filtreleme
    if (category && category !== "all") {
      if (category === "free") {
        filteredData = filteredData.filter((item) => item.price === 0);
      } else if (category === "paid") {
        filteredData = filteredData.filter((item) => item.price > 0);
      } else if (category === "software") {
        filteredData = filteredData.filter(
          (item) => item.category === "software"
        );
      } else if (category === "plugin") {
        filteredData = filteredData.filter(
          (item) => item.category === "plugin"
        );
      } else if (category === "preset") {
        filteredData = filteredData.filter(
          (item) => item.category === "preset"
        );
      } else if (category === "davinci-resolve") {
        filteredData = filteredData.filter(
          (item) =>
            item.id === "davinci-resolve" ||
            (item.compatibleWith &&
              item.compatibleWith.includes("davinci-resolve"))
        );
      } else if (category === "premiere-pro") {
        filteredData = filteredData.filter(
          (item) =>
            item.id === "adobe-premiere-pro" ||
            (item.compatibleWith &&
              item.compatibleWith.includes("adobe-premiere-pro"))
        );
      }
    }

    // Sıralama
    if (options.sort) {
      if (options.sort === "rating") {
        filteredData.sort((a, b) => b.rating - a.rating);
      } else if (options.sort === "name") {
        filteredData.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sort === "price") {
        filteredData.sort((a, b) => a.price - b.price);
      }
    }

    // Sayfalama
    if (options.limit) {
      const startIndex = options.offset || 0;
      filteredData = filteredData.slice(startIndex, startIndex + options.limit);
    }

    return {
      total_count: filteredData.length,
      items: filteredData,
    };
  };

  useEffect(() => {
    // Parametreler değişmediyse gereksiz render önleme
    if (!paramsChanged() && data) {
      return;
    }

    setLoading(true);

    // Daha gerçekçi bir API çağrısı simülasyonu
    const timeoutId = setTimeout(() => {
      try {
        const filteredData = filterData();
        setData(filteredData);
        setError(null);
      } catch (err) {
        setError("Veri çekme hatası: " + (err.message || "Bilinmeyen hata"));
        setData({ total_count: 0, items: [] });
      } finally {
        setLoading(false);
      }
    }, 300); // Network gecikmesi

    // Cleanup
    return () => clearTimeout(timeoutId);
  }, [query, category, options.sort, options.limit, options.offset]);

  // Manuel veri yenileme fonksiyonu
  const refetch = () => {
    setLoading(true);

    setTimeout(() => {
      try {
        const filteredData = filterData();
        setData(filteredData);
        setError(null);
      } catch (err) {
        setError("Veri yenileme hatası: " + (err.message || "Bilinmeyen hata"));
        setData({ total_count: 0, items: [] });
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return { data, loading, error, refetch };
};

export default useVideoEditingTools;
