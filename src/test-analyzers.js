const fs = require("fs");
const path = require("path");

// Import the analyzers
const VegetationAnalyzer = require("./analyzers/vegetationAnalyzer");
const WaterAnalyzer = require("./analyzers/waterAnalyzer");

// Define test images
const testImages = {
  vegetation: path.join(__dirname, "../public/samples/vegetation.jpg"),
  water: path.join(__dirname, "../public/samples/water.jpg"),
};

// Check if files exist
Object.entries(testImages).forEach(([key, imagePath]) => {
  if (!fs.existsSync(imagePath)) {
    console.log(`Warning: Test image for ${key} not found at ${imagePath}`);
    // Try to find an alternative image
    const sampleDir = path.join(__dirname, "../public/samples");
    const files = fs.readdirSync(sampleDir);
    const alternativeImage = files.find((file) =>
      file.toLowerCase().includes(key.toLowerCase())
    );

    if (alternativeImage) {
      testImages[key] = path.join(sampleDir, alternativeImage);
      console.log(`Using alternative image: ${testImages[key]}`);
    } else {
      console.log(
        `No alternative ${key} image found. Using first sample image.`
      );
      // Use the first sample image as fallback
      if (files.length > 0) {
        testImages[key] = path.join(sampleDir, files[0]);
        console.log(`Using fallback image: ${testImages[key]}`);
      }
    }
  }
});

// Run tests
async function runTests() {
  console.log("Testing analyzers...");

  // Test Vegetation Analyzer
  try {
    console.log("\n--- Testing Vegetation Analyzer ---");
    const vegetationAnalyzer = new VegetationAnalyzer();
    const vegetationImage = fs.readFileSync(testImages.vegetation);
    console.log(`Analyzing image: ${testImages.vegetation}`);

    const vegetationResults = await vegetationAnalyzer.analyze(vegetationImage);
    console.log("Vegetation analysis results:");
    console.log(
      "- Vegetation coverage:",
      vegetationResults.vegetationPercentage + "%"
    );
    console.log("- Health status:", vegetationResults.healthStatus);

    // Check if new metrics exist
    if (vegetationResults.predominantVegetationType) {
      console.log(
        "- Vegetation type:",
        vegetationResults.predominantVegetationType
      );
    } else {
      console.error("ERROR: predominantVegetationType not found in results");
    }

    if (vegetationResults.densityCategory) {
      console.log("- Density category:", vegetationResults.densityCategory);
    } else {
      console.error("ERROR: densityCategory not found in results");
    }

    if (vegetationResults.ecologicalHealthScore) {
      console.log(
        "- Ecological health score:",
        vegetationResults.ecologicalHealthScore
      );
    } else {
      console.error("ERROR: ecologicalHealthScore not found in results");
    }

    if (vegetationResults.fireRiskCategory) {
      console.log("- Fire risk:", vegetationResults.fireRiskCategory);
    } else {
      console.error("ERROR: fireRiskCategory not found in results");
    }

    console.log("Vegetation analyzer test completed successfully");
  } catch (error) {
    console.error("Vegetation analyzer test failed:", error);
  }

  // Test Water Analyzer
  try {
    console.log("\n--- Testing Water Analyzer ---");
    const waterAnalyzer = new WaterAnalyzer();
    const waterImage = fs.readFileSync(testImages.water);
    console.log(`Analyzing image: ${testImages.water}`);

    const waterResults = await waterAnalyzer.analyze(waterImage);
    console.log("Water analysis results:");
    console.log("- Water coverage:", waterResults.waterPercentage + "%");
    console.log("- Water body type:", waterResults.waterBodyType);

    // Check if new metrics exist
    if (waterResults.detailedWaterType) {
      console.log("- Detailed water type:", waterResults.detailedWaterType);
    } else {
      console.error("ERROR: detailedWaterType not found in results");
    }

    if (waterResults.waterQualityIndex) {
      console.log("- Water quality index:", waterResults.waterQualityIndex);
    } else {
      console.error("ERROR: waterQualityIndex not found in results");
    }

    if (waterResults.temperatureCategory) {
      console.log("- Temperature category:", waterResults.temperatureCategory);
    } else {
      console.error("ERROR: temperatureCategory not found in results");
    }

    if (waterResults.seasonalCharacteristics) {
      console.log("- Seasonal pattern:", waterResults.seasonalCharacteristics);
    } else {
      console.error("ERROR: seasonalCharacteristics not found in results");
    }

    console.log("Water analyzer test completed successfully");
  } catch (error) {
    console.error("Water analyzer test failed:", error);
  }
}

// Run the tests
runTests().then(() => {
  console.log("\nAll tests completed.");
});
