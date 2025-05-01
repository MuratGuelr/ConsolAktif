import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { LuClipboardCopy } from "react-icons/lu";
import { toast } from "react-toastify";

const AutoEditor = () => {
  const [config, setConfig] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [appName, setAppName] = useState(null);
  const [advancedConfig, setAdvancedConfig] = useState({
    margin: "0.02",
  });

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

  const getAppName = () => {
    if (selectedOption === "premiere") {
      setAppName("Premiere Pro");
    } else if (selectedOption === "resolve") {
      setAppName("Davinci Resolve");
    } else if (selectedOption === "final-cut") {
      setAppName("Final Cut");
    } else if (selectedOption === "mp4") {
      setAppName("Mp4 Çıktı");
    } else if (selectedOption === "all") {
      setAppName("Hepsi");
    } else if (selectedOption === "best") {
      setAppName("En iyi sonuç için");
    }
  };

  useEffect(() => {
    getAppName();
  }, [selectedOption]);

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
        batchScript += `@cls\nauto-editor "!FileName!" --frame-margin ${marginParam} --edit audio:threshold=0.5 \n@pause`;
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
auto-editor "!FileName!" %export% --frame-margin ${marginParam}  --edit audio:threshold=0.05\n@pause`;
        break;
      default:
        batchScript = "Hatalı seçim yapıldı!";
    }

    setConfig(batchScript);
  };

  const copyToClipboard = () => {
    if (config === "") {
      toast.error("Bir seçenek seçtikten sonra kopyalayabilirsin!");
      return;
    }
    navigator.clipboard.writeText(config);
    toast.success("Kod kopyalandı!");
  };

  useEffect(() => {
    document.title = "ConsolAktif Auto-Editor";
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = "/apps/auto-editor/app.png";
    }
  }, []);

  return (
    <>
      <div className="mockup-window border border-gray-500 w-fit m-10 mx-auto bg-gray-700">
        <div className="grid place-content-center border-t border-gray-500 h-full p-2">
          <div className="grid p-5">
            <Header
              title={"Auto Editor Batch Script"}
              subtitle={"made by ConsolAktif"}
            />
            {showAdvancedSettings && (
              <div className="mb-1 bg-base-300 p-5 rounded-xl">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Boşluk ({advancedConfig.margin} saniye)
                </label>
                <input
                  type="range"
                  step="0.01"
                  min="0"
                  max="3"
                  className="range w-full"
                  value={advancedConfig.margin}
                  onChange={(e) =>
                    handleAdvancedConfigChange("margin", e.target.value)
                  }
                />
              </div>
            )}
            <div className="bg-base-300 p-10 relative rounded-xl">
              <div className="relative w-full indicator">
                {selectedOption && (
                  <span className="indicator-start absolute -mt-3 -ml-3 badge badge-primary">
                    {appName}
                  </span>
                )}
                <textarea
                  type="text"
                  placeholder="Lütfen bir seçenek seçiniz..."
                  className="textarea textarea-primary w-full p-5 h-72 rounded-xl resize-none"
                  disabled={!config || config.trim() === ""}
                  defaultValue={config}
                ></textarea>
                <LuClipboardCopy
                  size={25}
                  className={`absolute end-0 top-5 right-5 cursor-pointer transition-all duration-200 ${
                    !config ? "text-gray-700" : "text-gray-100 hover:scale-105"
                  }`}
                  onClick={copyToClipboard}
                />
              </div>
              <div>
                <div className="flex bg-base-100 mt-2 p-4 justify-center rounded-xl">
                  <div className="flex gap-5 overflow-clip">
                    <button
                      className={`btn h-full p-1 transition-all duration-300 ${
                        selectedOption === "premiere" ||
                        selectedOption === "all"
                          ? "btn-active bg-info-content scale-90"
                          : "btn-ghost grayscale"
                      } ${
                        selectedOption === "premiere"
                          ? "btn-active bg-info-content"
                          : "btn-ghost"
                      }`}
                      onClick={() => handleButtonClick("premiere")}
                    >
                      <img
                        src="./apps/auto-editor/premiere-pro.png"
                        className="h-12 w-auto"
                      />
                    </button>
                    <button
                      className={`btn  h-full p-1 transition-all duration-300 ${
                        selectedOption === "resolve" || selectedOption === "all"
                          ? "btn-active bg-info-content scale-90"
                          : "btn-ghost grayscale"
                      } ${
                        selectedOption === "resolve"
                          ? "btn-active bg-info-content"
                          : "btn-ghost"
                      }`}
                      onClick={() => handleButtonClick("resolve")}
                    >
                      <img
                        src="./apps/auto-editor/davinci-resolve.png"
                        className="h-12 w-auto"
                      />
                    </button>
                    <button
                      className={`btn h-full p-1 transition-all duration-300 ${
                        selectedOption === "final-cut" ||
                        selectedOption === "all"
                          ? "btn-active bg-info-content scale-90"
                          : "btn-ghost grayscale"
                      } ${
                        selectedOption === "final-cut"
                          ? "btn-active bg-info-content"
                          : "btn-ghost"
                      }`}
                      onClick={() => handleButtonClick("final-cut")}
                    >
                      <img
                        src="./apps/auto-editor/final-cut.png"
                        className="h-12 w-auto"
                      />
                    </button>
                    <button
                      className={`btn  h-full p-1 transition-all duration-300 ${
                        selectedOption === "mp4" || selectedOption === "all"
                          ? "btn-active bg-info-content scale-90"
                          : "btn-ghost grayscale"
                      } ${
                        selectedOption === "mp4"
                          ? "btn-active bg-info-content"
                          : "btn-ghost"
                      }`}
                      onClick={() => handleButtonClick("mp4")}
                    >
                      <img
                        src="./apps/auto-editor/mp4.png"
                        className="h-12 w-auto"
                      />
                    </button>
                    <button
                      className={`btn  h-full p-1 transition-all duration-300 ${
                        selectedOption === "all"
                          ? "btn-active bg-info-content scale-125"
                          : "btn-ghost grayscale"
                      }`}
                      onClick={() => handleButtonClick("all")}
                    >
                      <img
                        src="./apps/auto-editor/all.png"
                        className="h-12 w-auto"
                      />
                    </button>
                    <button
                      className={`btn  h-full p-1 transition-all duration-300 ${
                        selectedOption === "best"
                          ? "btn-active bg-info-content scale-90"
                          : "btn-ghost grayscale"
                      }`}
                      onClick={() => handleButtonClick("best")}
                    >
                      <img src="./logo/logo.png" className="h-12 w-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoEditor;
