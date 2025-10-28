import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // your backend URL

export async function fetchImages(folderLink) {
  const res = await axios.post(`${API_BASE}/fetch-images`, { folderLink });
  return res.data.images;
}
