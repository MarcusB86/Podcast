import React, { useState } from "react";

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
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-bold">Text-to-Speech</h2>
      <p className="text-gray-600">{text || "No text available"}</p>
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={handleSpeak} 
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          disabled={isSpeaking}
        >
          🔊 Speak
        </button>
        <button 
          onClick={handleStop} 
          className="px-4 py-2 bg-red-500 text-white rounded-md"
          disabled={!isSpeaking}
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  );
};

export default TextToSpeech;
