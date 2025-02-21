import React, { useState, useRef } from 'react';
import './App.css';  
import TextToSpeech from './components/TextToSpeech';
import AudioPlayer from './components/AudioPlayer';

const App = () => {
  const [generatedText, setGeneratedText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [showTranscriptInput, setShowTranscriptInput] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef(null);

  
  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const allowedTypes = ["audio/mp3", "audio/wav", "audio/ogg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload an MP3, WAV, or OGG file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("audioFile", file);
  
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        setAudioFile(`http://localhost:5000${data.filePath}`);
      } else {
        console.error("Upload failed:", data.error);
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload audio. Please try again.");
    }
  };
  

  const handleTranscriptSubmit = () => {
    setGeneratedText(transcriptText);
    setShowTranscriptInput(false); 
  };

  const handleGeneratePodcast = async () => {
    if (!generatedText) {
      alert("Please enter a transcript before generating the podcast.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://localhost:5000/generate-podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: generatedText }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setAudioFile(`http://localhost:5000${data.audioPath}`);
      } else {
        console.error("Podcast generation failed:", data.error);
        alert("Podcast generation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error generating podcast:", error);
      alert("Error generating podcast. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="app-container">

      <div className="buttons-container">
        
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleAudioUpload}
          className="hidden-input"
        />
        
        <button className="upload-audio" onClick={() => fileInputRef.current.click()}>
          🎤 Upload Audio
        </button>

        <button className="enter-transcript" onClick={() => setShowTranscriptInput(!showTranscriptInput)}>
          ✏️ Enter Transcript
        </button>
      </div>

      {showTranscriptInput && (
        <div className="transcript-container">
          <h2>Enter Transcript</h2>
          <textarea
            className="transcript-input"
            rows="4"
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            placeholder="Type or paste transcript here..."
          ></textarea>
          <button className="submit-btn" onClick={handleTranscriptSubmit}>
            Submit
          </button>
        </div>
      )}

      <div className="section-container">
        <h1>Podcast Text-to-Speech</h1>
        <TextToSpeech text={generatedText} />
      </div>

      <button 
  className={`generate-btn ${loading ? "disabled" : ""}`}
  onClick={handleGeneratePodcast}
  disabled={loading}
>
  {loading ? <div className="spinner"></div> : "🎙 Generate Podcast"}
</button>


      {audioFile && (
        <div className="section-container">
          <h1>Podcast Audio Playback</h1>
          <AudioPlayer audioSrc={audioFile} />
          <a href={audioFile} download="generated-podcast.mp3" className="download-btn">
            📥 Download Podcast
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
