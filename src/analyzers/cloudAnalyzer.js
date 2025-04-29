const BaseAnalyzer = require("./baseAnalyzer");
const Jimp = require("jimp");

/**
 * Analyzer for cloud detection and analysis
 */
class CloudAnalyzer extends BaseAnalyzer {
  constructor() {
    super(
      "Cloud Coverage Analyzer",
      "Analyzes cloud coverage in satellite imagery. This analyzer detects clouds based on their high brightness and spectral characteristics."
    );
  }

  /**
   * Analyze clouds in an image
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
      let cloudCount = 0;
      let thickCloudCount = 0;
      let thinCloudCount = 0;
      let shadowCount = 0;

      // Create a copy for visualization
      const visualizationImage = image.clone();

      // Analyze each pixel
      image.scan(0, 0, width, height, function (x, y, idx) {
        // Get RGB values
        const r = this.bitmap.data[idx + 0];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];

        // Calculate brightness
        const brightness = (r + g + b) / 3;

        // Cloud detection criteria:
        // - High brightness (clouds are typically bright)
        // - Relatively similar values across RGB bands
        // - Slightly higher blue for some clouds (especially thin ones)
        const isCloud =
          brightness > 200 &&
          Math.abs(r - g) < 30 &&
          Math.abs(r - b) < 40 &&
          Math.abs(g - b) < 40;

        // Possible cloud shadow (dark areas near clouds)
        const isShadow =
          brightness < 80 &&
          Math.abs(r - g) < 20 &&
          Math.abs(r - b) < 20 &&
          Math.abs(g - b) < 20;

        if (isCloud) {
          cloudCount++;

          // Thick clouds typically have higher overall brightness
          if (brightness > 230 && Math.abs(r - b) < 15) {
            thickCloudCount++;
            // Mark thick clouds as white
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(255, 255, 255, 255),
              x,
              y
            );
          } else {
            thinCloudCount++;
            // Mark thin/semi-transparent clouds as light blue
            visualizationImage.setPixelColor(
              Jimp.rgbaToInt(200, 220, 255, 255),
              x,
              y
            );
          }
        } else if (isShadow) {
          shadowCount++;
          // Mark cloud shadows as dark purple
          visualizationImage.setPixelColor(
            Jimp.rgbaToInt(80, 50, 100, 255),
            x,
            y
          );
        } else {
          // Slightly darken non-cloud areas for better visualization
          visualizationImage.setPixelColor(
            Jimp.rgbaToInt(
              Math.floor(r * 0.8),
              Math.floor(g * 0.8),
              Math.floor(b * 0.8),
              255
            ),
            x,
            y
          );
        }
      });

      // Calculate percentages
      const cloudPercentage = (cloudCount / totalPixels) * 100;
      const thickCloudPercentage =
        thickCloudCount > 0 ? (thickCloudCount / cloudCount) * 100 : 0;
      const thinCloudPercentage =
        thinCloudCount > 0 ? (thinCloudCount / cloudCount) * 100 : 0;
      const shadowPercentage = (shadowCount / totalPixels) * 100;

      // Determine cloud cover category
      let cloudCategory = "";
      if (cloudPercentage < 10) {
        cloudCategory = "Clear";
      } else if (cloudPercentage < 30) {
        cloudCategory = "Partly Cloudy";
      } else if (cloudPercentage < 70) {
        cloudCategory = "Mostly Cloudy";
      } else {
        cloudCategory = "Overcast";
      }

      // Determine image usability for analysis based on cloud cover
      let imageUsability = "";
      if (cloudPercentage < 10) {
        imageUsability = "Excellent";
      } else if (cloudPercentage < 30) {
        imageUsability = "Good";
      } else if (cloudPercentage < 50) {
        imageUsability = "Fair";
      } else if (cloudPercentage < 70) {
        imageUsability = "Poor";
      } else {
        imageUsability = "Very Poor";
      }

      // Create visualization image buffer
      const outputBuffer = await visualizationImage.getBufferAsync(
        Jimp.MIME_PNG
      );

      // Generate explanation text based on results
      let explanation = "";

      // Main cloud coverage explanation
      explanation = `This image shows ${cloudCategory.toLowerCase()} conditions with ${cloudPercentage.toFixed(
        0
      )}% cloud coverage. `;

      // Cloud type description
      if (cloudPercentage >= 10) {
        if (thickCloudPercentage > 70) {
          explanation +=
            "The clouds appear to be predominantly thick, opaque clouds (shown in white) that completely obscure the ground.";
        } else if (thickCloudPercentage > 30) {
          explanation +=
            "The image contains a mix of thick, opaque clouds (shown in white) and thinner, semi-transparent clouds (shown in light blue).";
        } else {
          explanation +=
            "The clouds appear to be predominantly thin or semi-transparent (shown in light blue), allowing partial visibility of the ground.";
        }
      }

      // Shadow description
      if (shadowPercentage > 5) {
        explanation += ` Cloud shadows (shown in dark purple) cover approximately ${shadowPercentage.toFixed(
          0
        )}% of the image.`;
      }

      // Usability assessment
      explanation += ` Based on cloud coverage, this image is rated as having ${imageUsability.toLowerCase()} usability for land analysis.`;

      return {
        featureType: "clouds",
        totalPixels,
        cloudCount,
        cloudPercentage: cloudPercentage.toFixed(2),
        thickCloudCount,
        thickCloudPercentage: thickCloudPercentage.toFixed(2),
        thinCloudCount,
        thinCloudPercentage: thinCloudPercentage.toFixed(2),
        shadowCount,
        shadowPercentage: shadowPercentage.toFixed(2),
        cloudCategory,
        imageUsability,
        visualizationImageBase64: `data:image/png;base64,${outputBuffer.toString(
          "base64"
        )}`,
        explanationHtml: explanation,
      };
    } catch (error) {
      throw new Error(`Cloud analysis failed: ${error.message}`);
    }
  }
}

module.exports = CloudAnalyzer;
