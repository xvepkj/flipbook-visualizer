import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

export default function AlbumPreview({ images, albumTitle }) {
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

  // 🖤 Add album title as first left page (cover)
  let pages = [
    { id: "cover", title: albumTitle },
    ...images.map((img) => ({
      ...img,
      url: convertDriveUrl(img.url),
    })),
  ];

  // 📖 Ensure even number of pages for two-page layout
  if (pages.length % 2 !== 0) {
    pages.push({ id: "blank", url: "", name: "Blank Page" });
  }

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
        showCover={false} // ❌ We manually handle the cover
        size="fixed"
        minWidth={350}
        maxWidth={900}
        minHeight={450}
        maxHeight={1200}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={false} // ✅ Two-page landscape view
        startPage={0}
        mobileScrollSupport={true}
        style={{
          boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
          backgroundColor: "#ddd",
        }}
      >
        {pages.map((page, i) => {
          // 🖤 Render album title centered on the first page
          if (page.title) {
            return (
              <div
                key={page.id}
                style={{
                  background: "linear-gradient(145deg, #2f3542, #57606f)",
                  color: "white",
                  fontSize: "28px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  padding: "20px",
                  border: "2px solid #1e272e",
                  fontFamily: "serif",
                }}
              >
                {page.title}
              </div>
            );
          }

          // 🔹 Render normal image pages
          return (
            <div
              key={page.id || i}
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
              {page.url ? (
                <img
                  src={page.url}
                  alt={page.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                  {page.name || "Blank Page"}
                </div>
              )}
            </div>
          );
        })}
      </HTMLFlipBook>
    </div>
  );
}
