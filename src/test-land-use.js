const fs = require("fs");
const path = require("path");
const { processLocalImage, countFeatures } = require("./utils/imageAnalysis");

async function testLandUseClassifier() {
  try {
    console.log("Starting land use classifier test...");

    // Path to a sample image in public/samples folder
    const samplesDir = path.join(__dirname, "../public/samples");
    const files = fs
      .readdirSync(samplesDir)
      .filter((file) =>
        [".jpg", ".jpeg", ".png", ".tif", ".tiff"].includes(
          path.extname(file).toLowerCase()
        )
      );

    if (files.length === 0) {
      console.error("No sample images found in public/samples directory");
      return;
    }

    // Use the first image found
    const sampleImagePath = path.join(samplesDir, files[0]);
    console.log(`Using sample image: ${sampleImagePath}`);

    // Process the image
    console.log("Processing image...");
    const processedImage = await processLocalImage(sampleImagePath);
    console.log(`Image processed, buffer size: ${processedImage.length} bytes`);

    // Perform land use classification
    console.log("Performing land use classification...");
    const results = await countFeatures(processedImage, "landUse");
    console.log("Land use classification completed successfully");
    console.log("Results:", JSON.stringify(results, null, 2));

    console.log("Test completed successfully");
  } catch (error) {
    console.error("Error in test:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  }
}

// Run the test
testLandUseClassifier();
