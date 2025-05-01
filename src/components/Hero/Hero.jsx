import { Link } from "react-router-dom";
import useGetUser from "../../hooks/useGetUser";

export default function Hero() {
  const { user, loading } = useGetUser();

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-xl"></span>
        </div>
      ) : (
        <div className="hero bg-base-100 h-screen -mt-36 -mb-36">
          <div className="hero-content flex-col lg:flex-row-reverse gap-10">
            <a href="https://youtu.be/W0sN_QXErjM" target="_blank">
              <img
                src="/apps/video/video1.png"
                className="max-w-sm rounded-lg shadow-2xl hover:scale-105 hover:saturate-150 transition-all duration-300 "
              />
            </a>
            <div>
              <h1 className="text-6xl font-bold">Sorunlar & Çözümler</h1>
              <p className="py-6 text-gray-400">
                Bilgisayar ağırlıklı yaşanan sorunların çözümleri ve yararlı
                uygulamalar BURADA!
              </p>
              <div className="flex justify-center">
                {user ? (
                  <Link to="/apps">
                    <button className="btn btn-primary text-xl">Başla</button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <button className="btn btn-primary text-xl">Başla</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
