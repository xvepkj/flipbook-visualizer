import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 🧩 Helper: Extract folder ID from Google Drive link
function extractFolderId(link) {
  const match = link.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

// 📸 Endpoint: Fetch images from Drive folder
app.post("/api/fetch-images", async (req, res) => {
  const { folderLink } = req.body;
  const folderId = extractFolderId(folderLink);

  if (!folderId) return res.status(400).json({ error: "Invalid folder link" });

  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    // List files in the folder
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`;
    const { data } = await axios.get(url);

    // Filter only images and generate public URLs
    const images = data.files
      .filter(f => f.mimeType.startsWith("image/"))
      .map(f => ({
        id: f.id,
        name: f.name,
        url: `https://drive.google.com/uc?id=${f.id}`,
      }));

    res.json({ images });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
