import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { v4 as uuidv4 } from "uuid";

export default function AlbumPreview({ images, albumTitle, hideShareButton = false }) {
  const flipBook = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Shareable link state
  const [shareLink, setShareLink] = useState("");

  // Converts Google Drive URLs into direct image links
  const convertDriveUrl = (url) => {
    if (!url) return "";
    if (!url.startsWith("http")) url = "https://" + url;

    let match = url.match(/\/d\/([^/]+)/);
    if (!match) match = url.match(/[?&]id=([^&]+)/);
    const fileId = match ? match[1] : null;

    if (!fileId) return url;
    return `https://lh3.googleusercontent.com/d/${fileId}=s2000`;
  };

  // Normalize images
  const normalizedImages = images.map((img, idx) => {
    const url = typeof img === "string" ? img : img.url;
    const name = img.name || `Image ${idx + 1}`;
    return { id: idx, url: convertDriveUrl(url), name };
  });

  // Add album title as first page (cover)
  let pages = [
    { id: "cover", title: "" },
    ...normalizedImages,
  ];

  // Ensure even number of pages for two-page layout
  if (pages.length % 2 !== 0) {
    pages.push({ id: "blank", url: "", name: "Blank Page" });
  }

  // Navigation functions
  const goNext = () => {
    if (flipBook.current) flipBook.current.pageFlip().flipNext();
  };

  const goPrev = () => {
    if (flipBook.current) flipBook.current.pageFlip().flipPrev();
  };

  // Share button handler
  const handleShare = () => {
    const albumId = uuidv4();
    const albumData = {
      id: albumId,
      title: albumTitle,
      images: normalizedImages.map((img) => img.url),
    };

    localStorage.setItem(`album-${albumId}`, JSON.stringify(albumData));

    const url = `${window.location.origin}/album/${albumId}`;
    setShareLink(url);

    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
      <HTMLFlipBook
        ref={flipBook}
        width={350}
        height={450}
        showCover={false}
        size="fixed"
        minWidth={350}
        maxWidth={900}
        minHeight={450}
        maxHeight={1200}
        drawShadow={true}
        flippingTime={700}
        usePortrait={false}
        startPage={0}
        onFlip={(e) => setCurrentPage(e.data)}
        mobileScrollSupport={true}
        style={{ boxShadow: "0 8px 25px rgba(0,0,0,0.25)", backgroundColor: "#ddd" }}
      >
        {pages.map((page, i) =>
          page.title ? (
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
          ) : (
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
                  {albumTitle || "Blank Page"}
                </div>
              )}
            </div>
          )
        )}
      </HTMLFlipBook>

      {/* Navigation and Share buttons */}
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 20 }}>
        <button onClick={goPrev} style={{ padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
          Previous
        </button>
        <span>Page {currentPage + 1} / {pages.length}</span>
        <button onClick={goNext} style={{ padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
          Next
        </button>
        {!hideShareButton && (
          <button onClick={handleShare} style={{ padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
            Share Album
          </button>
        )}
      </div>
    </div>
  );
}
