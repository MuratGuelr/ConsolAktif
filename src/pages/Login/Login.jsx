import React from "react";
import { auth, googleProvider } from "../../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.log("Error", error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-18 lg:px-8 pb-45">
      <div className="card bg-base-300 w-96 shadow-sm m-auto">
        <div className="card-body">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
            <div className="avatar">
              <img
                alt="Your Company"
                src="https://yt3.googleusercontent.com/M-YH7dPjl40d2cXHK30at3hYyn1seO_RO4MJ-ee8FMN6wHrRQ6ZVaX48JIwHt0BqZSA3do8N2g=s160-c-k-c0x00ffffff-no-rj"
                className="w-24 rounded-full"
              />
            </div>

            <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-base-content">
              Google ile Giriş Yapabilirsin!
            </h2>
          </div>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center">
              {/* Google */}
              <button
                className="btn bg-primary text-primary-content border-primary h-full"
                onClick={handleGoogleLogin}
              >
                <svg
                  aria-label="Google logo"
                  width="60"
                  height="60"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <g>
                    <path d="m0 0H512V512H0" fill="#615efd7d"></path>
                    <path
                      fill="#34a853"
                      d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                    ></path>
                    <path
                      fill="#4285f4"
                      d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                    ></path>
                    <path
                      fill="#fbbc02"
                      d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                    ></path>
                    <path
                      fill="#ea4335"
                      d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                    ></path>
                  </g>
                </svg>
                Google ile Giriş Yap
              </button>
            </div>

            <p className="mt-10 text-center text-sm/6 text-gray-500 pointer">
              Kayıt olmadın mı?{" "}
              <button
                className="font-semibold text-indigo-600 hover:text-indigo-500"
                onClick={handleGoogleLogin}
              >
                Bir şans ver bence 🫵
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
