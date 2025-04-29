const Jimp = require("jimp");

/**
 * Base class for image analyzers
 * Provides common functionality for all analysis types
 */
class BaseAnalyzer {
  /**
   * Constructor for BaseAnalyzer
   * @param {string} name - Name of the analyzer
   * @param {string} description - Description of the analyzer
   */
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  /**
   * Process an image for analysis
   * @param {Buffer} imageBuffer - Image buffer to process
   * @returns {Promise<Jimp>} - Processed Jimp image object
   */
  async processImage(imageBuffer) {
    try {
      return await Jimp.read(imageBuffer);
    } catch (error) {
      throw new Error(
        `Error processing image in ${this.name} analyzer: ${error.message}`
      );
    }
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

  /**
   * Analyze the provided image
   * This method should be implemented by child classes
   * @param {Buffer} imageBuffer - Image buffer to analyze
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} - Analysis results
   */
  async analyze(imageBuffer, options = {}) {
    throw new Error("Method analyze() must be implemented by child classes");
  }
}

module.exports = BaseAnalyzer;
