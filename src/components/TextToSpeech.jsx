import React, { useState } from "react";
import "./TextToSpeech.css"; // Import CSS for styling

const TextToSpeech = ({ text }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!text) {
      alert("No text provided!");
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    // Optional: Customize voice settings
    speech.lang = "en-US";
    speech.rate = 1; // Speed (0.5 = slow, 1 = normal, 2 = fast)
    speech.pitch = 1; // Pitch (0 = low, 1 = normal, 2 = high)

    speech.onstart = () => setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(speech);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="tts-container">
      <h2 className="tts-title">Text-to-Speech</h2>
      <p className="tts-text">{text || "No text available"}</p>
      <div className="tts-buttons">
        <button onClick={handleSpeak} className="speak-btn" disabled={isSpeaking}>
          🔊 Speak
        </button>
        <button onClick={handleStop} className="stop-btn" disabled={!isSpeaking}>
          ⏹ Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;
