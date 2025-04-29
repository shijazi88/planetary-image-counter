const axios = require("axios");

const API_URL =
  process.env.PLANETARY_COMPUTER_API_URL ||
  "https://planetarycomputer.microsoft.com/api/stac/v1";
const SUBSCRIPTION_KEY = process.env.PC_SDK_SUBSCRIPTION_KEY || "";

/**
 * Helper function to sign a URL with the subscription key if available
 * @param {string} url - The URL to sign
 * @returns {string} - The signed URL
 */
function signUrl(url) {
  // This is a simplified version; in Python SDK there's a more complex signing process
  // For now, we'll just append the subscription key if available
  if (SUBSCRIPTION_KEY) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}subscription-key=${SUBSCRIPTION_KEY}`;
  }
  return url;
}

/**
 * Search for satellite images using the Planetary Computer API
 * @param {string} bbox - Bounding box in format "min_lon,min_lat,max_lon,max_lat"
 * @param {string} collections - Comma-separated list of collections to search
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Object>} - Search results
 */
async function searchSatelliteImages(
  bbox,
  collections = "sentinel-2-l2a",
  limit = 10
) {
  try {
    const params = {
      collections: collections.split(","),
      limit: limit || 10,
    };

    // Add bbox if provided
    if (bbox) {
      params.bbox = bbox.split(",").map(Number);
    }

    const response = await axios.get(`${API_URL}/search`, {
      params,
      headers: SUBSCRIPTION_KEY
        ? {
            "subscription-key": SUBSCRIPTION_KEY,
          }
        : {},
    });

    // Process and enhance the response
    const items = response.data.features.map((item) => {
      // Sign asset URLs if needed
      if (item.assets) {
        Object.keys(item.assets).forEach((key) => {
          if (item.assets[key].href) {
            item.assets[key].href = signUrl(item.assets[key].href);
          }
        });
      }
      return item;
    });

    return {
      count: response.data.features.length,
      items,
    };
  } catch (error) {
    console.error("Error searching satellite images:", error);
    throw error;
  }
}

/**
 * Get a sample item from a specific collection
 * @param {string} collection - Collection ID
 * @returns {Promise<Object>} - Sample item
 */
async function getSampleItem(collection = "sentinel-2-l2a") {
  try {
    // Search for a single item from the collection
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        collections: [collection],
        limit: 1,
      },
      headers: SUBSCRIPTION_KEY
        ? {
            "subscription-key": SUBSCRIPTION_KEY,
          }
        : {},
    });

    if (response.data.features && response.data.features.length > 0) {
      const item = response.data.features[0];

      // Sign asset URLs
      if (item.assets) {
        Object.keys(item.assets).forEach((key) => {
          if (item.assets[key].href) {
            item.assets[key].href = signUrl(item.assets[key].href);
          }
        });
      }

      return item;
    }

    throw new Error(`No items found in collection: ${collection}`);
  } catch (error) {
    console.error(`Error getting sample item from ${collection}:`, error);
    throw error;
  }
}

/**
 * Get a list of available collections from the Planetary Computer
 * @returns {Promise<Array>} - List of collections
 */
async function getCollections() {
  try {
    const response = await axios.get(`${API_URL}/collections`, {
      headers: SUBSCRIPTION_KEY
        ? {
            "subscription-key": SUBSCRIPTION_KEY,
          }
        : {},
    });

    return response.data.collections;
  } catch (error) {
    console.error("Error getting collections:", error);
    throw error;
  }
}

module.exports = {
  searchSatelliteImages,
  getSampleItem,
  getCollections,
  signUrl,
};
