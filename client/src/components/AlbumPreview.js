import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

export default function AlbumPreview({ images }) {
  const flipBook = useRef(null);

  // ✅ Converts any Google Drive URL into a direct embeddable image link
  const convertDriveUrl = (url) => {
    if (!url) return "";

    // Ensure https
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    // Extract Google Drive file ID from different possible formats
    let match = url.match(/\/d\/([^/]+)/);
    if (!match) match = url.match(/[?&]id=([^&]+)/);
    const fileId = match ? match[1] : null;

    if (!fileId) return url;

    // ✅ Use googleusercontent domain (reliable for <img> display)
    return `https://lh3.googleusercontent.com/d/${fileId}=s2000`;
  };

  // 🧩 Process all image URLs
  const processedImages = images.map((img) => ({
    ...img,
    url: convertDriveUrl(img.url),
  }));

  console.log("Processed Drive URLs:", processedImages.map((i) => i.url));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <HTMLFlipBook width={400} height={500} showCover={true}>
        {processedImages.map((img) => (
          <div
            key={img.id}
            style={{
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={img.url}
              alt={img.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                console.warn("Image failed:", img.url);
                e.target.src =
                  "https://via.placeholder.com/400x500?text=Image+Not+Found";
              }}
            />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
