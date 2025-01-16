import React, { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { useSpring, animated, config } from "@react-spring/web";

const VoiceSlider = ({ setInputVolume, inputVolume }) => {
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });
  const [selectedInput, setSelectedInput] = useState("");
  const [selectedOutput, setSelectedOutput] = useState("");
  const [inputLevel, setInputLevel] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);

  // Cihazları listele
  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );
        const audioOutputs = devices.filter(
          (device) => device.kind === "audiooutput"
        );

        setDevices({
          inputs: audioInputs,
          outputs: audioOutputs,
        });

        if (audioInputs.length) setSelectedInput(audioInputs[0].deviceId);
        if (audioOutputs.length) setSelectedOutput(audioOutputs[0].deviceId);
      } catch (err) {
        console.error("Cihazlar listelenemedi:", err);
      }
    };

    getDevices();
  }, []);

  // Mikrofon değiştiğinde
  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: selectedInput ? { exact: selectedInput } : undefined,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        streamRef.current = stream;

        // Audio context ve analyser kurulumu
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);

        // Ses seviyesi ölçümü
        const measureLevel = () => {
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );
          analyserRef.current.getByteFrequencyData(dataArray);

          // Ortalama ses seviyesi
          const average =
            dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
          setInputLevel((average / 255) * 100);

          requestAnimationFrame(measureLevel);
        };

        measureLevel();
      } catch (err) {
        console.error("Ses başlatılamadı:", err);
      }
    };

    if (selectedInput) {
      setupAudio();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedInput]);

  // Mikrofon sesini kapatma/açma
  const toggleMicrophone = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  // Ses çıkışını kapatma/açma
  const toggleAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    if (audioContextRef.current) {
      audioContextRef.current.destination.gain.value = isAudioMuted ? 1 : 0;
    }
  };

  // Level bar animasyonu
  const levelBarSpring = useSpring({
    width: `${inputLevel}%`,
    config: config.gentle,
  });

  // Container animasyonu
  const containerSpring = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: config.gentle,
  });

  return (
    <animated.div
      style={containerSpring}
      className="bg-[#36393f] text-[#dcddde] p-5 rounded-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-medium">THRESHOLD AYARI</h2>
        <div className="flex gap-4">
          <button
            onClick={toggleMicrophone}
            className={`p-2 rounded-full ${
              isMicMuted ? "bg-red-500" : "bg-green-500"
            } hover:opacity-80 transition-opacity`}
          >
            {isMicMuted ? (
              <FaMicrophoneSlash size={20} />
            ) : (
              <FaMicrophone size={20} />
            )}
          </button>
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full ${
              isAudioMuted ? "bg-red-500" : "bg-green-500"
            } hover:opacity-80 transition-opacity`}
          >
            {isAudioMuted ? (
              <FaVolumeMute size={20} />
            ) : (
              <FaVolumeUp size={20} />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6 ">
        {/* Cihaz Seçimi */}
        <div className="space-y-4">
          <div className="flex gap-5">
            <div>
              <label className="block text-xs font-semibold text-white uppercase mb-2">
                Mikrofon
              </label>
              <select
                value={selectedInput}
                onChange={(e) => setSelectedInput(e.target.value)}
                className="w-full p-2 bg-[#202225] text-[#dcddde] border border-[#040405] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {devices.inputs.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Mikrofon ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white uppercase mb-2">
                Kulaklık
              </label>
              <select
                value={selectedOutput}
                onChange={(e) => setSelectedOutput(e.target.value)}
                className="w-full p-2 bg-[#202225] text-[#dcddde] border border-[#040405] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {devices.outputs.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Hoparlör ${device.deviceId.slice(0, 5)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ses Kontrolleri */}
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-semibold text-white uppercase mb-2">
              Threshold Ayarı ({inputVolume}%)
            </label>
            <div className="relative h-4">
              <animated.div
                style={levelBarSpring}
                className="h-4 bg-green-500 rounded-full absolute cursor-pointer z-50"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={inputVolume}
                onChange={(e) => setInputVolume(Number(e.target.value))}
                className="w-full h-4 bg-[#4f545c] rounded-lg appearance-none cursor-pointer accent-white absolute z-50 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default VoiceSlider;
