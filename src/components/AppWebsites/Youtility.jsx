import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Youtility = () => {
  useEffect(() => {
    document.title = "ConsolAktif Youtility";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/apps/Youtility/icon.ico";
    }
  }, []);
  return (
    <div className="mockup-window border border-gray-500 w-fit m-10 mx-auto bg-gray-700">
      <div className="grid place-content-center border-t border-gray-500 h-full p-5">
        <div className="bg-slate-900 text-white overflow-x-hidden">
          <div className="fixed inset-0 bg-gradient pointer-events-none">
            <div className="gradient-blob blob-1"></div>
            <div className="gradient-blob blob-2"></div>
            <div className="gradient-blob blob-3"></div>
          </div>

          <nav className="px-4 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800/50">
            <div className="container mx-auto flex justify-between items-center w-full">
              <Link to="/youtility" className="flex items-center gap-2 group">
                <img
                  src="/apps/Youtility/icon.ico"
                  alt="Youtility Logo"
                  className="w-8 h-8 group-hover:rotate-12 transition-transform"
                />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                  Youtility
                </span>
              </Link>
              <div className="flex gap-6">
                <a
                  href="https://github.com/MuratGuelr/Youtility"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://github.com/MuratGuelr/Youtility/releases"
                  className="hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Versiyonlar
                </a>
              </div>
            </div>
          </nav>

          <div className="flex justify-center mt-5 relative hover:scale-105 transition-all duration-200 cursor-pointer -mb-20">
            <a href="https://github.com/MuratGuelr/Youtility/releases/download/v4.0.0/Youtility_win_x64-Turkish.exe">
              <img
                src="./apps/Youtility/design.png"
                alt="youtility"
                className="w-xl"
              />
            </a>

            <div className="flex justify-center absolute bottom-0">
              <a
                href="https://github.com/MuratGuelr/Youtility/releases/tag/v4.0.0"
                className="mb-10 cursor-pointer"
              >
                <button className="animate flex items-center gap-2 rounded-full border border-slate-600 bg-gradient-to-b from-slate-800/90 to-slate-700/90 backdrop-blur-sm px-4 py-2 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-700 transition-all duration-300 md:text-sm">
                  <span className="h-3 w-3 rounded-full bg-green-400 shadow-[0px_0px_10px] shadow-green-400 animate-pulse"></span>
                  v4.0.0 Versiyonu Sizlerle!
                </button>
              </a>
            </div>
          </div>

          <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
            <div className="text-center mb-12 relative">
              <span className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></span>
              <h1 className="text-6xl md:text-6xl font-bold mb-6 text-glow">
                YouTube Video İndirici
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 animate-float">
                  Her Zamankinden Daha Hızlı
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Sadece birkaç tıklama ile YouTube ve diğer platformlardan video
                ve ses indirebileceğiniz modern ve şık bir uygulama!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <a
                href="https://github.com/MuratGuelr/Youtility/releases/download/v4.0.0/Youtility_win_x64-Turkish.exe"
                className="group relative px-8 py-3 rounded-full font-medium transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Şimdi İndir
                </span>
              </a>
              <a
                href="https://github.com/MuratGuelr/Youtility"
                className="group px-8 py-3 rounded-full font-medium transition-all border border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/10"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub'da Görüntüle
                </span>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto p-4">
              <div className="card-hover bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-purple-400 mb-4 text-4xl">⚡</div>
                <h3 className="text-xl font-bold mb-3">Hızlı İndirmeler</h3>
                <p className="text-slate-400">
                  Optimize edilmiş performans ile YouTube videoları ve ses
                  dosyalarını hızlıca indirir.
                </p>
              </div>
              <div className="card-hover bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-purple-400 mb-4 text-4xl">🎯</div>
                <h3 className="text-xl font-bold mb-3">Çoklu Formatlar</h3>
                <p className="text-slate-400">
                  İhtiyaçlarınıza uygun çeşitli format ve kalite seçenekleri
                  desteği.
                </p>
              </div>
              <div className="card-hover bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-purple-400 mb-4 text-4xl">🎨</div>
                <h3 className="text-xl font-bold mb-3">Modern Arayüz</h3>
                <p className="text-slate-400">
                  En iyi kullanıcı deneyimi için temiz ve sezgisel kullanıcı
                  arayüzü.
                </p>
              </div>
            </div>
          </section>

          <footer className="border-t border-slate-800 mt-20 py-8 relative">
            <div className="container mx-auto px-4 text-center text-slate-400">
              <p>© 2025 Youtility. Tüm hakları saklıdır.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Youtility;
