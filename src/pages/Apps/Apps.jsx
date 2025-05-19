// src/pages/Apps/Apps.jsx
import React, { useEffect, useState } from "react";
import AppCard from "../../components/AppCard/AppCard";
import { featuredAppsList } from "../../data/featuredAppsData"; // Veriyi içe aktar

const Apps = () => {
  useEffect(() => {
    document.title = "ConsolAktif | Araçlar & Linkler"; // Başlığı güncelleyebiliriz
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon && featuredAppsList.length > 0 && featuredAppsList[0].image) {
      // Dinamik favicon için ilk uygulamanın resmini kullanabiliriz (opsiyonel)
      // favicon.href = featuredAppsList[0].image;
      favicon.href = "/logo/logo.png"; // Veya sabit bir favicon
    } else if (favicon) {
      favicon.href = "/logo/logo.png";
    }
  }, []);

  // İleride filtreleme veya sıralama eklemek isterseniz state kullanabilirsiniz
  const [displayApps, setDisplayApps] = useState(featuredAppsList);

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-up">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        Faydalı <span className="text-secondary">Araçlar & Linkler</span>
      </h1>

      {/* İleride buraya filtre/arama çubuğu eklenebilir */}

      {displayApps.length > 0 ? (
        <div
          className="grid gap-6" // Tailwind grid ile daha standart
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          }} // minmax ayarlandı
        >
          {displayApps.map((appItem) => (
            <AppCard key={appItem.id} app={appItem} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10 text-lg">
          Henüz listelenecek araç veya link bulunmuyor.
        </p>
      )}
    </div>
  );
};

export default Apps;
