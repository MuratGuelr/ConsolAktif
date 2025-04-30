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
        <div className="hero bg-base-200 pt-10">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Merhaba 👋</h1>
              <p className="py-6">
                Websitem üzerinden uygulamalarıma ulaşabilir, yeni videolarımdan
                haberdar olabilir veya yeni haberlere ulaşabilirsin.{" "}
                <span className="text-xs text-base-primary">
                  (Şüpheli : 🤔)
                </span>
              </p>
              {!user ? (
                <Link to="/login">
                  <button className="btn btn-primary">Başla</button>
                </Link>
              ) : (
                <Link to="/profile">
                  <button className="btn btn-primary">Başla</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
