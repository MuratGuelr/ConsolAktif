import React, { useEffect, useState } from "react";
import VoiceSlider from "./VoiceSlider";

const AudioMeter = ({
  onThresholdChange,
  selectedOption,
}) => {
  const [inputVolume, setInputVolume] = useState(2);

  useEffect(() => {
    const threshold = (inputVolume / 100).toFixed(2);
    onThresholdChange(threshold);
  }, [inputVolume, onThresholdChange]);

  return (
    <>
      {(selectedOption === "best" || selectedOption === "all") && (
        <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
          <VoiceSlider
            setInputVolume={setInputVolume}
            inputVolume={inputVolume}
          />
        </div>
      )}
    </>
  );
};
export default AudioMeter;
