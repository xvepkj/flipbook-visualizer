import React from "react";
import { useParams } from "react-router-dom";
import AlbumPreview from "./AlbumPreview";

// Reverse of convertDriveUrl: gets original Google Drive URL from direct link
const reverseDriveUrl = (directUrl) => {
  if (!directUrl) return "";
  const match = directUrl.match(/\/d\/([^=]+)/);
  const fileId = match ? match[1] : null;
  if (!fileId) return directUrl;
  return `https://drive.google.com/uc?id=${fileId}`;
};

export default function SharedAlbum() {
  const { id } = useParams();
    const { data } = useParams(); // now the param is base64 data

  const albumData = JSON.parse(atob(data));

  if (!albumData) return <div>Album not found</div>;

  const images = albumData.images.map((url, idx) => ({
    id: idx,
    url: reverseDriveUrl(url),
    name: `Image ${idx + 1}`,
  }));

  return <AlbumPreview images={images} albumTitle={albumData.title} hideShareButton={true} />;
}
