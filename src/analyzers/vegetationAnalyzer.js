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

      // New counters for enhanced analysis
      let darkGreenCount = 0; // Forests, coniferous trees
      let brightGreenCount = 0; // Crops, grasslands
      let yellowGreenCount = 0; // Shrublands, dry grasslands
      let redEdgeCount = 0; // Flowering vegetation

      // Fire risk indicators
      let dryVegetationCount = 0;
      let veryDryVegetationCount = 0;

      // Density analysis
      let highDensityCount = 0;
      let mediumDensityCount = 0;
      let lowDensityCount = 0;

      // Seasonal analysis
      let greenValues = [];
      let redValues = [];
      let redToGreenRatios = [];

      // Create a map to track vegetation patterns
      const vegetationMap = Array(height)
        .fill()
        .map(() => Array(width).fill(false));

      // For edge detection and clustering
      let vegetationEdgePixels = 0;
      let clusterCount = 0;
      let largestClusterSize = 0;

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

        // Calculate additional metrics for enhanced analysis
        const brightness = (r + g + b) / 3;
        const redToGreenRatio = r / (g + 0.01);
        const greenToBlueRatio = g / (b + 0.01);
        const normalizedGreen = g / 255;

        // Vegetation detection criteria:
        // - Higher green values relative to red and blue (chlorophyll)
        // - NDVI-like index above threshold
        const isVegetation = g > r && g > b && g > 70 && scaledNDVI > 0.1;

        if (isVegetation) {
          vegetationCount++;
          vegetationMap[y][x] = true;
          ndviSum += scaledNDVI;

          // Store values for statistical analysis
          greenValues.push(g);
          redValues.push(r);
          redToGreenRatios.push(redToGreenRatio);

          // Categorize vegetation health based on the pseudo-NDVI value
          if (scaledNDVI > 0.4) {
            healthyVegetationCount++;
            // Healthy vegetation (dark green)
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(0, 160, 0, 255),
              x,
              y
            );

            // Vegetation type classification based on color ratios
            if (g > 150 && g / b > 2.0) {
              brightGreenCount++; // Crops, grasslands
            } else {
              darkGreenCount++; // Forests, coniferous
            }

            // Density analysis
            if (normalizedGreen > 0.8 && greenToBlueRatio > 2.5) {
              highDensityCount++;
            } else {
              mediumDensityCount++;
            }
          } else if (scaledNDVI > 0.25) {
            moderateVegetationCount++;
            // Moderate health vegetation (medium green)
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(80, 200, 80, 255),
              x,
              y
            );

            // More likely to be mixed or transitional vegetation
            if (r > 100 && g > 160) {
              brightGreenCount++; // Crops, grasslands
            } else if (r > 120) {
              yellowGreenCount++; // Shrublands
            } else {
              darkGreenCount++; // Forests with moderate stress
            }

            // Density analysis
            if (normalizedGreen > 0.7) {
              mediumDensityCount++;
            } else {
              lowDensityCount++;
            }

            // Check for dry conditions (fire risk)
            if (redToGreenRatio > 0.7) {
              dryVegetationCount++;
            }
          } else {
            stressedVegetationCount++;
            // Stressed vegetation (yellow-green)
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(180, 200, 60, 255),
              x,
              y
            );

            // Vegetation type classification for stressed vegetation
            if (r > 160) {
              yellowGreenCount++; // Dry shrublands, grasslands

              // High fire risk in dry vegetation
              if (redToGreenRatio > 0.85) {
                veryDryVegetationCount++;
              } else {
                dryVegetationCount++;
              }
            } else if (r > 120 && g > 150) {
              redEdgeCount++; // Potentially flowering or early senescence
            } else {
              darkGreenCount++; // Stressed forests
            }

            // Density analysis - stressed vegetation is typically less dense
            lowDensityCount++;
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

      // Second pass - detect vegetation edges and analyze patterns
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          if (vegetationMap[y][x]) {
            // Check if any neighboring pixel is not vegetation (edge detection)
            const hasNonVegNeighbor =
              !vegetationMap[y - 1][x] ||
              !vegetationMap[y + 1][x] ||
              !vegetationMap[y][x - 1] ||
              !vegetationMap[y][x + 1];

            if (hasNonVegNeighbor) {
              vegetationEdgePixels++;
            }
          }
        }
      }

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

      // Calculate new metrics for enhanced analysis
      const darkGreenPercentage =
        vegetationCount > 0 ? (darkGreenCount / vegetationCount) * 100 : 0;
      const brightGreenPercentage =
        vegetationCount > 0 ? (brightGreenCount / vegetationCount) * 100 : 0;
      const yellowGreenPercentage =
        vegetationCount > 0 ? (yellowGreenCount / vegetationCount) * 100 : 0;
      const redEdgePercentage =
        vegetationCount > 0 ? (redEdgeCount / vegetationCount) * 100 : 0;

      const highDensityPercentage =
        vegetationCount > 0 ? (highDensityCount / vegetationCount) * 100 : 0;
      const mediumDensityPercentage =
        vegetationCount > 0 ? (mediumDensityCount / vegetationCount) * 100 : 0;
      const lowDensityPercentage =
        vegetationCount > 0 ? (lowDensityCount / vegetationCount) * 100 : 0;

      // Vegetation fragmentation index (edge to area ratio)
      const fragmentationIndex =
        vegetationCount > 0
          ? vegetationEdgePixels / Math.sqrt(vegetationCount)
          : 0;

      // Fire risk assessment (percentage of dry vegetation)
      const dryVegetationPercentage =
        vegetationCount > 0
          ? ((dryVegetationCount + veryDryVegetationCount) / vegetationCount) *
            100
          : 0;
      const veryDryVegetationPercentage =
        vegetationCount > 0
          ? (veryDryVegetationCount / vegetationCount) * 100
          : 0;

      // Fire risk category
      let fireRiskCategory = "";
      if (dryVegetationPercentage > 70 || veryDryVegetationPercentage > 30) {
        fireRiskCategory = "High Risk";
      } else if (
        dryVegetationPercentage > 40 ||
        veryDryVegetationPercentage > 15
      ) {
        fireRiskCategory = "Moderate Risk";
      } else {
        fireRiskCategory = "Low Risk";
      }

      // Calculate ecological health score (0-100)
      // Components: vegetation health, density, diversity/fragmentation
      const healthFactor = healthyPercentage * 0.6 + moderatePercentage * 0.3;
      const densityFactor =
        highDensityPercentage * 0.5 + mediumDensityPercentage * 0.3;
      const fragmentationFactor = Math.max(0, 100 - fragmentationIndex * 20); // Lower fragmentation is better

      const ecologicalHealthScore =
        healthFactor * 0.5 + densityFactor * 0.3 + fragmentationFactor * 0.2;

      // Vegetation type classification
      let predominantVegetationType = "";
      if (
        darkGreenPercentage >
        Math.max(brightGreenPercentage, yellowGreenPercentage)
      ) {
        predominantVegetationType = "Forest/Dense Vegetation";
      } else if (brightGreenPercentage > yellowGreenPercentage) {
        predominantVegetationType = "Crops/Grassland";
      } else {
        predominantVegetationType = "Shrubland/Dry Vegetation";
      }

      // Identify seasonal growth stage
      // Calculate statistics from collected values
      const redMean =
        redValues.length > 0
          ? redValues.reduce((a, b) => a + b, 0) / redValues.length
          : 0;
      const greenMean =
        greenValues.length > 0
          ? greenValues.reduce((a, b) => a + b, 0) / greenValues.length
          : 0;
      const redToGreenRatioMean =
        redToGreenRatios.length > 0
          ? redToGreenRatios.reduce((a, b) => a + b, 0) /
            redToGreenRatios.length
          : 0;

      let growthStage = "";
      if (
        averageNDVI > 0.6 &&
        healthyPercentage > 70 &&
        redToGreenRatioMean < 0.5
      ) {
        growthStage = "Peak Growth";
      } else if (averageNDVI > 0.4 && healthyPercentage > 50) {
        growthStage = "Mature Growth";
      } else if (
        redEdgePercentage > 15 ||
        (redToGreenRatioMean > 0.7 && redToGreenRatioMean < 0.9)
      ) {
        growthStage = "Early Senescence";
      } else if (yellowGreenPercentage > 50 || redToGreenRatioMean > 0.9) {
        growthStage = "Late Senescence/Dormant";
      } else if (brightGreenPercentage > 60 && healthyPercentage > 60) {
        growthStage = "Early Growth";
      } else {
        growthStage = "Mixed Growth Stages";
      }

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

      // Determine vegetation density classification
      let densityCategory = "";
      if (highDensityPercentage > 60) {
        densityCategory = "Dense";
      } else if (
        mediumDensityPercentage > 60 ||
        highDensityPercentage + mediumDensityPercentage > 70
      ) {
        densityCategory = "Moderate";
      } else {
        densityCategory = "Sparse";
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

      // Vegetation type
      explanation += `The predominant vegetation type appears to be ${predominantVegetationType.toLowerCase()}, `;
      explanation += `with a ${densityCategory.toLowerCase()} density pattern. `;

      // Vegetation health description
      explanation += `The vegetation is overall ${healthStatus.toLowerCase()}, `;
      explanation += `with ${healthyPercentage.toFixed(
        0
      )}% healthy vegetation (dark green), `;
      explanation += `${moderatePercentage.toFixed(
        0
      )}% moderately healthy vegetation (medium green), `;
      explanation += `and ${stressedPercentage.toFixed(
        0
      )}% stressed vegetation (yellow-green). `;

      // Growth stage and seasonal characteristics
      explanation += `The vegetation appears to be in the ${growthStage.toLowerCase()} stage. `;

      // NDVI explanation
      explanation += `The average vegetation index (pseudo-NDVI) value is ${averageNDVI.toFixed(
        2
      )}, `;

      // Ecological health
      explanation += `with an overall ecological health score of ${ecologicalHealthScore.toFixed(
        1
      )} out of 100. `;

      // Fire risk if significant
      if (fireRiskCategory !== "Low Risk") {
        explanation += `The presence of ${dryVegetationPercentage.toFixed(
          1
        )}% dry vegetation indicates a ${fireRiskCategory.toLowerCase()} for wildfires. `;
      }

      // Recommendations based on health
      if (healthStatus === "Healthy") {
        explanation +=
          "The vegetation is thriving with good access to water and nutrients.";
      } else if (healthStatus === "Moderately Healthy") {
        explanation +=
          "The vegetation shows generally good conditions with some areas that may benefit from additional water or nutrients.";
      } else if (healthStatus === "Fair") {
        explanation +=
          "There are signs of environmental stressors affecting plant health in portions of the area.";
      } else {
        explanation +=
          "The vegetation shows significant environmental stress, possibly due to drought, disease, or nutrient deficiencies.";
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

        // New metrics
        predominantVegetationType,
        darkGreenPercentage: darkGreenPercentage.toFixed(2),
        brightGreenPercentage: brightGreenPercentage.toFixed(2),
        yellowGreenPercentage: yellowGreenPercentage.toFixed(2),
        redEdgePercentage: redEdgePercentage.toFixed(2),

        densityCategory,
        highDensityPercentage: highDensityPercentage.toFixed(2),
        mediumDensityPercentage: mediumDensityPercentage.toFixed(2),
        lowDensityPercentage: lowDensityPercentage.toFixed(2),

        growthStage,
        ecologicalHealthScore: ecologicalHealthScore.toFixed(1),
        fireRiskCategory,
        dryVegetationPercentage: dryVegetationPercentage.toFixed(2),
        veryDryVegetationPercentage: veryDryVegetationPercentage.toFixed(2),
        fragmentationIndex: fragmentationIndex.toFixed(2),

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
