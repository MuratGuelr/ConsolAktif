import React, { useEffect, useState, useMemo, useRef } from "react";
import Header from "../Header/Header";
import { LuClipboardCopy } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "react-toastify";

const editorOptions = [
  {
    id: "premiere",
    name: "Premiere Pro",
    icon: "/apps/auto-editor/premiere-pro.png",
    tooltip: "Premiere Pro XML olarak dışa aktarır.",
    shortName: "Premiere",
  },
  {
    id: "resolve",
    name: "Davinci Resolve",
    icon: "/apps/auto-editor/davinci-resolve.png",
    tooltip: "Davinci Resolve EDL olarak dışa aktarır.",
    shortName: "Resolve",
  },
  {
    id: "final-cut",
    name: "Final Cut Pro",
    icon: "/apps/auto-editor/final-cut.png",
    tooltip: "Final Cut Pro XML olarak dışa aktarır.",
    shortName: "Final Cut",
  },
  {
    id: "mp4",
    name: "MP4 Çıktı",
    icon: "/apps/auto-editor/mp4.png",
    tooltip: "Doğrudan düzenlenmiş MP4 video olarak dışa aktarır.",
    shortName: "MP4",
  },
  {
    id: "best",
    name: "Akıllı Kesim",
    icon: "/logo/logo.png",
    tooltip: "Ses seviyesine göre akıllı kesim yapar (audio:threshold=0.05).",
    shortName: "En İyi",
  },
  {
    id: "all",
    name: "Hepsi (Uygulama Sonradan Seçilebilir)",
    icon: "/apps/auto-editor/all.png",
    tooltip:
      "Tüm formatları içeren ve script çalıştırıldığında konsolda seçim yaptıran script üretir.",
    shortName: "Hepsi",
  },
];

const DEFAULT_ADVANCED_CONFIG = {
  margin: "0.02",
};

const AutoEditor = () => {
  const [config, setConfig] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [advancedConfig, setAdvancedConfig] = useState(DEFAULT_ADVANCED_CONFIG);
  const [showAdvancedUI, setShowAdvancedUI] = useState(false);
  const textareaRef = useRef(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isNewOptionSelected, setIsNewOptionSelected] = useState(false); // Yeni state: Ana seçenek mi değişti?

  const selectedEditorOption = useMemo(
    () => editorOptions.find((opt) => opt.id === selectedOptionId),
    [selectedOptionId]
  );

  const appName = useMemo(
    () => selectedEditorOption?.name || null,
    [selectedEditorOption]
  );

  const showAdvancedSettingsPanel =
    selectedOptionId !== null && selectedOptionId !== "all";

  // Script Üretimi: selectedOptionId veya advancedConfig değiştiğinde tetiklenir
  useEffect(() => {
    if (selectedOptionId) {
      // Eğer yeni bir ana seçenek seçildiyse, config'i kısa süreliğine değiştirip animasyon etkisi yaratalım
      if (isNewOptionSelected) {
        setConfig("Script oluşturuluyor..."); // Geçici placeholder
        if (textareaRef.current) {
          textareaRef.current.scrollTop = 0; // Anında başa al
        }
        // Kısa bir gecikmeyle asıl scripti üret
        setTimeout(() => {
          generateBatchScript(selectedOptionId, advancedConfig);
          setIsNewOptionSelected(false); // Bayrağı sıfırla
        }, 50); // Gecikme süresi
      } else {
        // Sadece gelişmiş ayar değişti, scroll'a dokunma, scripti direkt üret
        generateBatchScript(selectedOptionId, advancedConfig);
      }
    } else {
      setConfig(""); // Seçenek yoksa config'i temizle
    }
  }, [selectedOptionId, advancedConfig, isNewOptionSelected]); // isNewOptionSelected'ı bağımlılığa ekle

  // Config güncellendiğinde (yeni script geldiğinde) scroll animasyonu
  useEffect(() => {
    // Bu useEffect sadece config gerçekten script içeriğiyle güncellendiğinde ve
    // yeni bir ana seçenek seçilmişse (isNewOptionSelected ile kontrol edilebilir, ama zaten yukarıdaki mantıkla ayrıldı)
    // veya daha basitçe, config "Script oluşturuluyor..." placeholder'ından farklıysa çalışır.
    if (config && config !== "Script oluşturuluyor..." && textareaRef.current) {
      // Eğer bir önceki adımda isNewOptionSelected true idiyse ve config güncellendiyse,
      // bu, yeni bir ana seçenek için scriptin geldiği anlamına gelir.
      // Yukarıdaki useEffect (selectedOptionId, advancedConfig, isNewOptionSelected'a bağlı olan)
      // zaten scroll'u anlık olarak başa almıştı. Şimdi smooth scroll ile aşağı kaydırabiliriz.

      // Bu kontrolü `isNewOptionSelected` yerine, `config`'in önceki halinden farklı olup olmadığıyla yapabiliriz
      // Ancak `isNewOptionSelected` bayrağı daha net bir ayrım sunar.
      // Şimdilik, `config`'in `placeholder`dan farklı olması yeterli bir koşul gibi görünüyor.

      const performSmoothScroll = () => {
        if (textareaRef.current) {
          textareaRef.current.style.scrollBehavior = "smooth";
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          // Animasyon bittikten sonra auto'ya almak, kullanıcı scroll'unu etkilememesi için iyi olabilir.
          // Ama sürekli smooth kalması da bir tercih.
          // setTimeout(() => {
          //   if(textareaRef.current) textareaRef.current.style.scrollBehavior = 'auto';
          // }, 500); // Scroll süresine bağlı bir gecikme
        }
      };

      // Eğer config değişimi bir ana seçenek değişikliğinden kaynaklanıyorsa
      // ve scroll zaten başa alınmışsa, şimdi smooth scroll yap.
      // Bu ayrımı daha iyi yapmak için `isNewOptionSelected`'ın etkisini düşünmek lazım.
      // Şimdilik, config'in placeholder'dan farklı olduğu her durumda (yeni script geldiğinde)
      // scroll'u en alta kaydırmaya çalışalım. Gelişmiş ayar değişikliğinde
      // scroll zaten en altta olmayacağı için bu çok fark yaratmayacaktır.
      // Asıl sorun, gelişmiş ayar değiştiğinde scroll'un başa dönmemesi.

      // YENİ YAKLAŞIM: Sadece yeni bir ana seçenek seçildiğinde animasyonlu scroll.
      // Bu bilgi `handleOptionButtonClick` -> `setIsNewOptionSelected(true)` -> ve ilk `useEffect`'teki `setTimeout` ile yönetiliyor.
      // Bu `useEffect` (sadece `config`'e bağlı olan) bu durumda gereksiz karmaşıklık yaratabilir.
      // Animasyonu doğrudan `generateBatchScript` sonrası veya `isNewOptionSelected` ile tetiklenen `useEffect`'in
      // `setTimeout` callback'i içinde yapmak daha doğru olabilir.

      // Yukarıdaki useEffect (selectedOptionId, advancedConfig, isNewOptionSelected'a bağlı olan)
      // içinde `setIsNewOptionSelected(false)` çağrısından hemen önce scroll animasyonunu yapmak daha mantıklı.
    }
  }, [config]);

  const handleAdvancedConfigChange = (key, value) => {
    setIsNewOptionSelected(false); // Gelişmiş ayar değişimi, yeni ana seçenek değil
    setAdvancedConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateBatchScript = (type, currentAdvancedConfig) => {
    // ... (generateBatchScript içeriği aynı)
    let batchScript = `@echo off\nsetlocal enabledelayedexpansion\ncolor 0B\nchcp 65001 > nul\n`;
    batchScript += `set "pwshcmd=powershell -noprofile -command "&{[System.Reflection.Assembly]::LoadWithPartialName('System.windows.forms') | Out-Null;$OpenFileDialog = New-Object System.Windows.Forms.OpenFileDialog; $OpenFileDialog.Filter = 'Video Dosyaları (*.mp4, *.mov, *.avi, *.mkv)|*.mp4;*.mov;*.avi;*.mkv|Tüm Dosyalar (*.*)|*.*'; $OpenFileDialog.Title = 'Lütfen düzenlenecek video dosyasını seçin'; $OpenFileDialog.ShowDialog()|out-null; $OpenFileDialog.FileName}"\n`;
    batchScript += `for /f "delims=" %%I in ('%pwshcmd%') do set "FileName=%%I"\n`;
    batchScript += `set "FnS=Dosya seçilmediği için program kapatıldı."\n`;
    batchScript += `if "%FileName%"=="" (\n    start "" cmd /c "@echo off & mode con cols=70 lines=10 & @color 0B & echo. & echo   ------------------ %FnS% ------------------ & echo. & timeout /t 5 /nobreak > nul & exit"\n    exit /b\n)\n`;

    const marginValue = parseFloat(currentAdvancedConfig.margin);
    const marginParam =
      !isNaN(marginValue) && marginValue >= 0
        ? ` --frame-margin ${marginValue}sec`
        : " --frame-margin 0.02sec";

    let autoEditorCommand = `auto-editor "!FileName!"${marginParam}`;

    switch (type) {
      case "premiere":
        autoEditorCommand += " --export premiere";
        break;
      case "resolve":
        autoEditorCommand += " --export resolve";
        break;
      case "final-cut":
        autoEditorCommand += " --export final-cut-pro";
        break;
      case "mp4":
        break;
      case "best":
        autoEditorCommand += " --edit audio:threshold=0.05";
        break;
      case "all":
        batchScript += `
@echo [1] Premiere Pro
@echo [2] Davinci Resolve
@echo [3] Final Cut Pro
@echo [4] Video ciktisi (MP4)

set /p choice=Seciminizi yapin (1-4): 

if "%choice%"=="1" (
    set "export_param=--export premiere"
) else if "%choice%"=="2" (
    set "export_param=--export resolve"
) else if "%choice%"=="3" (
    set "export_param=--export final-cut-pro"
) else if "%choice%"=="4" (
    set "export_param="
) else (
    echo Gecersiz secim. Program kapatiliyor.
    timeout /t 3 /nobreak > nul
    exit /b
)
@cls
echo Islem baslatiliyor, lutfen bekleyin...
auto-editor "!FileName!" %export_param%${marginParam} --edit audio:threshold=0.05
goto end_script
`;
        break;
      default:
        setConfig("Hatalı seçim yapıldı!");
        return;
    }

    if (type !== "all") {
      batchScript += `@cls\necho Islem baslatiliyor, lutfen bekleyin...\n${autoEditorCommand}\n`;
    }

    batchScript += `:end_script\n@echo.\n@echo Islem tamamlandi.\n@pause\nexit /b`;
    setConfig(batchScript);

    // Eğer yeni bir ana seçenek seçildiyse ve script üretildiyse, şimdi smooth scroll yap
    if (isNewOptionSelected && textareaRef.current) {
      setTimeout(() => {
        // DOM güncellemesinin tamamlanması için kısa bir bekleme
        if (textareaRef.current) {
          textareaRef.current.style.scrollBehavior = "smooth";
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }, 0); // 0ms timeout ile bir sonraki tick'e erteliyoruz
    }
  };

  const handleOptionButtonClick = (optionId) => {
    if (selectedOptionId === optionId && optionId !== "all") {
      setSelectedOptionId(null);
      setShowAdvancedUI(false);
      setIsNewOptionSelected(false); // Seçim kaldırıldı
    } else {
      if (selectedOptionId !== optionId) {
        setIsNewOptionSelected(true); // Farklı bir ana seçenek seçildi
      } else {
        setIsNewOptionSelected(false); // Aynı ana seçenek (belki gelişmiş ayar değişimi sonrası tetiklendi)
      }
      setSelectedOptionId(optionId);
      if (optionId === "all") {
        setShowAdvancedUI(false);
      }
    }
  };

  const copyToClipboard = () => {
    if (
      !config ||
      config.trim() === "" ||
      config === "Script oluşturuluyor..." ||
      isCopying
    ) {
      if (!isCopying) {
        toast.error(
          "Kopyalanacak bir script bulunmuyor veya zaten kopyalanıyor.",
          { theme: "colored", toastId: "copyError" }
        );
      }
      return;
    }
    setIsCopying(true);
    navigator.clipboard
      .writeText(config)
      .then(() => {
        toast.success("Batch script panoya kopyalandı!", {
          theme: "colored",
          toastId: "copySuccess",
        });
      })
      .catch((err) => {
        toast.error("Kopyalama sırasında bir hata oluştu!", {
          theme: "colored",
          toastId: "copyFail",
        });
        console.error("Kopyalama hatası:", err);
      })
      .finally(() => {
        setTimeout(() => setIsCopying(false), 1500);
      });
  };

  const resetAll = () => {
    setSelectedOptionId(null);
    setAdvancedConfig(DEFAULT_ADVANCED_CONFIG);
    setShowAdvancedUI(false);
    setIsNewOptionSelected(false);
    toast.info("Ayarlar sıfırlandı.", { theme: "colored" });
  };

  useEffect(() => {
    document.title = "ConsolAktif | Auto-Editor Script Oluşturucu";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/apps/auto-editor/app.png";
    }
  }, []);

  return (
    <div className="py-10 px-4 bg-gradient-to-br from-base-300 to-base-100 min-h-screen">
      <div className="mockup-window border bg-base-200 border-base-300 shadow-2xl w-full max-w-3xl mx-auto">
        <div className="flex justify-center px-4 py-8 sm:py-16 bg-base-200 border-t border-base-300">
          <div className="w-full space-y-6">
            <Header
              title="Auto-Editor Batch Script Oluşturucu"
              subtitle="ConsolAktif tarafından sizin için hazırlandı!"
            />

            {showAdvancedSettingsPanel && (
              <div
                className={`bg-base-100 p-4 sm:p-6 rounded-xl shadow transition-all duration-300 ease-in-out ${
                  showAdvancedUI
                    ? "opacity-100 max-h-96"
                    : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                }`}
              >
                <h3 className="text-lg font-semibold mb-3 text-primary flex items-center">
                  <FiSettings className="h-5 w-5 mr-2" />
                  Gelişmiş Ayarlar
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="marginRange"
                      className="block text-sm font-medium text-base-content mb-1"
                    >
                      Klip Başı/Sonu Boşluk (Margin):{" "}
                      <span className="font-bold text-secondary">
                        {advancedConfig.margin} saniye
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">0s</span>
                      <input
                        id="marginRange"
                        type="range"
                        step="0.01"
                        min="0"
                        max="5"
                        className="range range-primary range-sm flex-grow"
                        value={advancedConfig.margin}
                        onChange={(e) =>
                          handleAdvancedConfigChange("margin", e.target.value)
                        }
                      />
                      <span className="text-xs">2s</span>
                    </div>
                    <p className="text-xs text-base-content-secondary mt-1">
                      Kliplerin başında ve sonunda bırakılacak ekstra süre.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedOptionId && selectedOptionId !== "all" && (
              <button
                onClick={() => setShowAdvancedUI(!showAdvancedUI)}
                className="btn btn-sm btn-outline btn-accent w-full mt-2 mb-4"
              >
                <FiSettings className="h-4 w-4 mr-1" />
                {showAdvancedUI
                  ? "Gelişmiş Ayarları Gizle"
                  : "Gelişmiş Ayarları Göster"}
              </button>
            )}

            <div className="bg-base-100 p-4 sm:p-6 relative rounded-xl shadow">
              <div className="relative w-full indicator">
                {appName && (
                  <span className="indicator-item indicator-start indicator-middle badge badge-primary top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-3 py-2">
                    {appName}
                  </span>
                )}
                <textarea
                  ref={textareaRef}
                  readOnly
                  placeholder={
                    selectedOptionId
                      ? config === "Script oluşturuluyor..."
                        ? "Script oluşturuluyor..."
                        : "Aşağıdaki seçeneklerden birini belirleyin..."
                      : "İstediğiniz çıktı türünü aşağıdaki butonlardan seçin..."
                  }
                  className="textarea textarea-bordered w-full p-4 h-60 sm:h-72 rounded-lg resize-none text-sm bg-base-200 focus:border-primary"
                  // value={config === "Script oluşturuluyor..." ? "" : config}
                  value={config} // Placeholder'ı direkt textarea placeholder'ı olarak kullanalım
                  style={{ scrollBehavior: "auto" }} // Başlangıçta auto, animasyon için JS ile smooth
                ></textarea>
                <button
                  className={`btn btn-square btn-ghost absolute top-3 right-3 text-base-content hover:text-primary ${
                    isCopying ? "loading" : ""
                  }`}
                  onClick={copyToClipboard}
                  disabled={
                    !config ||
                    config.trim() === "" ||
                    config === "Script oluşturuluyor..." ||
                    isCopying
                  }
                  aria-label="Scripti panoya kopyala"
                >
                  {!isCopying && <LuClipboardCopy size={20} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-center text-sm text-base-content-secondary mb-3">
                Bir çıktı formatı seçin:
              </p>
              <div className="flex justify-center bg-base-100 p-3 sm:p-4 rounded-xl shadow">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                  {editorOptions.map((option) => (
                    <div
                      key={option.id}
                      className="tooltip"
                      data-tip={option.tooltip}
                    >
                      <button
                        className={`btn btn-ghost h-auto p-2 sm:p-3 transition-all duration-200 ease-in-out flex flex-col items-center justify-center w-full aspect-square
                                    focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-100
                                    ${
                                      selectedOptionId === option.id
                                        ? "btn-active !bg-primary text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105"
                                        : "grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                                    }
                                    `}
                        onClick={() => handleOptionButtonClick(option.id)}
                        aria-label={option.name}
                      >
                        <img
                          src={option.icon}
                          className="h-8 w-8 sm:h-10 sm:w-10 object-contain mb-1"
                          alt={option.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder-icon.png";
                          }}
                        />
                        <span className="text-xs text-center leading-tight">
                          {option.shortName}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={resetAll}
                className="btn btn-outline btn-error btn-sm"
              >
                <GrPowerReset className="h-4 w-4 mr-2" />
                Tüm Ayarları Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoEditor;
