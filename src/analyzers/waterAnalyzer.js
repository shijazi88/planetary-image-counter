const BaseAnalyzer = require("./baseAnalyzer");
const Jimp = require("jimp");

/**
 * Analyzer for water body detection and analysis
 */
class WaterAnalyzer extends BaseAnalyzer {
  constructor() {
    super(
      "Water Body Analyzer",
      "Analyzes water bodies in satellite imagery. This analyzer detects water features such as oceans, lakes, rivers, and ponds based on spectral characteristics."
    );
  }

  /**
   * Analyze water bodies in an image
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
      let waterCount = 0;
      let deepWaterCount = 0;
      let shallowWaterCount = 0;
      let turbidWaterCount = 0;
      let waterBodyEdgePixels = 0;

      // New counters for enhanced analysis
      let blueSum = 0;
      let greenSum = 0;
      let redSum = 0;
      let brightnessSum = 0;
      let turbiditySum = 0;
      let tempEstimationSum = 0;

      // Water temperature categories
      let coolWaterCount = 0;
      let moderateWaterCount = 0;
      let warmWaterCount = 0;

      // Create a copy for visualization
      const visualizationImage = image.clone();

      // Create a map to track water pixels for edge detection
      const waterPixelMap = Array(height)
        .fill()
        .map(() => Array(width).fill(false));

      // First pass - identify water pixels
      image.scan(0, 0, width, height, function (x, y, idx) {
        // Get RGB values
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        // Water detection criteria:
        // 1. Blue channel is typically dominant in water
        // 2. Blue to green ratio is high in clear water
        // 3. Overall darker for deep water, brighter for shallow
        // 4. Low red values relative to blue in clear water

        const isBlueHighest = b > r && b > g;
        const blueToGreenRatio = b / (g + 0.01); // Avoid division by zero
        const blueToRedRatio = b / (r + 0.01);
        const brightness = (r + g + b) / 3;

        // Main water detection criteria
        const isWater =
          isBlueHighest &&
          ((blueToGreenRatio > 1.1 && blueToRedRatio > 1.2) ||
            (b - r > 20 && b - g > 15)) &&
          brightness < 220; // Exclude very bright areas that might be clouds or snow

        if (isWater) {
          waterCount++;
          waterPixelMap[y][x] = true;

          // Collect color data for water quality analysis
          blueSum += b;
          greenSum += g;
          redSum += r;
          brightnessSum += brightness;

          // Calculate turbidity approximation (higher green relative to blue indicates more turbidity)
          const turbidity = (g / (b + 0.01)) * (brightness / 255);
          turbiditySum += turbidity;

          // Estimate relative water temperature (higher red values tend to correlate with warmer water)
          // This is a simplified approximation as true temperature would require thermal bands
          const tempEstimation = (r / 255) * 0.7 + (brightness / 255) * 0.3;
          tempEstimationSum += tempEstimation;

          // Classify water types
          if (brightness < 80 && b > 40) {
            // Deep/clear water (darker blue)
            deepWaterCount++;
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(0, 20, 120, 255),
              x,
              y
            );
            // Deep water tends to be cooler
            coolWaterCount++;
          } else if (blueToRedRatio > 1.5 && brightness < 150) {
            // Shallow/clear water (medium blue)
            shallowWaterCount++;
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(0, 90, 190, 255),
              x,
              y
            );
            // Assess temperature based on red component
            if (r < 60) coolWaterCount++;
            else if (r < 100) moderateWaterCount++;
            else warmWaterCount++;
          } else {
            // Turbid/sediment-laden water (light blue-green)
            turbidWaterCount++;
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(100, 180, 210, 255),
              x,
              y
            );
            // Turbid water often appears warmer
            if (r > 120) warmWaterCount++;
            else moderateWaterCount++;
          }
        } else {
          // Non-water (darkened original)
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

      // Second pass - detect water body edges
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          if (waterPixelMap[y][x]) {
            // Check if any neighboring pixel is not water (simplified edge detection)
            const hasNonWaterNeighbor =
              !waterPixelMap[y - 1][x] ||
              !waterPixelMap[y + 1][x] ||
              !waterPixelMap[y][x - 1] ||
              !waterPixelMap[y][x + 1];

            if (hasNonWaterNeighbor) {
              waterBodyEdgePixels++;
              // Highlight edges in a light cyan color
              visualizationImage.setPixelColor(
                Jimp.rgbaToInt(0, 255, 255, 255),
                x,
                y
              );
            }
          }
        }
      }

      // Calculate percentages and metrics
      const waterPercentage = (waterCount / totalPixels) * 100;
      const deepWaterPercentage =
        waterCount > 0 ? (deepWaterCount / waterCount) * 100 : 0;
      const shallowWaterPercentage =
        waterCount > 0 ? (shallowWaterCount / waterCount) * 100 : 0;
      const turbidWaterPercentage =
        waterCount > 0 ? (turbidWaterCount / waterCount) * 100 : 0;

      // Calculate temperature percentages
      const coolWaterPercentage =
        waterCount > 0 ? (coolWaterCount / waterCount) * 100 : 0;
      const moderateWaterPercentage =
        waterCount > 0 ? (moderateWaterCount / waterCount) * 100 : 0;
      const warmWaterPercentage =
        waterCount > 0 ? (warmWaterCount / waterCount) * 100 : 0;

      // Calculate average color values for water
      const avgBlue = waterCount > 0 ? blueSum / waterCount : 0;
      const avgGreen = waterCount > 0 ? greenSum / waterCount : 0;
      const avgRed = waterCount > 0 ? redSum / waterCount : 0;
      const avgBrightness = waterCount > 0 ? brightnessSum / waterCount : 0;
      const avgTurbidity = waterCount > 0 ? turbiditySum / waterCount : 0;
      const avgTempEstimation =
        waterCount > 0 ? tempEstimationSum / waterCount : 0;

      // Water quality index (0-100 scale)
      // Higher values indicate better quality, based on clarity and turbidity
      const waterQualityIndex =
        waterCount > 0
          ? Math.min(
              100,
              Math.max(
                0,
                100 - avgTurbidity * 100 - turbidWaterPercentage * 0.5
              )
            )
          : 0;

      // Normalize temperature estimation to a 0-100 scale
      const temperatureIndex = avgTempEstimation * 100;

      // Estimate shoreline length - the edge pixels count approximates the shoreline length
      // This is a relative measure, not absolute
      const shorelineIndex =
        waterBodyEdgePixels > 0
          ? waterBodyEdgePixels / Math.sqrt(waterCount)
          : 0;

      // Determine water coverage category
      let coverageCategory = "";
      if (waterPercentage < 10) {
        coverageCategory = "Low";
      } else if (waterPercentage < 40) {
        coverageCategory = "Moderate";
      } else if (waterPercentage < 70) {
        coverageCategory = "High";
      } else {
        coverageCategory = "Very High";
      }

      // Water body type classification
      let waterBodyType = "";
      if (waterPercentage > 70) {
        waterBodyType = "Ocean or Large Lake";
      } else if (waterPercentage > 30) {
        waterBodyType = "Lake or Large Reservoir";
      } else if (shorelineIndex > 1.5) {
        waterBodyType = "River or Stream Network";
      } else if (waterPercentage > 5) {
        waterBodyType = "Pond or Small Lake";
      } else {
        waterBodyType = "Small Water Bodies";
      }

      // More detailed water body classification
      let detailedWaterType = "";
      if (waterBodyType === "Ocean or Large Lake") {
        if (turbidWaterPercentage > 40) {
          detailedWaterType = "Coastal Waters";
        } else if (deepWaterPercentage > 70) {
          detailedWaterType = "Open Ocean";
        } else {
          detailedWaterType = "Large Lake";
        }
      } else if (waterBodyType === "Lake or Large Reservoir") {
        if (shorelineIndex > 1.2) {
          detailedWaterType = "Reservoir";
        } else if (turbidWaterPercentage > 50) {
          detailedWaterType = "Eutrophic Lake";
        } else {
          detailedWaterType = "Oligotrophic Lake";
        }
      } else if (waterBodyType === "River or Stream Network") {
        if (turbidWaterPercentage > 60) {
          detailedWaterType = "Sediment-laden River";
        } else {
          detailedWaterType = "Clear Stream Network";
        }
      }

      // Determine water clarity category
      let clarityCategory = "";
      if (deepWaterPercentage > 60) {
        clarityCategory = "Clear";
      } else if (turbidWaterPercentage > 60) {
        clarityCategory = "Turbid";
      } else {
        clarityCategory = "Mixed";
      }

      // Water temperature category
      let temperatureCategory = "";
      if (coolWaterPercentage > 50) {
        temperatureCategory = "Cool";
      } else if (warmWaterPercentage > 50) {
        temperatureCategory = "Warm";
      } else {
        temperatureCategory = "Moderate";
      }

      // Potential seasonal characteristics
      let seasonalCharacteristics = "";
      if (turbidWaterPercentage > 60 && temperatureIndex > 50) {
        seasonalCharacteristics = "Summer/Rainy Season Pattern";
      } else if (coolWaterPercentage > 60 && deepWaterPercentage > 50) {
        seasonalCharacteristics = "Winter/Cold Season Pattern";
      } else if (moderateWaterPercentage > 50 && shallowWaterPercentage > 60) {
        seasonalCharacteristics = "Spring/Fall Transition Pattern";
      } else {
        seasonalCharacteristics = "Indeterminate Season";
      }

      // Pollution risk assessment
      let pollutionRiskCategory = "";
      if (waterQualityIndex > 80) {
        pollutionRiskCategory = "Low Risk";
      } else if (waterQualityIndex > 50) {
        pollutionRiskCategory = "Moderate Risk";
      } else {
        pollutionRiskCategory = "High Risk";
      }

      // Create visualization image buffer
      const outputBuffer = await visualizationImage.getBufferAsync(
        Jimp.MIME_PNG
      );

      // Generate explanation text based on results
      let explanation = "";

      // Main water coverage explanation
      explanation = `This image shows ${coverageCategory.toLowerCase()} water coverage at ${waterPercentage.toFixed(
        0
      )}% of the total area. `;
      explanation += `The water feature appears to be a ${waterBodyType.toLowerCase()} with ${clarityCategory.toLowerCase()} water. `;

      // Water composition description
      explanation += `The water comprises approximately ${deepWaterPercentage.toFixed(
        0
      )}% deep water (dark blue), `;
      explanation += `${shallowWaterPercentage.toFixed(
        0
      )}% shallow water (medium blue), `;
      explanation += `and ${turbidWaterPercentage.toFixed(
        0
      )}% turbid water (light blue-green). `;

      // Additional insights based on water types
      if (deepWaterPercentage > 50) {
        explanation +=
          "The predominance of deep water suggests significant water depth. ";
      } else if (shallowWaterPercentage > 50) {
        explanation +=
          "The high proportion of shallow water suggests relatively low depth across most of the water body. ";
      } else if (turbidWaterPercentage > 50) {
        explanation +=
          "The high turbidity levels may indicate suspended sediments, algal blooms, or other water quality concerns. ";
      }

      // Shoreline complexity insights
      if (shorelineIndex > 2.0) {
        explanation +=
          "The water body has a complex shoreline with many inlets and peninsulas. ";
      } else if (shorelineIndex > 1.0) {
        explanation += "The water body has a moderately complex shoreline. ";
      } else if (waterPercentage > 5) {
        explanation += "The water body has a relatively simple shoreline. ";
      }

      // Water quality insights
      explanation += `The estimated water quality index is ${waterQualityIndex.toFixed(
        1
      )} out of 100, `;
      if (waterQualityIndex > 75) {
        explanation += "suggesting good water quality with low turbidity. ";
      } else if (waterQualityIndex > 50) {
        explanation += "indicating moderate water quality. ";
      } else {
        explanation +=
          "suggesting poor water quality that may require attention. ";
      }

      // Temperature insights
      explanation += `Water temperature analysis suggests predominantly ${temperatureCategory.toLowerCase()} water temperatures `;
      explanation += `with patterns consistent with ${seasonalCharacteristics.toLowerCase()}.`;

      return {
        featureType: "water",
        totalPixels,
        waterCount,
        waterPercentage: waterPercentage.toFixed(2),
        deepWaterCount,
        deepWaterPercentage: deepWaterPercentage.toFixed(2),
        shallowWaterCount,
        shallowWaterPercentage: shallowWaterPercentage.toFixed(2),
        turbidWaterCount,
        turbidWaterPercentage: turbidWaterPercentage.toFixed(2),
        waterBodyEdgePixels,
        shorelineIndex: shorelineIndex.toFixed(2),
        coverageCategory,
        waterBodyType,
        clarityCategory,

        // New metrics
        detailedWaterType,
        waterQualityIndex: waterQualityIndex.toFixed(1),
        temperatureIndex: temperatureIndex.toFixed(1),
        temperatureCategory,
        coolWaterPercentage: coolWaterPercentage.toFixed(2),
        moderateWaterPercentage: moderateWaterPercentage.toFixed(2),
        warmWaterPercentage: warmWaterPercentage.toFixed(2),
        seasonalCharacteristics,
        pollutionRiskCategory,
        avgTurbidity: avgTurbidity.toFixed(3),

        visualizationImageBase64: `data:image/png;base64,${outputBuffer.toString(
          "base64"
        )}`,
        explanationHtml: explanation,
      };
    } catch (error) {
      throw new Error(`Water analysis failed: ${error.message}`);
    }
  }
}

module.exports = WaterAnalyzer;
