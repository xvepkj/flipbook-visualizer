import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // your backend URL

// src/api.js

// Frontend-only Google Drive image fetcher
export async function fetchImages(folderLink) {
  // Extract folder ID from Google Drive link
  const match = folderLink.match(/[-\w]{25,}/);
  const folderId = match ? match[0] : null;
  if (!folderId) throw new Error("Invalid folder link");

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  console.log(apiKey);

  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.files) throw new Error("Failed to fetch images");

  // Filter images only
  const images = data.files
    .filter(f => f.mimeType.startsWith("image/"))
    .map(f => ({
      id: f.id,
      name: f.name,
      url: `https://drive.google.com/uc?id=${f.id}`, // Direct link usable in img
    }));

  return images;
}
