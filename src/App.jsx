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

  // Handle file upload
  const handleAudioUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('audioFile', file);
  
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        setAudioFile(`http://localhost:5000${data.filePath}`);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Handle transcript submission
  const handleTranscriptSubmit = () => {
    setGeneratedText(transcriptText);
    setShowTranscriptInput(false); // Hide input after submitting
  };

  // Handle podcast generation
  const handleGeneratePodcast = async () => {
    if (!generatedText) {
      alert('Please enter a transcript before generating the podcast.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/generate-podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: generatedText }),
      });

      const data = await response.json();
      if (response.ok) {
        setAudioFile(`http://localhost:5000${data.audioPath}`);
      } else {
        console.error('Podcast generation failed:', data.error);
      }
    } catch (error) {
      console.error('Error generating podcast:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Buttons */}
      <div className="buttons-container">
        {/* Hidden file input */}
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleAudioUpload}
          className="hidden-input"
        />
        
        {/* Upload Audio Button */}
        <button className="upload-audio" onClick={() => fileInputRef.current.click()}>
          🎤 Upload Audio
        </button>

        {/* Enter Transcript Button */}
        <button className="enter-transcript" onClick={() => setShowTranscriptInput(!showTranscriptInput)}>
          ✏️ Enter Transcript
        </button>
      </div>

      {/* Transcript Input Area */}
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

      {/* Text-to-Speech Section */}
      <div className="section-container">
        <h1>Podcast Text-to-Speech</h1>
        <TextToSpeech text={generatedText} />
      </div>

      {/* Generate Podcast Button */}
      <button 
        className={`generate-btn ${loading ? 'disabled' : ''}`}
        onClick={handleGeneratePodcast}
        disabled={loading}
      >
        {loading ? 'Generating Podcast...' : '🎙 Generate Podcast'}
      </button>

      {/* Audio Player Section */}
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
