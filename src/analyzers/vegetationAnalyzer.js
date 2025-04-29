const BaseAnalyzer = require("./baseAnalyzer");
const Jimp = require("jimp");

/**
 * Analyzer for vegetation detection and health assessment
 */
class VegetationAnalyzer extends BaseAnalyzer {
  constructor() {
    super(
      "Vegetation Health Analyzer",
      "Analyzes vegetation health and coverage in satellite imagery. This analyzer detects vegetation based on spectral signatures and assesses its health and density."
    );
  }

  /**
   * Analyze vegetation in an image
   * @param {Buffer} imageBuffer - Image buffer to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} - Analysis results
   */
  async analyze(imageBuffer, options = {}) {
    try {
      const image = await this.processImage(imageBuffer);

      // Get image dimensions
      const width = image.getWidth();
      const height = image.getHeight();
      const totalPixels = width * height;

      // Initialize counters
      let vegetationCount = 0;
      let healthyVegetationCount = 0;
      let moderateVegetationCount = 0;
      let stressedVegetationCount = 0;
      let ndviSum = 0;

      // Create a copy for visualization
      const visualizationImage = image.clone();

      // Analyze each pixel
      image.scan(0, 0, width, height, function (x, y, idx) {
        // Get RGB values
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        // Simple NDVI approximation using RGB
        // In actual satellite imagery, we would use NIR and Red bands
        // Here we use green as a proxy for NIR since healthy vegetation reflects green
        const pseudoNDVI = (g - r) / (g + r + 0.01); // Adding 0.01 to avoid division by zero

        // Scale NDVI to a more typical range (-1 to 1)
        const scaledNDVI = pseudoNDVI * 2;

        // Vegetation detection criteria:
        // - Higher green values relative to red and blue (chlorophyll)
        // - NDVI-like index above threshold
        const isVegetation = g > r && g > b && g > 70 && scaledNDVI > 0.1;

        if (isVegetation) {
          vegetationCount++;
          ndviSum += scaledNDVI;

          // Categorize vegetation health based on the pseudo-NDVI value
          if (scaledNDVI > 0.4) {
            healthyVegetationCount++;
            // Healthy vegetation (dark green)
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(0, 160, 0, 255),
              x,
              y
            );
          } else if (scaledNDVI > 0.25) {
            moderateVegetationCount++;
            // Moderate health vegetation (medium green)
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(80, 200, 80, 255),
              x,
              y
            );
          } else {
            stressedVegetationCount++;
            // Stressed vegetation (yellow-green)
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(180, 200, 60, 255),
              x,
              y
            );
          }
        } else {
          // Non-vegetation (darkened original)
          visualizationImage.setPixelColor(
            Jimp.rgbaToInt(
              Math.floor(r * 0.7),
              Math.floor(g * 0.7),
              Math.floor(b * 0.7),
              255
            ),
            x,
            y
          );
        }
      });

      // Calculate percentages and averages
      const vegetationPercentage = (vegetationCount / totalPixels) * 100;
      const healthyPercentage =
        vegetationCount > 0
          ? (healthyVegetationCount / vegetationCount) * 100
          : 0;
      const moderatePercentage =
        vegetationCount > 0
          ? (moderateVegetationCount / vegetationCount) * 100
          : 0;
      const stressedPercentage =
        vegetationCount > 0
          ? (stressedVegetationCount / vegetationCount) * 100
          : 0;
      const averageNDVI = vegetationCount > 0 ? ndviSum / vegetationCount : 0;

      // Determine vegetation coverage category
      let coverageCategory = "";
      if (vegetationPercentage < 10) {
        coverageCategory = "Minimal";
      } else if (vegetationPercentage < 30) {
        coverageCategory = "Low";
      } else if (vegetationPercentage < 60) {
        coverageCategory = "Moderate";
      } else if (vegetationPercentage < 80) {
        coverageCategory = "High";
      } else {
        coverageCategory = "Very High";
      }

      // Determine overall vegetation health
      let healthStatus = "";
      if (healthyPercentage > 60) {
        healthStatus = "Healthy";
      } else if (healthyPercentage > 30) {
        healthStatus = "Moderately Healthy";
      } else if (moderatePercentage > 50) {
        healthStatus = "Fair";
      } else {
        healthStatus = "Stressed";
      }

      // Create visualization image buffer
      const outputBuffer = await visualizationImage.getBufferAsync(
        Jimp.MIME_PNG
      );

      // Generate explanation text based on results
      let explanation = "";

      // Main vegetation coverage explanation
      explanation = `This image shows ${coverageCategory.toLowerCase()} vegetation coverage at ${vegetationPercentage.toFixed(
        0
      )}% of the total area. `;

      // Vegetation health description
      explanation += `The vegetation appears to be overall ${healthStatus.toLowerCase()}, `;
      explanation += `with ${healthyPercentage.toFixed(
        0
      )}% healthy vegetation (dark green), `;
      explanation += `${moderatePercentage.toFixed(
        0
      )}% moderately healthy vegetation (medium green), `;
      explanation += `and ${stressedPercentage.toFixed(
        0
      )}% stressed vegetation (yellow-green). `;

      // NDVI explanation
      explanation += `The average vegetation index (pseudo-NDVI) value is ${averageNDVI.toFixed(
        2
      )}, `;

      // Recommendations based on health
      if (healthStatus === "Healthy") {
        explanation +=
          "indicating thriving plant life with good access to water and nutrients.";
      } else if (healthStatus === "Moderately Healthy") {
        explanation +=
          "suggesting generally good conditions with some areas that may benefit from additional water or nutrients.";
      } else if (healthStatus === "Fair") {
        explanation +=
          "indicating potential environmental stressors affecting plant health in portions of the area.";
      } else {
        explanation +=
          "suggesting significant environmental stress, possibly due to drought, disease, or nutrient deficiencies.";
      }

      return {
        featureType: "vegetation",
        totalPixels,
        vegetationCount,
        vegetationPercentage: vegetationPercentage.toFixed(2),
        healthyVegetationCount,
        healthyPercentage: healthyPercentage.toFixed(2),
        moderateVegetationCount,
        moderatePercentage: moderatePercentage.toFixed(2),
        stressedVegetationCount,
        stressedPercentage: stressedPercentage.toFixed(2),
        averageNDVI: averageNDVI.toFixed(3),
        coverageCategory,
        healthStatus,
        visualizationImageBase64: `data:image/png;base64,${outputBuffer.toString(
          "base64"
        )}`,
        explanationHtml: explanation,
      };
    } catch (error) {
      throw new Error(`Vegetation analysis failed: ${error.message}`);
    }
  }
}

module.exports = VegetationAnalyzer;
