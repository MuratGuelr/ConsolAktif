import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <main className="grid h-screen -mt-36 -mb-36 place-items-center bg-base-300">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl text-neutral-content">
            Aradığınız sayfayı bulamadık 😔
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty sm:text-xl/8 text-gray-400">
            Ancak sizi aşağıdaki "
            <button className="btn btn-soft btn-accent btn-xs">Button</button>"
            ile geri gönderebiliriz 😁
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/" className="btn btn-soft btn-accent">
              Anasayfaya Dön
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
