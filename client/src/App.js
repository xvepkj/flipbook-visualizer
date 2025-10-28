import React, { useState } from "react";
import FolderInput from "./components/FolderInput";
import AlbumPreview from "./components/AlbumPreview";

function App() {
  const [images, setImages] = useState([]);
  const [albumTitle, setAlbumTitle] = useState(""); // ✅ Album title state

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
        Flipbook Visualizer
      </h1>

      {images.length === 0 ? (
        <FolderInput
          onImagesFetched={(imgs, title) => {
            setImages(imgs);
            setAlbumTitle(title); // ✅ Set the album title
          }}
        />
      ) : (
        <AlbumPreview images={images} albumTitle={albumTitle} /> // ✅ Pass title to AlbumPreview
      )}
    </div>
  );
}

export default App;
