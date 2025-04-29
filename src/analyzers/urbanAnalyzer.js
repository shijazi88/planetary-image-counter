const BaseAnalyzer = require("./baseAnalyzer");
const Jimp = require("jimp");

/**
 * Analyzer for urban feature detection and analysis
 */
class UrbanAnalyzer extends BaseAnalyzer {
  constructor() {
    super(
      "Urban Feature Analyzer",
      "Analyzes built-up areas in satellite imagery. This analyzer detects buildings, roads, industrial zones, and other urban structures based on spectral and spatial characteristics."
    );
  }

  /**
   * Analyze urban features in an image
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
      let urbanCount = 0;
      let denseUrbanCount = 0;
      let suburbanCount = 0;
      let industrialCount = 0;
      let roadCount = 0;

      // Create a copy for visualization
      const visualizationImage = image.clone();

      // Create a map for edge detection and pattern analysis
      const urbanPixelMap = Array(height)
        .fill()
        .map(() => Array(width).fill(false));

      // First pass - identify urban pixels
      image.scan(0, 0, width, height, function (x, y, idx) {
        // Get RGB values
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        // Calculate various indices useful for urban detection
        const brightness = (r + g + b) / 3;
        const normalizedDifference = (r - b) / (r + b + 0.01); // Avoid division by zero
        const colorVariance =
          Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);

        // Urban detection criteria:
        // 1. Man-made structures often have higher brightness than natural features
        // 2. Urban areas often have more gray/white tones (r,g,b values close together)
        // 3. Industrial areas often have distinctive spectral signatures
        // 4. Roads are typically gray with linear patterns

        // Main urban detection (general built-up areas)
        const isUrban =
          brightness > 80 &&
          brightness < 220 && // Not too dark or too bright
          colorVariance < 60 && // Colors are closer together (grayer)
          !(b > r * 1.2 && b > g * 1.2) && // Not likely water
          !(g > r * 1.2 && g > b * 1.2); // Not likely vegetation

        // Specific urban type detection
        if (isUrban) {
          urbanCount++;
          urbanPixelMap[y][x] = true;

          // Dense urban areas (higher reflectance, concrete, rooftops)
          if (brightness > 150 && colorVariance < 30) {
            denseUrbanCount++;
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(220, 50, 50, 255),
              x,
              y
            ); // Red
          }
          // Suburban/residential (medium brightness, more varied colors)
          else if (brightness > 120 && brightness < 170) {
            suburbanCount++;
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(245, 166, 35, 255),
              x,
              y
            ); // Orange
          }
          // Industrial/commercial (often darker, more blue/gray tones)
          else if (
            (brightness < 120 && b > r * 0.9 && g > r * 0.9) ||
            (r > 100 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20)
          ) {
            industrialCount++;
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(138, 43, 226, 255),
              x,
              y
            ); // Purple
          }
          // Roads and transportation networks (gray, lower brightness)
          else if (
            Math.abs(r - g) < 10 &&
            Math.abs(g - b) < 10 &&
            brightness < 130
          ) {
            roadCount++;
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(169, 169, 169, 255),
              x,
              y
            ); // Dark gray
          }
          // Other urban features
          else {
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(192, 192, 192, 255),
              x,
              y
            ); // Light gray
          }
        } else {
          // Non-urban (darkened original)
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

      // Second pass - analyze urban patterns and connectivity
      let urbanClusterCount = 0;
      let largestClusterSize = 0;
      const visited = Array(height)
        .fill()
        .map(() => Array(width).fill(false));

      // Simple BFS to identify connected urban areas
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (urbanPixelMap[y][x] && !visited[y][x]) {
            // Found a new urban cluster
            urbanClusterCount++;
            let clusterSize = 0;

            // BFS to find all connected pixels
            const queue = [{ x, y }];
            visited[y][x] = true;

            while (queue.length > 0) {
              const pixel = queue.shift();
              clusterSize++;

              // Check 4-connected neighbors
              const directions = [
                { dx: 0, dy: -1 }, // up
                { dx: 1, dy: 0 }, // right
                { dx: 0, dy: 1 }, // down
                { dx: -1, dy: 0 }, // left
              ];

              for (const dir of directions) {
                const nx = pixel.x + dir.dx;
                const ny = pixel.y + dir.dy;

                // Check if the neighbor is valid and is urban area
                if (
                  nx >= 0 &&
                  nx < width &&
                  ny >= 0 &&
                  ny < height &&
                  urbanPixelMap[ny][nx] &&
                  !visited[ny][nx]
                ) {
                  queue.push({ x: nx, y: ny });
                  visited[ny][nx] = true;
                }
              }
            }

            // Update largest cluster size
            if (clusterSize > largestClusterSize) {
              largestClusterSize = clusterSize;
            }
          }
        }
      }

      // Calculate percentages and metrics
      const urbanPercentage = (urbanCount / totalPixels) * 100;
      const denseUrbanPercentage =
        urbanCount > 0 ? (denseUrbanCount / urbanCount) * 100 : 0;
      const suburbanPercentage =
        urbanCount > 0 ? (suburbanCount / urbanCount) * 100 : 0;
      const industrialPercentage =
        urbanCount > 0 ? (industrialCount / urbanCount) * 100 : 0;
      const roadPercentage =
        urbanCount > 0 ? (roadCount / urbanCount) * 100 : 0;

      // Fragmentation index (ratio of urban clusters to total urban area)
      // Higher values indicate more fragmented development
      const fragmentationIndex =
        urbanCount > 0 ? (urbanClusterCount * 100) / Math.sqrt(urbanCount) : 0;

      // Urban intensity score (weighted by density)
      const urbanIntensity =
        urbanPercentage *
        (1 + denseUrbanPercentage / 100 - suburbanPercentage / 200);

      // Determine urbanization category
      let urbanizationCategory = "";
      if (urbanPercentage < 10) {
        urbanizationCategory = "Rural";
      } else if (urbanPercentage < 30) {
        urbanizationCategory = "Semi-Rural";
      } else if (urbanPercentage < 60) {
        urbanizationCategory = "Suburban";
      } else if (urbanPercentage < 80) {
        urbanizationCategory = "Urban";
      } else {
        urbanizationCategory = "Dense Urban";
      }

      // Determine development pattern
      let developmentPattern = "";
      if (fragmentationIndex < 5) {
        developmentPattern = "Compact";
      } else if (fragmentationIndex < 15) {
        developmentPattern = "Moderately Fragmented";
      } else {
        developmentPattern = "Highly Fragmented";
      }

      // Determine predominant urban type
      let predominantType = "";
      const typePercentages = [
        { type: "Dense Urban", percentage: denseUrbanPercentage },
        { type: "Suburban", percentage: suburbanPercentage },
        { type: "Industrial", percentage: industrialPercentage },
        { type: "Road Network", percentage: roadPercentage },
      ];
      typePercentages.sort((a, b) => b.percentage - a.percentage);
      predominantType =
        typePercentages[0].percentage > 30
          ? typePercentages[0].type
          : "Mixed Urban";

      // Create visualization image buffer
      const outputBuffer = await visualizationImage.getBufferAsync(
        Jimp.MIME_PNG
      );

      // Generate explanation text based on results
      let explanation = "";

      // Main urbanization explanation
      explanation = `This image shows a ${urbanizationCategory.toLowerCase()} landscape with ${urbanPercentage.toFixed(
        0
      )}% built-up area coverage. `;
      explanation += `The urban development pattern is ${developmentPattern.toLowerCase()}, primarily consisting of ${predominantType.toLowerCase()} areas. `;

      // Urban composition
      explanation += `The built-up areas comprise approximately ${denseUrbanPercentage.toFixed(
        0
      )}% dense urban (red), `;
      explanation += `${suburbanPercentage.toFixed(0)}% suburban (orange), `;
      explanation += `${industrialPercentage.toFixed(
        0
      )}% industrial/commercial (purple), `;
      explanation += `and ${roadPercentage.toFixed(0)}% road networks (gray). `;

      // Additional insights
      if (urbanPercentage > 20) {
        if (fragmentationIndex > 15) {
          explanation +=
            "The high fragmentation indicates sprawling or disjointed development patterns. ";
        } else if (fragmentationIndex < 5 && urbanPercentage > 40) {
          explanation +=
            "The compact development pattern suggests efficient land use and potentially higher population density. ";
        }

        if (denseUrbanPercentage > 50) {
          explanation +=
            "The area is dominated by high-density development typical of city centers or dense commercial districts. ";
        } else if (suburbanPercentage > 60) {
          explanation +=
            "The predominance of suburban development suggests residential neighborhoods with moderate density. ";
        } else if (industrialPercentage > 40) {
          explanation +=
            "The significant industrial/commercial presence indicates economic activity centers. ";
        }

        if (roadPercentage > 20) {
          explanation +=
            "The extensive road network suggests good connectivity within the urban area. ";
        }
      } else if (urbanPercentage > 5) {
        explanation +=
          "The limited urban development suggests a primarily rural area with small settlements or isolated infrastructure. ";
      } else {
        explanation +=
          "Very little urban development is visible in this image. ";
      }

      return {
        featureType: "urban",
        totalPixels,
        urbanCount,
        urbanPercentage: urbanPercentage.toFixed(2),
        denseUrbanCount,
        denseUrbanPercentage: denseUrbanPercentage.toFixed(2),
        suburbanCount,
        suburbanPercentage: suburbanPercentage.toFixed(2),
        industrialCount,
        industrialPercentage: industrialPercentage.toFixed(2),
        roadCount,
        roadPercentage: roadPercentage.toFixed(2),
        urbanClusterCount,
        largestClusterSize,
        fragmentationIndex: fragmentationIndex.toFixed(2),
        urbanIntensity: urbanIntensity.toFixed(2),
        urbanizationCategory,
        developmentPattern,
        predominantType,
        visualizationImageBase64: `data:image/png;base64,${outputBuffer.toString(
          "base64"
        )}`,
        explanationHtml: explanation,
      };
    } catch (error) {
      throw new Error(`Urban analysis failed: ${error.message}`);
    }
  }
}

module.exports = UrbanAnalyzer;
