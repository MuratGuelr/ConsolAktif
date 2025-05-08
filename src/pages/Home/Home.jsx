// src/pages/Home/Home.jsx
import React, { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import VideoCard from "../../components/VideoCard/VideoCard";
import useGetYoutubeVideos from "../../hooks/useGetYoutubeVideos";
import { Link } from "react-router-dom";
import { featuredAppsList } from "../../data/featuredAppsData"; // Veriyi içe aktar
import AppCard from "../../components/AppCard/AppCard";

const Home = () => {
  useEffect(() => {
    document.title = "ConsolAktif | Anasayfa - Sorunlar & Çözümler";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/logo/logo.png";
    }
  }, []);

  const {
    videos: latestYoutubeVideos,
    loading: youtubeLoading,
    error: youtubeError,
  } = useGetYoutubeVideos();

  // Öne Çıkan Uygulamalar (manuel veriden)
  // Bu state'lere artık gerek yok, doğrudan featuredAppsList'i kullanabiliriz.
  // const [popularApps, setPopularApps] = useState([]);
  // const [appsLoading, setAppsLoading] = useState(true);
  // const [appsError, setAppsError] = useState(null);

  // Anasayfada gösterilecek öne çıkan uygulama sayısı
  const homeFeaturedAppsLimit = 4;
  const homePopularApps = featuredAppsList.slice(0, homeFeaturedAppsLimit);

  // Eğer bir yükleme/hata durumu simüle etmek isterseniz useState kullanabilirsiniz.
  // Şimdilik direkt veriyi kullanıyoruz.
  const appsLoading = false; // Manuel veri olduğu için yükleme yok (veya çok hızlı)
  const appsError = null; // Manuel veri olduğu için hata yok (dosya varsa)

  return (
    <div>
      <Hero />

      {/* En Son Videolar Bölümü (DEĞİŞİKLİK YOK) */}
      <section className="py-12 md:py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              En Son <span className="text-primary">Videolar</span>
            </h2>
            <Link to="/videos" className="btn btn-outline btn-primary">
              Tüm Videolar
            </Link>
          </div>

          {youtubeLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <VideoCard key={index} video={null} />
              ))}
            </div>
          )}
          {youtubeError && !youtubeLoading && (
            <div className="text-center py-10">
              <p className="text-error text-lg">
                Videolar yüklenirken bir sorun oluştu.
              </p>
              <p className="text-gray-500">{youtubeError.toString()}</p>
            </div>
          )}
          {!youtubeLoading &&
            !youtubeError &&
            latestYoutubeVideos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {latestYoutubeVideos.slice(0, 4).map((video) => (
                  <VideoCard key={video.id || video.etag} video={video} />
                ))}
              </div>
            )}
          {!youtubeLoading &&
            !youtubeError &&
            latestYoutubeVideos.length === 0 && (
              <p className="text-center text-gray-500 py-10 text-lg">
                Kanalda henüz hiç video bulunmuyor.
              </p>
            )}
        </div>
      </section>

      {/* ÖNE ÇIKAN UYGULAMALAR BÖLÜMÜ (GÜNCELLENDİ) */}
      {homePopularApps.length > 0 && ( // Sadece veri varsa göster
        <section className="py-12 md:py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Öne Çıkan{" "}
                <span className="text-secondary">Araçlar & Linkler</span>
              </h2>
              <Link to="/apps" className="btn btn-outline btn-secondary">
                Tümüne Göz At
              </Link>
            </div>
            {/* appsLoading ve appsError durumları manuel veri için genellikle gereksizdir,
                ama isterseniz tutarlılık için bırakabilirsiniz. */}
            {appsLoading && ( // Bu blok artık pek çalışmayacak
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(homeFeaturedAppsLimit)].map((_, index) => (
                  <AppCard key={index} app={null} />
                ))}
              </div>
            )}
            {appsError &&
              !appsLoading && ( // Bu blok da pek çalışmayacak
                <div className="text-center py-10">
                  <p className="text-error text-lg">{appsError.toString()}</p>
                </div>
              )}
            {!appsLoading && !appsError && homePopularApps.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {homePopularApps.map(
                  (
                    appItem // appItem, featuredAppsList'ten geliyor
                  ) => (
                    <AppCard key={appItem.id} app={appItem} /> // AppCard'a tüm app objesini geç
                  )
                )}
              </div>
            )}
            {/* Bu durum da manuel veriyle pek oluşmaz, eğer featuredAppsList boşsa */}
            {!appsLoading && !appsError && homePopularApps.length === 0 && (
              <p className="text-center text-gray-500 py-10 text-lg">
                Henüz öne çıkan araç bulunmuyor.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Kanal Hakkında ve Sosyal Medya (DEĞİŞİKLİK YOK) */}
      {/* ... (önceki kodunuzdaki gibi) ... */}
      <section className="py-12 md:py-16 bg-base-100">
        <div className="container mx-auto px-4 text-center">
          <img
            src="/logo/logo.png"
            alt="ConsolAktif Logo"
            className="w-20 h-20 mx-auto mb-4 rounded-full shadow-lg"
          />
          <h2 className="text-3xl font-bold mb-4">ConsolAktif Hakkında</h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6">
            Teknoloji dünyasındaki sorunlarınıza pratik çözümler, en güncel
            yazılım ve uygulama incelemeleriyle ConsolAktif her zaman yanınızda!
            Amacımız, karmaşık görünen teknolojik konuları herkesin
            anlayabileceği bir dilde sunmak ve dijital yaşamınızı
            kolaylaştırmak.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://www.youtube.com/@ConsolAktif"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-error"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-2"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
              YouTube'da Takip Et
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
