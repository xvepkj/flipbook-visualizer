import React, { useState } from "react";
import FolderInput from "./components/FolderInput";
import AlbumPreview from "./components/AlbumPreview";

function App() {
  const [images, setImages] = useState([]);

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
        <FolderInput onImagesFetched={setImages} />
      ) : (
        <AlbumPreview images={images} />
      )}
    </div>
  );
}

export default App;
