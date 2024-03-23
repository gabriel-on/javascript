import React, { useState } from 'react';
import './App.css';
import CustomVideoPlayer from './Components/CustomVideoPlayer/CustomVideoPlayer';

function App() {
  const [videos, setVideos] = useState([]);

  const handleVideoChange = (event) => {
    const files = event.target.files;
    const videoURLs = [];
    for (let i = 0; i < files.length; i++) {
      const videoURL = URL.createObjectURL(files[i]);
      videoURLs.push(videoURL);
    }
    setVideos(videoURLs);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Netflix Clone</h1>
      </header>
      <CustomVideoPlayer videoURL="dQw4w9WgXcQ"/>
    </div>
  );
}

export default App;
