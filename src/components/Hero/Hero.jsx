import { Link } from "react-router-dom";
import useGetUser from "../../hooks/useGetUser";
import useGetYoutubeVideos from "../../hooks/useGetYoutubeVideos"; // YouTube videolarını çekmek için
import { useEffect, useState } from "react";

export default function Hero() {
  const { user, loading: userLoading } = useGetUser();
  const {
    videos: youtubeVideos,
    loading: videosLoading,
    error: videosError,
  } = useGetYoutubeVideos();
  const [featuredVideo, setFeaturedVideo] = useState(null);

  useEffect(() => {
    if (youtubeVideos && youtubeVideos.length > 0) {
      setFeaturedVideo(youtubeVideos[0]);
    }
  }, [youtubeVideos]);

  const isLoading = userLoading || videosLoading;

  return (
    <>
      {isLoading ? (
        <div className="hero min-h-screen bg-base-200 flex justify-center items-center">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        <div
          className="hero min-h-screen bg-base-200"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        >
          {" "}
          <div className="hero-overlay bg-opacity-70"></div>
          <div className="hero-content text-center text-neutral-content py-10">
            <div className="max-w-3xl">
              <Link to="/" className="inline-block mb-4">
                <img
                  src="/logo/logo.png"
                  alt="ConsolAktif Logo"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto hover:opacity-80 transition-opacity"
                />
              </Link>
              <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                ConsolAktif: <span className="text-primary">Sorunlara</span>{" "}
                Pratik Çözümler
              </h1>
              <p className="mb-5 mx-auto text-lg md:text-xl max-w-xl text-base-content-secondary">
                {" "}
                Bilgisayar, yazılım ve teknoloji dünyasındaki sorularınıza en
                güncel yanıtlar, yararlı uygulama rehberleri ve daha fazlası
                burada!
              </p>

              {featuredVideo && featuredVideo.snippet && (
                <div className="mb-8 group">
                  <h3 className="text-2xl font-semibold mb-3 text-primary">
                    En Son Video
                  </h3>
                  <Link
                    to={`https://www.youtube.com/watch?v=${featuredVideo.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block max-w-md mx-auto"
                  >
                    <img
                      src={
                        featuredVideo.snippet.thumbnails?.high?.url ||
                        "/apps/video/video1.jpg"
                      }
                      alt={featuredVideo.snippet.title}
                      className="rounded-lg shadow-2xl group-hover:scale-105 group-hover:shadow-primary/50 transition-all duration-300 border-2 border-transparent group-hover:border-primary"
                    />
                    <p className="mt-2 text-lg font-medium group-hover:text-primary transition-colors">
                      {featuredVideo.snippet.title}
                    </p>
                  </Link>
                </div>
              )}
              {videosError && !featuredVideo && (
                <p className="text-error mb-4">Öne çıkan video yüklenemedi.</p>
              )}

              <div className="space-x-4">
                {user ? (
                  <Link to="/videos">
                    {" "}
                    <button className="btn btn-primary btn-lg text-lg px-8">
                      Tüm Videolar
                    </button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <button className="btn btn-primary btn-lg text-lg px-8">
                      Giriş Yap
                    </button>
                  </Link>
                )}
                <Link to="/apps">
                  {" "}
                  <button className="btn btn-secondary btn-lg text-lg px-8">
                    Uygulamalar
                  </button>
                </Link>
              </div>
              <p className="mt-6 text-sm">
                Beni takip edin:
                <a
                  href="https://www.youtube.com/@ConsolAktif?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-accent ml-1"
                >
                  YouTube
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
