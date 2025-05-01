const Jimp = require("jimp");

/**
 * Base class for all image analyzers
 */
class BaseAnalyzer {
  /**
   * Create a new analyzer
   * @param {string} name - Display name of the analyzer
   * @param {string} description - Description of what the analyzer does
   */
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  /**
   * Process image buffer into usable format
   * @param {Buffer} imageBuffer - Raw image buffer
   * @returns {Promise<Jimp>} - Processed Jimp image
   */
  async processImage(imageBuffer) {
    try {
      // Load image with Jimp
      const image = await Jimp.read(imageBuffer);

      // Resize to manageable dimensions if larger than 1000x1000
      if (image.getWidth() > 1000 || image.getHeight() > 1000) {
        image.resize(1000, 1000, Jimp.RESIZE_BILINEAR);
      }

      return image;
    } catch (error) {
      console.error("Error processing image in BaseAnalyzer:", error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  /**
   * Analyze the image (to be implemented by subclasses)
   * @param {Buffer} imageBuffer - Image buffer to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} - Analysis results
   */
  async analyze(imageBuffer, options = {}) {
    throw new Error("analyze() method must be implemented by subclasses");
  }

  /**
   * Generate HTML explanation of the results
   * @param {Object} results - Analysis results
   * @returns {string} - HTML string explaining the results
   */
  generateExplanation(results) {
    let html = `<div class="explanation">
      <h3>Analysis Explanation</h3>
      <p>${this.description}</p>
      <ul>`;

    // Add result items as list elements
    Object.entries(results).forEach(([key, value]) => {
      if (
        key !== "visualizationImageBase64" &&
        key !== "featureType" &&
        !key.includes("html")
      ) {
        let formattedKey = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());

        html += `<li><strong>${formattedKey}:</strong> ${value}</li>`;
      }
    });

    html += `</ul>
      <p>${results.explanationHtml || ""}</p>
    </div>`;

    return html;
  }
}

module.exports = BaseAnalyzer;
