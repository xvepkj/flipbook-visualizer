import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { v4 as uuidv4 } from "uuid";

async function shortenUrl(longUrl) {
  const apiKey = process.env.REACT_APP_TINYURL_API_KEY;
  const res = await fetch(`https://api.tinyurl.com/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      url: longUrl,
      domain: "tiny.one"
    })
  });
  const data = await res.json();
  return data.data.tiny_url;
}

export default function AlbumPreview({ images, albumTitle, hideShareButton = false }) {
  const flipBook = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [shareLink, setShareLink] = useState("");

  const convertDriveUrl = (url) => {
    if (!url) return "";
    if (!url.startsWith("http")) url = "https://" + url;

    let match = url.match(/\/d\/([^/]+)/);
    if (!match) match = url.match(/[?&]id=([^&]+)/);
    const fileId = match ? match[1] : null;

    if (!fileId) return url;
    return `https://lh3.googleusercontent.com/d/${fileId}=s2000`;
  };

  const normalizedImages = images.map((img, idx) => {
    const url = typeof img === "string" ? img : img.url;
    const name = img.name || `Image ${idx + 1}`;
    return { id: idx, url: convertDriveUrl(url), name };
  });

  let pages = [{ id: "cover", title: "" }, ...normalizedImages];
  if (pages.length % 2 !== 0) pages.push({ id: "blank", url: "", name: "Blank Page" });

  const goNext = () => flipBook.current?.pageFlip().flipNext();
  const goPrev = () => flipBook.current?.pageFlip().flipPrev();

const handleShare = async () => {
  const albumData = {
    title: albumTitle,
    images: normalizedImages.map((img) => img.url),
  };

  // Convert album data to Base64
  const encoded = btoa(JSON.stringify(albumData));
  const url = `${window.location.origin}/album/${encoded}`;

  try {
    // Optional: shorten link
    const shortUrl = await shortenUrl(url);
    const shareUrl = shortUrl || url;

    // ✅ Use native mobile share if available
    if (navigator.share) {
      await navigator.share({
        title: albumTitle || "Flipbook Album",
        text: "Check out my album!",
        url: shareUrl,
      });
    } else if (navigator.clipboard && window.isSecureContext) {
      // ✅ Works in HTTPS environments and desktop browsers
      await navigator.clipboard.writeText(shareUrl);
      alert("Sharing link copied to clipboard!");
    } else {
      // ✅ Fallback for older or insecure contexts
      const tempInput = document.createElement("input");
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      alert("Sharing link copied to clipboard!");
    }

    setShareLink(shareUrl);
  } catch (err) {
    console.error("Error sharing:", err);
    alert("Could not share album. Please copy manually.");
  }
};




  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 20,
      }}
    >
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

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
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
