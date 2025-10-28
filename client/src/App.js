import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FolderInput from "./components/FolderInput";
import AlbumPreview from "./components/AlbumPreview";
import SharedAlbum from "./components/SharedAlbum";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page: Folder input */}
        <Route path="/" element={<FolderInputWrapper />} />

        {/* Shared album view */}
        <Route path="/album/:data" element={<SharedAlbum />} />
      </Routes>
    </Router>
  );
}

// Optional wrapper to handle FolderInput state and show AlbumPreview
function FolderInputWrapper() {
  const [images, setImages] = React.useState([]);
  const [albumTitle, setAlbumTitle] = React.useState("");

  return images.length > 0 ? (
    <AlbumPreview images={images} albumTitle={albumTitle} />
  ) : (
    <FolderInput
      onImagesFetched={(imgs, title) => {
        setImages(imgs);
        setAlbumTitle(title);
      }}
    />
  );
}

export default App;
