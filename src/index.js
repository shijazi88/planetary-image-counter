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
    console.log("=== ANALYZE REQUEST ===");
    console.log("Received analyze request for feature type:", featureType);
    console.log("Image URL:", imageUrl);

    if (!imageUrl) {
      console.log("Error: Image URL is required");
      return res.status(400).json({ error: "Image URL is required" });
    }

    let processedImage;

    // Check if it's a local file or remote URL
    if (imageUrl.startsWith("/")) {
      // Local file path
      const filePath = path.join(__dirname, "../public", imageUrl);
      console.log("Processing local image:", filePath);
      processedImage = await processLocalImage(filePath);
    } else {
      // Remote URL
      console.log("Processing remote image:", imageUrl);
      processedImage = await processImage(imageUrl);
    }

    console.log(
      "Image processed successfully, buffer size:",
      processedImage.length
    );

    // Count features based on the specified type
    console.log("Calling countFeatures with feature type:", featureType);
    const results = await countFeatures(processedImage, featureType);
    console.log("Analysis completed successfully");

    // Log a sample of the results to verify what we're sending back
    console.log("=== ANALYSIS RESULTS SAMPLE ===");
    const resultsSample = {};
    Object.keys(results)
      .slice(0, 10)
      .forEach((key) => {
        resultsSample[key] = results[key];
      });
    console.log(JSON.stringify(resultsSample, null, 2));

    // If it's the water analyzer, check if our new properties exist
    if (featureType === "water") {
      console.log("=== WATER ANALYZER NEW PROPERTIES CHECK ===");
      const waterProps = [
        "detailedWaterType",
        "waterQualityIndex",
        "temperatureCategory",
        "seasonalCharacteristics",
      ];
      waterProps.forEach((prop) => {
        console.log(`${prop}: ${results[prop] ? "EXISTS" : "MISSING"}`);
      });
    }

    // If it's the vegetation analyzer, check if our new properties exist
    if (featureType === "vegetation") {
      console.log("=== VEGETATION ANALYZER NEW PROPERTIES CHECK ===");
      const vegProps = [
        "predominantVegetationType",
        "densityCategory",
        "ecologicalHealthScore",
        "fireRiskCategory",
      ];
      vegProps.forEach((prop) => {
        console.log(`${prop}: ${results[prop] ? "EXISTS" : "MISSING"}`);
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error analyzing image:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    res
      .status(500)
      .json({ error: "Failed to analyze image: " + error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});
