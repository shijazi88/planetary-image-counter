require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { searchSatelliteImages, getSampleItem } = require("./api/planetary");
const {
  processImage,
  countFeatures,
  processLocalImage,
} = require("./utils/imageAnalysis");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// API endpoint to search for images
app.get("/api/search", async (req, res) => {
  try {
    const { bbox, collections, limit } = req.query;
    const results = await searchSatelliteImages(bbox, collections, limit);
    res.json(results);
  } catch (error) {
    console.error("Error searching images:", error);
    res.status(500).json({ error: "Failed to search images" });
  }
});

// API endpoint to get a sample image
app.get("/api/sample", async (req, res) => {
  try {
    const { collection } = req.query;
    const sampleItem = await getSampleItem(collection || "sentinel-2-l2a");
    res.json(sampleItem);
  } catch (error) {
    console.error("Error getting sample image:", error);
    res.status(500).json({ error: "Failed to get sample image" });
  }
});

// API endpoint to get sample files
app.get("/api/samples", (req, res) => {
  try {
    const samplesDir = path.join(__dirname, "../public/samples");
    const files = fs
      .readdirSync(samplesDir)
      .filter((file) =>
        [".jpg", ".jpeg", ".png", ".tif", ".tiff"].includes(
          path.extname(file).toLowerCase()
        )
      )
      .map((file) => ({
        name: file,
        url: `/samples/${file}`,
      }));

    res.json({ count: files.length, samples: files });
  } catch (error) {
    console.error("Error getting sample files:", error);
    res.status(500).json({ error: "Failed to get sample files" });
  }
});

// API endpoint to upload an image
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      file: {
        name: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// API endpoint to analyze an image and count features
app.post("/api/analyze", async (req, res) => {
  try {
    const { imageUrl, featureType } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    let processedImage;

    // Check if it's a local file or remote URL
    if (imageUrl.startsWith("/")) {
      // Local file path
      const filePath = path.join(__dirname, "../public", imageUrl);
      processedImage = await processLocalImage(filePath);
    } else {
      // Remote URL
      processedImage = await processImage(imageUrl);
    }

    // Count features based on the specified type
    const results = await countFeatures(processedImage, featureType);

    res.json(results);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});
