import React, { useState } from "react";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Header from "../../components/Header/Header";
Header;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Giriş başarılı!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="p-5">
      <Header title={"Giriş Yap"} />
      <form
        onSubmit={handleLogin}
        className="max-w-sm mx-auto p-5 bg-gray-800 rounded-lg mt-10 mb-10"
      >
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <MdEmail className="text-gray-500" size={20} />
            </div>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name@consolaktif.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Şifre
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 mr-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <FaEyeSlash size={20} className="text-gray-400" />
              ) : (
                <FaEye size={19} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Giriş Yap
        </button>
        <p className="mt-5 text-sm text-gray-400">
          Hesabınız yok mu?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline dark:text-blue-500"
          >
            Kayıt Ol
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
