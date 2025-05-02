import React, { useEffect } from "react";
import AppCard from "../../components/AppCard/AppCard";

const Apps = () => {
  useEffect(() => {
    document.title = "ConsolAktif Uygulamalar";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/apps/auto-editor/all.png";
    }
  }, []);

  const App1 = {
    title: "Auto-Editor",
    image:
      "https://repository-images.githubusercontent.com/260117248/8e873ebb-fe50-48f2-8e62-e9ad9f85b3aa",
    description:
      "Bu program sayesinde Auto-Editor'ü kolaylıkla kullanabilirsiniz.",
    URL: "/auto-editor",
    isNew: true,
    category: [
      { category: "Auto-Editor" },
      { category: "Eklenti" },
      { category: "Kolay" },
    ],
  };
  const App2 = {
    title: "Youtility",
    image: "./apps/Youtility/design.png",
    description:
      "Bu program sayesinde Ücretsiz ve Sınırsız bir şekilde YouTube videoları indirebilirsiniz",
    URL: "/youtility",
    isNew: true,
    category: [
      { category: "Youtility" },
      { category: "Program" },
      { category: "Kolay" },
    ],
  };

  const App3 = {
    title: "Eklenti Marketi",
    image: "./apps/auto-editor/all.png",
    description:
      "Bu website sayesinde edit programınıza özel ücretli & ücretsiz eklentileri kolaylıkla bulabilirsiniz.",
    URL: "/free-extensions",
    isNew: true,
    category: [
      { category: "Eklenti" },
      { category: "Website" },
      { category: "Kolay" },
    ],
  };

  const App4 = {
    title: "Uygulama Marketi",
    image: "./apps/auto-editor/windows.png",
    description:
      "Bu website sayesinde bütün uygulamaları bulabilir ve kolayca yükleyebilirsiniz.",
    URL: "/app-market",
    isNew: true,
    category: [
      { category: "Eklenti" },
      { category: "Website" },
      { category: "Kolay" },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl py-10 px-4">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))" }}
      >
        <AppCard
          title={App1.title}
          image={App1.image}
          description={App1.description}
          URL={App1.URL}
          isNew={App1.isNew}
          category={App1.category}
        />
        <AppCard
          title={App2.title}
          image={App2.image}
          description={App2.description}
          URL={App2.URL}
          isNew={App2.isNew}
          category={App2.category}
        />
        <AppCard
          title={App3.title}
          image={App3.image}
          description={App3.description}
          URL={App3.URL}
          isNew={App3.isNew}
          category={App3.category}
        />
        <AppCard
          title={App4.title}
          image={App4.image}
          description={App4.description}
          URL={App4.URL}
          isNew={App4.isNew}
          category={App4.category}
        />
      </div>
    </div>
  );
};

export default Apps;
