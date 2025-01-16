import React from "react";
import { useSpring, animated, config } from "@react-spring/web";

const Jumbotron = () => {
  // Başlık animasyonu
  const titleSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  // Açıklama animasyonu
  const descSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 200,
    config: config.gentle,
  });

  // Butonlar için hover animasyonu
  const [buttonProps, buttonApi] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 10 },
  }));

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <animated.h1
          style={titleSpring}
          className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
        >
          ConsolAktif
        </animated.h1>
        <animated.p
          style={descSpring}
          className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400"
        >
          İşte sana yardımı dokunabilecek Videolarım ve Uygulamalarım.
        </animated.p>
        <animated.div
          style={descSpring}
          className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0"
        >
          <animated.a
            style={buttonProps}
            onMouseEnter={() => buttonApi.start({ scale: 1.05 })}
            onMouseLeave={() => buttonApi.start({ scale: 1 })}
            href="/apps"
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Uygulamalara Git
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </animated.a>
          <animated.a
            style={buttonProps}
            onMouseEnter={() => buttonApi.start({ scale: 1.05 })}
            onMouseLeave={() => buttonApi.start({ scale: 1 })}
            href="/all-videos"
            className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Videolarım
          </animated.a>
        </animated.div>
      </div>
    </section>
  );
};

export default Jumbotron;
