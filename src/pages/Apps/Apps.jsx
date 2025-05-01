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

  return (
    <div className="flex justify-center py-5 gap-5">
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
    </div>
  );
};

export default Apps;
