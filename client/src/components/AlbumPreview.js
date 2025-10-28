import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

export default function AlbumPreview({ images }) {
  const flipBook = useRef(null);

  // ✅ Converts Google Drive URLs into direct image links
  const convertDriveUrl = (url) => {
    if (!url) return "";
    if (!url.startsWith("http")) url = "https://" + url;

    let match = url.match(/\/d\/([^/]+)/);
    if (!match) match = url.match(/[?&]id=([^&]+)/);
    const fileId = match ? match[1] : null;

    if (!fileId) return url;
    return `https://lh3.googleusercontent.com/d/${fileId}=s2000`;
  };

  // 🧩 Process image URLs
  const processedImages = images.map((img) => ({
    ...img,
    url: convertDriveUrl(img.url),
  }));

  // 📖 Ensure even number of pages (add blank if odd)
  const pages =
    processedImages.length % 2 === 0
      ? processedImages
      : [...processedImages, { id: "blank", url: "", name: "Blank" }];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <HTMLFlipBook
        width={350}
        height={450}
        showCover={true}
        size="fixed"
        minWidth={350}
        maxWidth={900}
        minHeight={450}
        maxHeight={1200}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={false} // ✅ Forces two-page landscape view
        startPage={0}
        mobileScrollSupport={true}
        style={{
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          backgroundColor: "#ddd",
        }}
      >
        {pages.map((img, i) => (
          <div
            key={img.id || i}
            style={{
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              border: "1px solid #ccc",
            }}
          >
            {img.url ? (
              <img
                src={img.url}
                alt={img.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/350x450?text=Image+Not+Found";
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#f4f4f4",
                  color: "#aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                Blank Page
              </div>
            )}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
