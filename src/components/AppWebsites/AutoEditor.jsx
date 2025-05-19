import React, { useEffect, useState, useMemo, useRef } from "react";
import Header from "../Header/Header";
import { LuClipboardCopy } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "react-toastify";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { FiInfo } from "react-icons/fi";

// Modal açılış kapanış animasyonları için CSS sınıfları
const modalAnimation = {
  fadeIn: "animate-[fade-in_0.3s_ease-in-out]",
  fadeOut: "animate-[fade-out_0.3s_ease-in-out]",
  scaleIn: "animate-[scale-in_0.3s_ease-out]",
  scaleOut: "animate-[scale-out_0.3s_ease-in]",
};

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
  threshold: "0.05",
};

const AutoEditor = () => {
  const [config, setConfig] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [advancedConfig, setAdvancedConfig] = useState(DEFAULT_ADVANCED_CONFIG);
  const [showAdvancedUI, setShowAdvancedUI] = useState(false);
  const textareaRef = useRef(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isNewOptionSelected, setIsNewOptionSelected] = useState(false); // Yeni state: Ana seçenek mi değişti?
  const [inBestMode, setInBestMode] = useState(false); // "En İyi" modu aktif mi?
  const [exportFormat, setExportFormat] = useState(null); // Seçilen çıktı formatı

  // Nasıl Kullanılır kılavuzu için state'ler
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const selectedEditorOption = useMemo(
    () => editorOptions.find((opt) => opt.id === selectedOptionId),
    [selectedOptionId]
  );

  const appName = useMemo(() => {
    if (inBestMode) {
      return (
        "Akıllı Kesim" +
        (exportFormat
          ? ` + ${editorOptions.find((o) => o.id === exportFormat)?.name || ""}`
          : "")
      );
    }
    return selectedEditorOption?.name || null;
  }, [selectedEditorOption, inBestMode, exportFormat]);

  const showAdvancedSettingsPanel = selectedOptionId !== null;

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

  // "En İyi" modunda export format değişince script'i güncelle
  useEffect(() => {
    // Sadece "En İyi" modundaysa ve selectedOptionId geçerliyse çalış
    if (inBestMode && selectedOptionId === "best") {
      generateBatchScript("best", advancedConfig);
    }
  }, [exportFormat, inBestMode, advancedConfig, selectedOptionId]); // Tüm ilgili bağımlılıkları ekle

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
      // Şimdilik, `config`'in `placeholder`dan farklı olduğu her durumda (yeni script geldiğinde)
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
    let batchScript = `@echo off\nsetlocal enabledelayedexpansion\ncolor b\n`;
    batchScript += `set pwshcmd=powershell -noprofile -command "&{[System.Reflection.Assembly]::LoadWithPartialName('System.windows.forms') | Out-Null;$OpenFileDialog = New-Object System.Windows.Forms.OpenFileDialog; $OpenFileDialog.ShowDialog()|out-null; $OpenFileDialog.FileName}"\n`;
    batchScript += `for /f "delims=" %%I in ('%pwshcmd%') do set "FileName=%%I"\n`;
    batchScript += `set FnS=Dosya secilmedigi icin program kapatildi.\n`;
    batchScript += `if "%FileName%"=="" (\n    start cmd /c "@echo off & mode con cols=70 lines=10 & @color b & echo - %FnS% - & pause>nul"\n    exit\n)\n`;

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
        autoEditorCommand += ` --edit audio:threshold=${currentAdvancedConfig.threshold}`;
        // Seçili export formatı varsa ekle
        if (exportFormat === "premiere") {
          autoEditorCommand += " --export premiere";
        } else if (exportFormat === "resolve") {
          autoEditorCommand += " --export resolve";
        } else if (exportFormat === "final-cut") {
          autoEditorCommand += " --export final-cut-pro";
        }
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
auto-editor "!FileName!" %export_param%${marginParam} --edit audio:threshold=${currentAdvancedConfig.threshold}
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
    // "En İyi" modundaysak ve export formatına tıklandıysa özel işlem yap
    if (inBestMode) {
      // En İyiye tekrar tıklandıysa moddan çık
      if (optionId === "best") {
        setInBestMode(false);
        setExportFormat(null);
        setIsNewOptionSelected(true); // Yeniden script oluştur
        return;
      }

      // Sadece çıktı formatları için işlem yap (premiere, resolve, final-cut)
      if (["premiere", "resolve", "final-cut"].includes(optionId)) {
        if (exportFormat === optionId) {
          // Aynı format tekrar seçildiyse kaldır
          setExportFormat(null);
          toast.info(
            `${
              editorOptions.find((o) => o.id === optionId)?.name
            } çıktı formatı kaldırıldı.`,
            { theme: "colored" }
          );
        } else {
          // Yeni bir format seçildiyse değiştir
          setExportFormat(optionId);
          toast.success(
            `${
              editorOptions.find((o) => o.id === optionId)?.name
            } çıktı formatı eklendi!`,
            { theme: "colored" }
          );
        }

        // Artık useEffect ile otomatik script güncellemesi yapılacak
        return;
      }

      // "En İyi" modunda diğer butonları (mp4, all) yoksay
      return;
    }

    // Normal mod işlemleri
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

      // "En İyi" modunu ayarla
      if (optionId === "best") {
        setInBestMode(true);
        setExportFormat(null); // Export format sıfırla
        toast.info(
          "Akıllı Kesim özelleştirme modu aktif! Çıktı formatını seçebilirsiniz.",
          { theme: "colored" }
        );
      } else {
        setInBestMode(false);
        setExportFormat(null);
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
    setInBestMode(false);
    setExportFormat(null);
    toast.info("Ayarlar sıfırlandı.", { theme: "colored" });
  };

  useEffect(() => {
    document.title = "ConsolAktif | Auto-Editor Script Oluşturucu";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/apps/auto-editor/app.png";
    }

    // Nasıl Kullanılır kılavuzunu gösterip göstermemeyi kontrol et
    const dontShowAgainSetting = localStorage.getItem(
      "dontShowAutoEditorGuide"
    );
    if (dontShowAgainSetting !== "true") {
      setShowHowToUse(true);
    }
  }, []);

  // Tekrar gösterme seçeneğini kaydet
  const handleDontShowAgain = () => {
    setDontShowAgain(!dontShowAgain);
  };

  // Kılavuzu kapat (animasyonlu)
  const closeHowToUse = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowHowToUse(false);
      setIsClosing(false);
      if (dontShowAgain) {
        localStorage.setItem("dontShowAutoEditorGuide", "true");
      }
    }, 300); // Animasyon süresi kadar bekle
  };

  // Kılavuzu aç
  const openHowToUse = () => {
    setShowHowToUse(true);
  };

  return (
    <div className="py-10 px-4 bg-gradient-to-br from-base-300 to-base-100 min-h-screen">
      <div className="mockup-window border bg-base-200 border-base-300 shadow-2xl w-full max-w-3xl mx-auto">
        <div className="flex justify-center px-4 py-8 sm:py-16 bg-base-200 border-t border-base-300">
          <div className="w-full space-y-6">
            <div className="flex justify-between items-center">
              <Header
                title="Auto-Editor Batch Script Oluşturucu"
                subtitle="ConsolAktif tarafından sizin için hazırlandı!"
              />
              <button
                onClick={openHowToUse}
                className="btn btn-circle btn-ghost text-primary hover:bg-primary hover:text-primary-content transition-colors"
                aria-label="Nasıl Kullanılır?"
              >
                <AiOutlineQuestionCircle size={24} />
              </button>
            </div>

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

                  {/* Ses Eşiği (Threshold) ayarını sadece "En İyi" ve "Hepsi" seçenekleri için göster */}
                  {(selectedOptionId === "best" ||
                    selectedOptionId === "all") && (
                    <div>
                      <label
                        htmlFor="thresholdRange"
                        className="block text-sm font-medium text-base-content mb-1"
                      >
                        Ses Eşiği (Threshold):{" "}
                        <span className="font-bold text-secondary">
                          {advancedConfig.threshold}
                        </span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">0.01</span>
                        <input
                          id="thresholdRange"
                          type="range"
                          step="0.01"
                          min="0.01"
                          max="0.2"
                          className="range range-accent range-sm flex-grow"
                          value={advancedConfig.threshold}
                          onChange={(e) =>
                            handleAdvancedConfigChange(
                              "threshold",
                              e.target.value
                            )
                          }
                        />
                        <span className="text-xs">0.2</span>
                      </div>
                      <p className="text-xs text-base-content-secondary mt-1">
                        Ses kesimi için eşik değeri. Düşük değerler daha hassas
                        kesim yapar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedOptionId && (
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
                                        : inBestMode
                                        ? option.id === "mp4" && !exportFormat
                                          ? "opacity-100 !bg-accent/20 ring-1 ring-accent" // MP4 "En İyi" modunda özel görünüm
                                          : [
                                              "premiere",
                                              "resolve",
                                              "final-cut",
                                            ].includes(option.id)
                                          ? exportFormat === option.id
                                            ? "opacity-100 !bg-secondary/20 ring-1 ring-secondary" // Seçili export formatı
                                            : "opacity-100" // Seçilebilir export formatları
                                          : "grayscale opacity-50" // Diğer butonlar pasif
                                        : selectedOptionId === "all" &&
                                          option.id !== "all"
                                        ? "opacity-100" // "Hepsi" seçildiğinde diğer butonlar renkli
                                        : "grayscale hover:grayscale-0 opacity-70 hover:opacity-100"
                                    }
                                    `}
                        onClick={() => handleOptionButtonClick(option.id)}
                        aria-label={option.name}
                        disabled={
                          inBestMode &&
                          ![
                            "best",
                            "premiere",
                            "resolve",
                            "final-cut",
                          ].includes(option.id)
                        }
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

            {/* Nasıl Kullanılır Modal */}
            {showHowToUse && (
              <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm ${
                  isClosing ? modalAnimation.fadeOut : modalAnimation.fadeIn
                }`}
              >
                <div
                  className={`bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto ${
                    isClosing ? modalAnimation.scaleOut : modalAnimation.scaleIn
                  }`}
                >
                  <div className="sticky top-0 z-10 bg-primary text-primary-content px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h3 className="text-xl font-semibold flex items-center">
                      <FiInfo className="mr-2" size={20} />
                      Auto-Editor Nasıl Kullanılır?
                    </h3>
                    <button
                      onClick={closeHowToUse}
                      className="btn btn-circle btn-sm btn-ghost text-primary-content hover:bg-primary-focus"
                    >
                      <IoMdClose size={18} />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-6">
                      <div className="border-l-4 border-primary pl-4">
                        <p className="text-sm text-base-content/80 italic">
                          Bu araç, videolarınızdan sessiz bölümleri otomatik
                          olarak kesmek için
                          <strong> Auto-Editor</strong> uygulamasını
                          kullanmanızı kolaylaştıran bir script oluşturucudur.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="card bg-base-200 shadow-sm">
                          <div className="card-body p-4">
                            <h4 className="card-title text-lg text-primary">
                              📋 Adım 1: Mod Seçimi
                            </h4>
                            <p>Aşağıdaki seçeneklerden birini seçin:</p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>
                                <strong className="text-secondary">
                                  Akıllı Kesim (En İyi):
                                </strong>{" "}
                                Ses seviyesine göre akıllı kesim yapar ve
                                istediğiniz bir çıktı formatı seçebilirsiniz.
                              </li>
                              <li>
                                <strong className="text-secondary">
                                  Premiere Pro:
                                </strong>{" "}
                                Adobe Premiere Pro XML formatında çıktı almanızı
                                sağlar.
                              </li>
                              <li>
                                <strong className="text-secondary">
                                  Davinci Resolve:
                                </strong>{" "}
                                Davinci Resolve EDL formatında çıktı almanızı
                                sağlar.
                              </li>
                              <li>
                                <strong className="text-secondary">
                                  Final Cut Pro:
                                </strong>{" "}
                                Final Cut Pro XML formatında çıktı almanızı
                                sağlar.
                              </li>
                              <li>
                                <strong className="text-secondary">
                                  MP4 Çıktı:
                                </strong>{" "}
                                Doğrudan düzenlenmiş MP4 video olarak dışa
                                aktarmanızı sağlar.
                              </li>
                              <li>
                                <strong className="text-secondary">
                                  Hepsi:
                                </strong>{" "}
                                Script çalıştırıldığında formatı seçmenize
                                olanak tanır.
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-200 shadow-sm">
                          <div className="card-body p-4">
                            <h4 className="card-title text-lg text-primary">
                              ⚙️ Adım 2: Gelişmiş Ayarlar
                            </h4>
                            <p>
                              İsterseniz gelişmiş ayarları düzenleyebilirsiniz:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-2">
                              <li>
                                <strong className="text-secondary">
                                  Klip Başı/Sonu Boşluk (Margin):
                                </strong>{" "}
                                Kesilen klipler arasında bırakılacak boşluk
                                miktarı.
                              </li>
                              <li>
                                <strong className="text-secondary">
                                  Ses Eşiği (Threshold):
                                </strong>{" "}
                                Kesim için kullanılacak ses eşiği değeri. Düşük
                                değerler daha hassas kesim yapar (sadece Akıllı
                                Kesim ve Hepsi modlarında).
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="card bg-base-200 shadow-sm">
                          <div className="card-body p-4">
                            <h4 className="card-title text-lg text-primary">
                              🚀 Adım 3: Scripti Kullanma
                            </h4>
                            <ol className="list-decimal list-inside space-y-2 ml-2">
                              <li>
                                Oluşturulan scripti kopyalamak için script
                                penceresinin sağ üst köşesindeki{" "}
                                <LuClipboardCopy className="inline" /> kopyalama
                                butonuna tıklayın.
                              </li>
                              <li>
                                Kopyalanan metni{" "}
                                <code className="px-1 py-0.5 bg-base-300 rounded">
                                  .bat
                                </code>{" "}
                                uzantılı bir dosyaya kaydedin (örn:{" "}
                                <code className="px-1 py-0.5 bg-base-300 rounded">
                                  auto_editor.bat
                                </code>
                                ).
                              </li>
                              <li>
                                Oluşturduğunuz bat dosyasını çalıştırın ve video
                                dosyanızı seçin.
                              </li>
                              <li>
                                Auto-Editor işlemi tamamlandığında çıktı
                                dosyalarınızı kullanabilirsiniz.
                              </li>
                            </ol>
                          </div>
                        </div>

                        <div className="card bg-base-200 shadow-sm">
                          <div className="card-body p-4">
                            <h4 className="card-title text-lg text-primary">
                              📝 Akıllı Kesim Modu Özel Kullanımı
                            </h4>
                            <p className="mb-2">
                              Akıllı Kesim modunu seçtikten sonra:
                            </p>
                            <ol className="list-decimal list-inside space-y-2 ml-2">
                              <li>
                                İsterseniz bir çıktı formatı (Premiere Pro,
                                Davinci Resolve, Final Cut Pro) seçebilirsiniz.
                              </li>
                              <li>
                                Seçili çıktı formatına tekrar tıklayarak seçimi
                                kaldırabilir ve sadece MP4 çıktısı
                                alabilirsiniz.
                              </li>
                              <li>
                                Formatı değiştirdiğinizde script otomatik olarak
                                güncellenir.
                              </li>
                            </ol>
                          </div>
                        </div>

                        <div className="card bg-base-200 shadow-sm border border-accent">
                          <div className="card-body p-4">
                            <h4 className="card-title text-accent">
                              🛑 Önemli Not
                            </h4>
                            <p>
                              Bu scripti kullanmak için bilgisayarınızda{" "}
                              <a
                                href="https://auto-editor.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link link-primary"
                              >
                                Auto-Editor
                              </a>{" "}
                              programının yüklü olması gerekir.
                            </p>

                            <div className="mt-3 p-3 bg-base-300 rounded-lg">
                              <h5 className="font-semibold text-base mb-2">
                                Auto-Editor Yükleme
                              </h5>
                              <p className="text-sm mb-2">
                                Auto-Editor yüklemek için sadece iki adım
                                gereklidir:
                              </p>
                              <ol className="list-decimal list-inside space-y-1 ml-2 text-sm">
                                <li>
                                  <a
                                    href="https://www.python.org/downloads/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link link-primary"
                                  >
                                    Python
                                  </a>{" "}
                                  kurulumunu yapın (En yeni sürüm)
                                  <div className="mt-2 mb-3">
                                    <p className="text-sm text-warning mb-2">
                                      <strong>Önemli:</strong> Kurulum sırasında{" "}
                                      <span className="text-accent font-bold">
                                        "Add Python to PATH"
                                      </span>{" "}
                                      seçeneğini işaretlemeyi unutmayın!
                                    </p>
                                    <div className="rounded-lg border border-base-300 overflow-hidden">
                                      <img
                                        src="https://i.imgur.com/1rBOfqk.jpeg"
                                        alt="Python PATH ayarı"
                                        className="w-full object-contain"
                                      />
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  Komut isteminde (Command Prompt) şu komutu
                                  çalıştırın:
                                  <div className="bg-neutral text-neutral-content p-2 mt-1 mb-1 rounded overflow-auto">
                                    <code>pip install auto-editor</code>
                                  </div>
                                  <div className="mt-2 mb-3">
                                    <div className="rounded-lg border border-base-300 overflow-hidden">
                                      <img
                                        src="https://i.imgur.com/jw46d9M.png"
                                        alt="pip install auto-editor komutu"
                                        className="w-full object-contain"
                                      />
                                    </div>
                                    <p className="text-xs text-base-content/70 mt-1 text-center italic">
                                      CMD'de pip install auto-editor komutunun
                                      kullanımı
                                    </p>
                                  </div>
                                </li>
                              </ol>
                              <p className="text-sm mt-2">
                                Daha fazla bilgi için{" "}
                                <a
                                  href="https://github.com/WyattBlue/auto-editor"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="link link-primary"
                                >
                                  GitHub sayfasını
                                </a>{" "}
                                ziyaret edebilirsiniz.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* YouTube Video Bölümü */}
                        <section className="mb-8 p-4 rounded-lg bg-accent/10">
                          <h2 className="text-2xl font-semibold mb-4 text-accent">
                            İlgili Video
                          </h2>
                          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                            <iframe
                              src="https://www.youtube.com/embed/H3K21TpQa1g"
                              title="Auto-Editor Kullanım Videosu"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-base-100 p-4 border-t border-base-300 flex flex-col sm:flex-row justify-between items-center gap-3 rounded-b-2xl">
                    <label className="cursor-pointer flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={dontShowAgain}
                        onChange={handleDontShowAgain}
                      />
                      <span className="text-sm">Tekrar gösterme</span>
                    </label>
                    <button
                      onClick={closeHowToUse}
                      className="btn btn-primary w-full sm:w-auto"
                    >
                      Anladım
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoEditor;
