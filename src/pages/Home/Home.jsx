// src/pages/Home/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { featuredAppsList } from "../../data/featuredAppsData";
import { FaArrowRight, FaYoutube } from "react-icons/fa";
import { BiRocket, BiLike } from "react-icons/bi";
import { RiComputerLine } from "react-icons/ri";
import { IoNewspaperOutline } from "react-icons/io5";
import useGetYoutubeVideos from "../../hooks/useGetYoutubeVideos";
import useGetUser from "../../hooks/useGetUser";

const Home = () => {
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [secondVideo, setSecondVideo] = useState(null);

  // Get authentication state
  const { user, loading: userLoading } = useGetUser();

  // Get YouTube videos for featured content
  const {
    videos: youtubeVideos,
    loading: videosLoading,
    error: videosError,
  } = useGetYoutubeVideos();

  useEffect(() => {
    document.title = "ConsolAktif | Anasayfa - Sorunlar & Çözümler";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/logo/logo.png";
    }
  }, []);

  // Set the featured videos when data is loaded
  useEffect(() => {
    if (youtubeVideos && youtubeVideos.length > 0) {
      setFeaturedVideo(youtubeVideos[0]);
      if (youtubeVideos.length > 1) {
        setSecondVideo(youtubeVideos[1]);
      }
    }
  }, [youtubeVideos]);

  // Featured platforms for showcase
  const featuredPlatforms = featuredAppsList.slice(0, 4);

  // Latest featured tool - Auto-Editor or the first tool if not available
  const latestTool =
    featuredAppsList.find((app) => app.title.includes("Auto-Editor")) ||
    featuredAppsList[0];

  // FAQ items
  const faqItems = [
    {
      question: "ConsolAktif nedir?",
      answer:
        "ConsolAktif, teknoloji dünyasındaki sorunlarınıza pratik çözümler sunan bir platformdur. Video içerikler, uygulama incelemeleri ve teknoloji haberleri ile dijital yaşamınızı kolaylaştırmayı amaçlar.",
    },
    {
      question: "Kayıt olmak ücretsiz mi?",
      answer:
        "Evet, ConsolAktif platformuna kayıt olmak tamamen ücretsizdir. Hesap oluşturarak tüm içeriklerimize erişebilirsiniz.",
    },
    {
      question: "İçerik önerisinde bulunabilir miyim?",
      answer:
        "Kesinlikle! Görmek istediğiniz içerikler için öneride bulunabilirsiniz. İletişim sayfamızdan veya sosyal medya hesaplarımızdan bize ulaşabilirsiniz.",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="bg-base-200 py-8 md:py-14">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              ConsolAktif
            </h1>
            <p className="text-lg md:text-xl mb-10 text-base-content/80 max-w-2xl mx-auto">
              Teknoloji dünyasındaki sorunlarınıza pratik çözümler, en güncel
              yazılım ve uygulama incelemeleriyle yanınızdayız!
            </p>

            {/* Latest Video Section */}
            <div className="rounded-xl bg-base-300 p-2 mb-8 shadow-lg border border-base-content/5 overflow-hidden">
              {videosLoading && (
                <div className="aspect-video bg-gradient-to-br from-base-100 to-base-300 rounded-lg flex items-center justify-center">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              )}

              {!videosLoading && featuredVideo && (
                <Link
                  to={`https://www.youtube.com/watch?v=${featuredVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={
                        featuredVideo.snippet?.thumbnails?.high?.url ||
                        featuredVideo.snippet?.thumbnails?.default?.url
                      }
                      alt={featuredVideo.snippet?.title}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                      <div className="bg-red-600 text-white rounded-lg p-2 w-fit mb-3 flex items-center">
                        <FaYoutube className="mr-2" /> En Son Video
                      </div>
                      <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                        {featuredVideo.snippet?.title}
                      </h3>
                      <p className="text-white/80 line-clamp-2">
                        {featuredVideo.snippet?.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-red-600 text-white rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {!videosLoading && !featuredVideo && (
                <div className="aspect-video bg-gradient-to-br from-base-100 to-base-300 rounded-lg flex items-center justify-center relative">
                  <div className="text-base-content/30 text-xl">
                    Yakında yeni videolar geliyor
                  </div>
                </div>
              )}
            </div>

            {!user && (
              <p className="text-sm text-base-content/60 mb-8">
                En iyi deneyim için şimdi kaydolun ve özelleştirilmiş
                içeriklerden yararlanın.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="btn btn-primary btn-lg md:text-lg px-10 py-4 h-auto shadow-lg hover:shadow-primary/30 animate-pulse"
                  >
                    Hemen Başla
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/videos" className="btn btn-primary">
                    Videolara Göz At
                  </Link>
                  <Link to="/apps" className="btn btn-secondary">
                    Uygulamaları Keşfet
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Logo Section */}
      <section className="py-10 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {featuredPlatforms.map((platform, index) => (
              <div
                key={platform.id || index}
                className="flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
              >
                <img
                  src={platform.logo || "/logo/logo.png"}
                  alt={platform.title}
                  className="w-6 h-6 object-contain"
                />
                <span className="font-medium">{platform.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fast Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              {latestTool && (
                <Link to={latestTool.url || "/apps"} className="block">
                  <div className="rounded-xl bg-base-300 h-64 md:h-80 shadow-lg border border-base-content/5 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                    <div className="h-full flex flex-col items-center justify-center p-6 relative">
                      <img
                        src={latestTool.image || "/logo/logo.png"}
                        alt={latestTool.title}
                        className="w-20 h-20 object-contain mb-4 group-hover:scale-110 transition-transform duration-300"
                      />
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {latestTool.title}
                      </h3>
                      <p className="text-center text-base-content/70 max-w-xs">
                        {latestTool.description}
                      </p>
                      <div className="absolute bottom-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="btn btn-sm btn-primary">Keşfet</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {!latestTool && (
                <div className="rounded-xl bg-base-300 h-64 md:h-80 shadow-lg border border-base-content/5 overflow-hidden flex items-center justify-center">
                  <BiRocket className="text-6xl text-primary/30" />
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Hızlı</h2>
              <p className="mb-6 text-base-content/80">
                Teknoloji sorunlarınıza hızlı ve pratik çözümler sunuyoruz.
                Karmaşık problemleri basit adımlarla çözün.
              </p>
              <Link to="/apps" className="btn btn-primary">
                Araçlarımızı Keşfedin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Easy Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Kolay</h2>
              <p className="mb-6 text-base-content/80">
                Kullanıcı dostu içerikler ve açık anlatımlarla teknoloji artık
                herkes için erişilebilir. Teknik terimleri anlaşılır bir dille
                aktarıyoruz.
              </p>
              <Link to="/news" className="btn btn-secondary">
                Güncel Haberlere Göz Atın
              </Link>
            </div>
            <div>
              {secondVideo && (
                <Link
                  to={`https://www.youtube.com/watch?v=${secondVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="rounded-xl bg-base-200 h-64 md:h-80 shadow-lg border border-base-content/5 overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="relative h-full">
                      <img
                        src={
                          secondVideo.snippet?.thumbnails?.high?.url ||
                          secondVideo.snippet?.thumbnails?.default?.url
                        }
                        alt={secondVideo.snippet?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-white text-lg font-bold mb-2 line-clamp-2">
                          {secondVideo.snippet?.title}
                        </h3>
                        <div className="text-white/80 bg-secondary/80 text-xs px-2 py-1 rounded-lg w-fit">
                          Öne Çıkan Video
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
              {!secondVideo && (
                <div className="rounded-xl bg-base-200 h-64 md:h-80 shadow-lg border border-base-content/5 overflow-hidden flex items-center justify-center">
                  <BiLike className="text-6xl text-secondary/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Sıkça Sorulan Sorular
          </h2>

          <div className="max-w-2xl mx-auto">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="collapse collapse-plus bg-base-100 mb-4 rounded-lg shadow-md border border-base-300"
              >
                <input
                  type="radio"
                  name="faq-accordion"
                  defaultChecked={index === 0}
                />
                <div className="collapse-title text-xl font-medium">
                  {item.question}
                </div>
                <div className="collapse-content">
                  <p className="py-2 text-base-content/80">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section - Only for non-logged in users */}
      {!user && (
        <section className="py-16 bg-gradient-to-r from-primary/20 to-secondary/20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto p-8 bg-base-100/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-primary/20">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                ConsolAktif'e Bugün Katılın
              </h2>
              <p className="mb-8 text-lg mx-auto text-base-content/80">
                <span className="font-semibold text-base-content">
                  Ücretsiz
                </span>{" "}
                hesap oluşturarak tüm içeriklerimize erişebilir, yorumlar
                yapabilir ve teknoloji topluluğumuzun bir parçası olabilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg text-lg px-12 py-4 h-auto shadow-xl hover:shadow-primary/50 transform transition-all duration-300 hover:-translate-y-1"
                >
                  Üye Ol <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* User Content Exploration Section - Only for logged in users */}
      {user && (
        <section className="py-16 bg-gradient-to-r from-secondary/10 to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto p-8 bg-base-100/70 backdrop-blur-sm rounded-2xl shadow-lg border border-base-300">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Hoş Geldiniz, {user.displayName || "Değerli Üyemiz"}!
              </h2>
              <p className="mb-8 text-lg mx-auto text-base-content/80">
                Tüm içeriklerimize göz atabilir, en son videolarımızı
                izleyebilir ve faydalı araçlarımızı keşfedebilirsiniz.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/videos" className="btn btn-primary">
                  Videolara Göz At
                </Link>
                <Link to="/news" className="btn btn-secondary">
                  Haberlere Göz At
                </Link>
                <Link to="/apps" className="btn btn-accent">
                  Uygulamaları Keşfet
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Neler Sunuyoruz?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300">
              <div className="card-body">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <RiComputerLine className="text-2xl text-primary" />
                </div>
                <h3 className="card-title">Teknoloji Çözümleri</h3>
                <p className="text-base-content/70">
                  Günlük teknoloji sorunlarınıza pratik ve anlaşılır çözümler.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300">
              <div className="card-body">
                <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                  <IoNewspaperOutline className="text-2xl text-secondary" />
                </div>
                <h3 className="card-title">Güncel Haberler</h3>
                <p className="text-base-content/70">
                  Teknoloji dünyasındaki en son gelişmelerden haberdar olun.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300">
              <div className="card-body">
                <div className="bg-accent/10 p-3 rounded-full w-fit mb-4">
                  <svg
                    className="text-2xl text-accent w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="card-title">Uygulama İncelemeleri</h3>
                <p className="text-base-content/70">
                  En yararlı uygulamaları keşfedin ve verimli bir şekilde
                  kullanın.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
