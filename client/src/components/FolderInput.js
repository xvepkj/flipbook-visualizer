import React, { useState } from "react";
import { fetchImages } from "../api";

export default function FolderInput({ onImagesFetched }) {
  const [link, setLink] = useState("");
  const [albumTitle, setAlbumTitle] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!albumTitle.trim()) {
      setError("Please enter an album title");
      return;
    }

    setLoading(true);
    try {
      const images = await fetchImages(link);
      // pass albumTitle along with images
      onImagesFetched(images, albumTitle); 
    } catch (err) {
      setError("Failed to load images. Check the link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}
    >
      <input
        type="text"
        placeholder="Enter album title"
        value={albumTitle}
        onChange={(e) => setAlbumTitle(e.target.value)}
        style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "8px", width: "300px" }}
      />

      <input
        type="text"
        placeholder="Paste your Google Drive folder link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{ border: "1px solid #ccc", borderRadius: "6px", padding: "8px", width: "300px" }}
      />

      <button
        disabled={loading}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        {loading ? "Loading..." : "Create Flipbook"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
