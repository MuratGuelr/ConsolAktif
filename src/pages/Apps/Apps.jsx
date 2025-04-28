import React from "react";
import AppCard from "../../components/AppCard/AppCard";

const Apps = () => {
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
      { category: "Basit" },
      { category: "Kolay" },
    ],
  };

  return (
    <div className="flex justify-center py-5">
      <AppCard
        title={App1.title}
        image={App1.image}
        description={App1.description}
        URL={App1.URL}
        isNew={App1.isNew}
        category={App1.category}
      />
    </div>
  );
};

export default Apps;
