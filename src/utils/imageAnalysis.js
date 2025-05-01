const axios = require("axios");
const sharp = require("sharp");
const Jimp = require("jimp");
const fs = require("fs");

/**
 * Process a local image file
 * @param {string} filePath - Path to the local image file
 * @returns {Promise<Buffer>} - Processed image buffer
 */
async function processLocalImage(filePath) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(filePath);

    // Process with sharp for initial transformations
    const processedBuffer = await sharp(imageBuffer)
      .resize(800, 800, { fit: "inside" }) // Resize to manageable dimensions
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error("Error processing local image:", error);
    throw error;
  }
}

/**
 * Download and process an image from a URL
 * @param {string} url - URL of the image to process
 * @returns {Promise<Buffer>} - Processed image buffer
 */
async function processImage(url) {
  try {
    // Download the image
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    // Process with sharp for initial transformations
    const processedBuffer = await sharp(imageBuffer)
      .resize(800, 800, { fit: "inside" }) // Resize to manageable dimensions
      .toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}

/**
 * Count features in an image
 * @param {Buffer} imageBuffer - Processed image buffer
 * @param {string} featureType - Type of feature to count ('water', 'vegetation', 'urban', 'clouds', 'landUse')
 * @returns {Promise<Object>} - Object containing feature counts and statistics
 */
async function countFeatures(imageBuffer, featureType = "vegetation") {
  try {
    console.log(`Starting analysis with feature type: ${featureType}`);

    // Use specialized analyzers for certain feature types
    if (featureType === "landUse") {
      try {
        const LandUseClassifier = require("../analyzers/landUseClassifier");
        console.log("LandUseClassifier imported successfully");

        const classifier = new LandUseClassifier();
        console.log("LandUseClassifier instantiated successfully");

        const result = await classifier.analyze(imageBuffer);
        console.log("LandUseClassifier analysis completed successfully");

        return result;
      } catch (error) {
        console.error(
          "Detailed error in Land Use Classification:",
          error.message
        );
        console.error("Error stack:", error.stack);
        throw new Error(`Land Use Classification failed: ${error.message}`);
      }
    } else if (featureType === "water") {
      try {
        const WaterAnalyzer = require("../analyzers/waterAnalyzer");
        console.log("WaterAnalyzer imported successfully");

        const analyzer = new WaterAnalyzer();
        console.log("WaterAnalyzer instantiated successfully");

        const result = await analyzer.analyze(imageBuffer);
        console.log("WaterAnalyzer analysis completed successfully");

        return result;
      } catch (error) {
        console.error("Detailed error in Water Analysis:", error.message);
        console.error("Error stack:", error.stack);
        throw new Error(`Water Analysis failed: ${error.message}`);
      }
    } else if (featureType === "vegetation") {
      try {
        const VegetationAnalyzer = require("../analyzers/vegetationAnalyzer");
        console.log("VegetationAnalyzer imported successfully");

        const analyzer = new VegetationAnalyzer();
        console.log("VegetationAnalyzer instantiated successfully");

        const result = await analyzer.analyze(imageBuffer);
        console.log("VegetationAnalyzer analysis completed successfully");

        return result;
      } catch (error) {
        console.error("Detailed error in Vegetation Analysis:", error.message);
        console.error("Error stack:", error.stack);
        throw new Error(`Vegetation Analysis failed: ${error.message}`);
      }
    }

    // For other feature types, use the generic threshold approach
    // Load the image with Jimp for analysis
    const image = await Jimp.read(imageBuffer);

    // Get image dimensions
    const width = image.getWidth();
    const height = image.getHeight();
    const totalPixels = width * height;

    // Initialize counters
    let featureCount = 0;
    let featureArea = 0;

    // Define threshold functions for different feature types
    const thresholdFunctions = {
      urban: (r, g, b) => {
        // Urban areas often have similar values across all bands
        const avg = (r + g + b) / 3;
        const diff = Math.max(
          Math.abs(r - avg),
          Math.abs(g - avg),
          Math.abs(b - avg)
        );
        return diff < 20 && avg > 80;
      },
      clouds: (r, g, b) => {
        // Clouds typically have high values across all bands
        return r > 220 && g > 220 && b > 220;
      },
      // Fallback threshold functions for water and vegetation in case specialized analyzers fail
      water: (r, g, b) => {
        // Water typically has higher blue than green and red
        return b > r * 1.2 && b > g * 1.1;
      },
      vegetation: (r, g, b) => {
        // Simple NDVI-like detection: vegetation has higher green than red and blue
        return g > r * 1.15 && g > b * 1.15;
      },
    };

    // Select the appropriate threshold function
    const thresholdFn =
      thresholdFunctions[featureType] || thresholdFunctions.vegetation;

    // Scan each pixel
    image.scan(0, 0, width, height, function (x, y, idx) {
      // Get RGB values
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];

      // Check if pixel meets the criteria for the feature
      if (thresholdFn(r, g, b)) {
        featureCount++;

        // Mark the feature pixel in the image (optional visualization)
        this.bitmap.data[idx + 0] = 255; // R
        this.bitmap.data[idx + 1] = 0; // G
        this.bitmap.data[idx + 2] = 0; // B
      }
    });

    // Calculate feature area percentage
    featureArea = (featureCount / totalPixels) * 100;

    // Create a buffer for the visualization image
    const outputBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

    return {
      featureType,
      totalPixels,
      featureCount,
      featureAreaPercentage: featureArea.toFixed(2),
      visualizationImageBase64: `data:image/png;base64,${outputBuffer.toString(
        "base64"
      )}`,
    };
  } catch (error) {
    console.error("Error counting features in image:", error);
    throw error;
  }
}

module.exports = {
  processImage,
  processLocalImage,
  countFeatures,
};
