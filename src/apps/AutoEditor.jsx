import React, { useState } from "react";
import { HiClipboardCopy } from "react-icons/hi";
import { FaInfoCircle, FaYoutube } from "react-icons/fa";
import Header from "../components/Header/Header";
import { toast } from "react-toastify";
import AudioMeter from "../components/AudioMeter/VoiceSlider/AudioMeter";
import { useSpring, animated, useTrail } from "@react-spring/web";

const AutoEditor = () => {
  const [config, setConfig] = useState("Lütfen bir seçenek seçiniz...");
  const [selectedOption, setSelectedOption] = useState(null);
  const [advancedConfig, setAdvancedConfig] = useState({
    margin: "0.02",
  });
  const [audioThreshold, setAudioThreshold] = useState(0.02);

  const showAdvancedSettings = selectedOption !== null;

  const handleAdvancedConfigChange = (key, value) => {
    setAdvancedConfig((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (selectedOption) {
      handleButtonClick(selectedOption);
    }
  };

  const handleThresholdChange = (newThreshold) => {
    const threshold = parseFloat(newThreshold);
    setAudioThreshold(threshold);

    if (selectedOption === "best" || selectedOption === "all") {
      handleButtonClick(selectedOption);
    }
  };

  const handleButtonClick = (type) => {
    setSelectedOption(type);
    let batchScript = `@echo off\nsetlocal enabledelayedexpansion\ncolor b\nset pwshcmd=powershell -noprofile -command "&{[System.Reflection.Assembly]::LoadWithPartialName('System.windows.forms') | Out-Null;$OpenFileDialog = New-Object System.Windows.Forms.OpenFileDialog; $OpenFileDialog.ShowDialog()|out-null; $OpenFileDialog.FileName}"\nfor /f "delims=" %%I in ('%pwshcmd%') do set "FileName=%%I"\nset FnS=Dosya seçilmediği için program kapatıldı.\nif "%FileName%"=="" (\n    start cmd /c "@echo off & mode con cols=70 lines=10 & @color b & echo - %FnS% - & pause>nul"\n    exit\n)\n`;

    const marginParam = advancedConfig.margin
      ? ` -m ${advancedConfig.margin}sec`
      : "";

    switch (type) {
      case "premiere":
        batchScript += `@cls\nauto-editor "!FileName!" --frame-margin ${marginParam} --export premiere\n@pause`;
        break;
      case "resolve":
        batchScript += `@cls\nauto-editor "!FileName!" --frame-margin ${marginParam} --export resolve\n@pause`;
        break;
      case "final-cut":
        batchScript += `@cls\nauto-editor "!FileName!" --frame-margin ${marginParam} --export final-cut-pro\n@pause`;
        break;
      case "mp4":
        batchScript += `@cls\nauto-editor "!FileName!" --frame-margin ${marginParam}\n@pause`;
        break;
      case "best":
        batchScript += `@cls\nauto-editor "!FileName!" --frame-margin ${marginParam} --edit audio:threshold=${audioThreshold}\n@pause`;
        break;
      case "all":
        batchScript += `
@echo [1] Premiere Pro
@echo [2] Davinci Resolve
@echo [3] Final Cut Pro
@echo [4] Video ciktisi

set /p choice=Seciminizi yapin (1-4): 

if "%choice%"=="1" (
    set "export=--export premiere"
) else if "%choice%"=="2" (
    set "export=--export resolve"
) else if "%choice%"=="3" (
    set "export=--export final-cut-pro"
) else if "%choice%"=="4" (
    set "export="
) else (
    echo Gecersiz secim. Program kapatiliyor.
    pause
    exit
)
@cls
auto-editor "!FileName!" %export% --frame-margin ${marginParam}  --edit audio:threshold=${audioThreshold}\n@pause`;
        break;
      default:
        batchScript = "Hatalı seçim yapıldı!";
    }

    setConfig(batchScript);
  };

  const copyToClipboard = () => {
    if (config === "Lütfen bir seçenek seçiniz...") {
      toast.error("Lütfen önce bir seçenek seçin!");
      return;
    }
    navigator.clipboard.writeText(config);
    toast.success("Kod kopyalandı!");
  };

  // Kart animasyonu
  const cardSpring = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  // Buton animasyonları
  const buttons = [
    {
      type: "premiere",
      img: "./apps/auto-editor/premiere-pro.png",
      alt: "Premiere Pro",
    },
    {
      type: "resolve",
      img: "./apps/auto-editor/davinci-resolve.png",
      alt: "Davinci Resolve",
    },
    {
      type: "final-cut",
      img: "./apps/auto-editor/final-cut.png",
      alt: "Final Cut",
    },
    { type: "mp4", img: "./apps/auto-editor/mp4.png", alt: "MP4" },
    { type: "all", img: "./apps/auto-editor/all.png", alt: "All Options" },
    { type: "best", img: "./logo/logo.png", alt: "Best Quality" },
  ];

  const trail = useTrail(buttons.length, {
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 300, friction: 20 },
  });

  // Margin input animasyonu
  const marginSpring = useSpring({
    value: parseFloat(advancedConfig.margin),
    config: { tension: 300, friction: 20 },
  });

  // Margin container animasyonu
  const marginContainerSpring = useSpring({
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 280, friction: 20 },
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-8 py-8">
      <Header title={"Auto Editor Batch Script"} />
      <animated.div style={cardSpring} className="mx-auto px-8">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            <span className="text-gray-500 text-sm">made by</span>{" "}
            <span className="text-gray-400 text-base">ConsolAktif</span>
          </h2>
        </div>

        {showAdvancedSettings && (
          <>
            <AudioMeter
              onThresholdChange={handleThresholdChange}
              selectedOption={selectedOption}
            />
            <animated.div
              style={marginContainerSpring}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Boşluk ({advancedConfig.margin} saniye)
                </label>
                <div className="relative mt-2">
                  <animated.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full"
                    style={{
                      width: marginSpring.value.to((v) => `${(v / 3) * 100}%`),
                    }}
                  />
                  <input
                    type="range"
                    step="0.01"
                    min="0"
                    max="3"
                    value={advancedConfig.margin}
                    onChange={(e) =>
                      handleAdvancedConfigChange("margin", e.target.value)
                    }
                    className="relative z-10 w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    style={{
                      WebkitAppearance: "none",
                      background: "transparent",
                    }}
                  />
                </div>
                <animated.div
                  className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                  style={{
                    transform: marginSpring.value.to(
                      (v) => `scale(${1 + v / 10})`
                    ),
                  }}
                ></animated.div>
              </div>
            </animated.div>
          </>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-4 relative">
            <textarea
              id="code"
              rows="15"
              value={config}
              readOnly
              className="w-full px-4 py-3 text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white overflow-y-auto"
              disabled
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2 px-2 py-2  transition-colors absolute top-6 right-6"
            >
              <HiClipboardCopy size={25} />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
            {trail.map((style, index) => (
              <animated.button
                key={buttons[index].type}
                style={style}
                onClick={() => handleButtonClick(buttons[index].type)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  selectedOption === buttons[index].type
                    ? "bg-blue-100 dark:bg-blue-900 scale-110 filter-none"
                    : `hover:bg-gray-200 dark:hover:bg-gray-600 ${
                        selectedOption === "all" ? "" : "grayscale"
                      } hover:grayscale-0`
                }`}
              >
                <img
                  src={buttons[index].img}
                  className="w-10 h-10 object-contain"
                  alt={buttons[index].alt}
                />
              </animated.button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button></button>

          <div className="flex gap-4">
            <a
              href="https://www.youtube.com/@ConsolAktif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <FaYoutube size={25} />
            </a>
            <a
              href="https://auto-editor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              <FaInfoCircle size={25} />
            </a>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default AutoEditor;
