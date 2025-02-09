import React, { useState } from 'react';
import './App.css';  // To use Tailwind or your custom styles

const App = () => {
  return (
    <div class="app-container">
  
  <div class="header">
    Podcast Generator
  </div>

  
  <div class="buttons-container">
    <button class="upload-audio">🎤 Upload Audio</button>
    <button class="enter-transcript">✏️ Enter Transcript</button>
  </div>

 
  <textarea placeholder="Paste your transcript here..."></textarea>

  
  <button class="generate-btn">Generate Podcast Magics ✨</button>
</div>
  );
}

export default App;
