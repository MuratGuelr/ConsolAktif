import React from "react";
import Header from "../Header/Header";

const ShowApps = () => {
  const apps = [
    {
      name: "Auto-Editor",
      img: "https://repository-images.githubusercontent.com/260117248/8e873ebb-fe50-48f2-8e62-e9ad9f85b3aa",
      description:
        "Bu program sayesinde auto-editor'ü kolaylıkla kullanabilirsiniz.",
      link: "/auto-editor",
    },
    {
      name: "YouTube Downloader",
      img: "apps/youtube-downloader/youtube.png",
      description:
        "Bu program sayesinde auto-editor'ü kolaylıkla kullanabilirsiniz.",
      link: "/youtube-downloader",
    },
  ];

  return (
    <div>
      <Header title={"Uygulamalarım"} />
      <div className="p-5 flex gap-5 flex-wrap justify-center">
        {apps.map((app) => (
          <a
            href={app.link}
            class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              class="w-full rounded-t-lg md:h-auto md:w-48 ml-2 md:rounded-none md:rounded-s-lg object-cover"
              src={app.img}
            />
            <div class="flex flex-col justify-between p-4 leading-normal">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {app.name}
              </h5>
              <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {app.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ShowApps;
