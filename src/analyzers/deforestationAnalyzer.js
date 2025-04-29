const BaseAnalyzer = require("./baseAnalyzer");
const Jimp = require("jimp");

/**
 * Analyzer for deforestation detection
 * Note: This analyzer simulates deforestation detection using a single image
 * by dividing the image and treating parts as "before" and "after"
 */
class DeforestationAnalyzer extends BaseAnalyzer {
  constructor() {
    super(
      "Deforestation Monitor",
      "Detects potential forest loss by comparing different areas of the image. In a real application, this would compare satellite images from different time periods."
    );
  }

  /**
   * Analyze deforestation in an image
   * @param {Buffer} imageBuffer - Image buffer to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} - Analysis results
   */
  async analyze(imageBuffer, options = {}) {
    try {
      // Process the image
      const image = await this.processImage(imageBuffer);

      // Get dimensions
      const width = image.getWidth();
      const height = image.getHeight();
      const totalPixels = width * height;

      // We'll use the left half as "before" and right half as "after" for simulation purposes
      const beforeWidth = Math.floor(width / 2);
      const afterWidth = width - beforeWidth;

      // Create visualization image
      const visualizationImage = image.clone();

      // Variables to store vegetation counts
      let beforeVegetationCount = 0;
      let afterVegetationCount = 0;

      // Analyze the "before" area (left half)
      for (let x = 0; x < beforeWidth; x++) {
        for (let y = 0; y < height; y++) {
          const idx = (y * width + x) << 2;
          const r = image.bitmap.data[idx + 0];
          const g = image.bitmap.data[idx + 1];
          const b = image.bitmap.data[idx + 2];

          // Check if this pixel is vegetation (high green value)
          const isVegetation = g > r * 1.15 && g > b * 1.15;

          if (isVegetation) {
            beforeVegetationCount++;
            // Highlight vegetation in the "before" area with green
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(0, 255, 0, 255),
              x,
              y
            );
          }
        }
      }

      // Analyze the "after" area (right half)
      for (let x = beforeWidth; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const idx = (y * width + x) << 2;
          const r = image.bitmap.data[idx + 0];
          const g = image.bitmap.data[idx + 1];
          const b = image.bitmap.data[idx + 2];

          // Check if this pixel is vegetation (high green value)
          const isVegetation = g > r * 1.15 && g > b * 1.15;

          if (isVegetation) {
            afterVegetationCount++;
            // Highlight vegetation in the "after" area with blue-green for contrast
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(0, 200, 100, 255),
              x,
              y
            );
          } else {
            // Highlight non-vegetation in "after" area with red (potential deforestation)
            if (x > beforeWidth + 10) {
              // Add some margin to create a visual separation
              visualizationImage.setPixelColor(
                Jimp.rgbaToInt(255, 100, 100, 255),
                x,
                y
              );
            }
          }
        }
      }

      // Add a dividing line to clearly show before/after
      for (let y = 0; y < height; y++) {
        visualizationImage.setPixelColor(
          Jimp.rgbaToInt(255, 255, 255, 255),
          beforeWidth,
          y
        );
        if (beforeWidth > 0) {
          visualizationImage.setPixelColor(
            Jimp.rgbaToInt(255, 255, 255, 255),
            beforeWidth - 1,
            y
          );
        }
        if (beforeWidth + 1 < width) {
          visualizationImage.setPixelColor(
            Jimp.rgbaToInt(255, 255, 255, 255),
            beforeWidth + 1,
            y
          );
        }
      }

      // Calculate statistics
      const beforeTotal = beforeWidth * height;
      const afterTotal = afterWidth * height;

      const beforeVegetationPercentage =
        (beforeVegetationCount / beforeTotal) * 100;
      const afterVegetationPercentage =
        (afterVegetationCount / afterTotal) * 100;

      const vegetationLossPercentage = Math.max(
        0,
        beforeVegetationPercentage - afterVegetationPercentage
      );
      const deforestationSeverity = this.getSeverityLevel(
        vegetationLossPercentage
      );

      // Generate explanation text
      let explanation = "";
      if (vegetationLossPercentage < 5) {
        explanation =
          "Analysis shows minimal or no forest loss between the compared areas. This suggests stable forest coverage or effective conservation.";
      } else if (vegetationLossPercentage < 15) {
        explanation =
          "Analysis indicates moderate forest loss between the compared areas. This level of change could be due to selective logging, minor development, or natural disturbances.";
      } else if (vegetationLossPercentage < 30) {
        explanation =
          "Analysis reveals significant forest loss between the compared areas. This may indicate systematic logging operations, land conversion for agriculture, or severe natural disturbances like fires.";
      } else {
        explanation =
          "Analysis shows severe forest loss between the compared areas. This level of deforestation suggests major land use changes such as clear-cutting, large-scale agricultural conversion, or urban development.";
      }

      explanation += ` The visualization shows "before" (left side with green highlighting) and "after" (right side, with lost vegetation areas in red) to help visualize the change.`;

      // Add note about the simulation
      explanation +=
        " <strong>Note:</strong> This is a simulated comparison using different parts of the same image. In a real application, this would compare satellite images from different time periods.";

      // Create visualization image buffer
      const outputBuffer = await visualizationImage.getBufferAsync(
        Jimp.MIME_PNG
      );

      return {
        featureType: "deforestation",
        beforeVegetationPercentage: beforeVegetationPercentage.toFixed(2),
        afterVegetationPercentage: afterVegetationPercentage.toFixed(2),
        vegetationLossPercentage: vegetationLossPercentage.toFixed(2),
        deforestationSeverity,
        visualizationImageBase64: `data:image/png;base64,${outputBuffer.toString(
          "base64"
        )}`,
        explanationHtml: explanation,
      };
    } catch (error) {
      throw new Error(`Deforestation analysis failed: ${error.message}`);
    }
  }

  /**
   * Get a descriptive severity level based on percentage of loss
   * @param {number} lossPercentage - Percentage of vegetation loss
   * @returns {string} - Severity level description
   */
  getSeverityLevel(lossPercentage) {
    if (lossPercentage < 5) return "Minimal";
    if (lossPercentage < 15) return "Moderate";
    if (lossPercentage < 30) return "Significant";
    return "Severe";
  }
}

module.exports = DeforestationAnalyzer;
