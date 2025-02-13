import React, { useState } from 'react';
import './App.css';  // To use Tailwind or your custom styles
import TextToSpeech from './components/TextToSpeech';

const App = () => {
  const [generatedText, setGeneratedText] = useState('No nap, i just been working on my project');
  return (
    <div class="app-container">
  
  <div class="header">
    Podcast Generator
  </div>

  
  <div class="buttons-container">
    <button class="upload-audio">🎤 Upload Audio</button>
    <button class="enter-transcript">✏️ Enter Transcript</button>
  </div>
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold">Podcast Text-to-Speech</h1>
        <TextToSpeech text={generatedText} />
      </div>
    </div>

 
  <textarea placeholder="Paste your transcript here..."></textarea>

  
  <button class="generate-btn">Generate Podcast Magic ✨</button>
</div>
  );
}

export default App;
