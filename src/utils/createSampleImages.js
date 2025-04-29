const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

// Define paths
const samplesDir = path.join(__dirname, "../../public/samples");

// Ensure the samples directory exists
if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

// Create a vegetation sample image (predominantly green)
async function createVegetationImage() {
  try {
    const image = new Jimp(500, 500, 0x00aa00ff); // Green color
    // Add some variations to the green color
    for (let x = 0; x < 500; x++) {
      for (let y = 0; y < 500; y++) {
        // Random variation in green with some red/blue
        const r = Math.floor(Math.random() * 100);
        const g = 150 + Math.floor(Math.random() * 100);
        const b = Math.floor(Math.random() * 60);

        const color = Jimp.rgbaToInt(r, g, b, 255);
        image.setPixelColor(color, x, y);
      }
    }

    await image.writeAsync(path.join(samplesDir, "vegetation.jpg"));
    console.log("Created vegetation sample image");
  } catch (error) {
    console.error("Error creating vegetation image:", error);
  }
}

// Create a water sample image (predominantly blue)
async function createWaterImage() {
  try {
    const image = new Jimp(500, 500, 0x0000bbff); // Blue color
    // Add some variations to the blue color
    for (let x = 0; x < 500; x++) {
      for (let y = 0; y < 500; y++) {
        // Random variation in blue with some green
        const r = Math.floor(Math.random() * 40);
        const g = 50 + Math.floor(Math.random() * 70);
        const b = 150 + Math.floor(Math.random() * 100);

        const color = Jimp.rgbaToInt(r, g, b, 255);
        image.setPixelColor(color, x, y);
      }
    }

    await image.writeAsync(path.join(samplesDir, "water.jpg"));
    console.log("Created water sample image");
  } catch (error) {
    console.error("Error creating water image:", error);
  }
}

// Create an urban sample image (grays with some structure)
async function createUrbanImage() {
  try {
    const image = new Jimp(500, 500, 0x888888ff); // Gray color

    // Create a grid pattern to simulate urban structure
    for (let x = 0; x < 500; x++) {
      for (let y = 0; y < 500; y++) {
        // Create a grid pattern
        if (x % 50 < 5 || y % 50 < 5) {
          image.setPixelColor(0x333333ff, x, y); // Dark gray for "roads"
        } else {
          // Buildings with slightly different gray tones
          const value = 100 + Math.floor(Math.random() * 155);
          const color = Jimp.rgbaToInt(value, value, value, 255);
          image.setPixelColor(color, x, y);
        }
      }
    }

    await image.writeAsync(path.join(samplesDir, "urban.jpg"));
    console.log("Created urban sample image");
  } catch (error) {
    console.error("Error creating urban image:", error);
  }
}

// Create a clouds sample image (white fluffy patterns)
async function createCloudsImage() {
  try {
    const image = new Jimp(500, 500, 0x6699ffff); // Light blue (sky)

    // Generate cloud-like patterns
    for (let x = 0; x < 500; x++) {
      for (let y = 0; y < 500; y++) {
        // Simple Perlin-like noise simulation (not actual Perlin noise)
        const noise =
          Math.sin(x * 0.02) *
          Math.cos(y * 0.02) *
          Math.sin((x + y) * 0.02) *
          Math.cos((x - y) * 0.01);

        if (noise > 0.2) {
          // Cloud color (white with slight variations)
          const value = 220 + Math.floor(Math.random() * 35);
          const color = Jimp.rgbaToInt(value, value, value, 255);
          image.setPixelColor(color, x, y);
        }
      }
    }

    await image.writeAsync(path.join(samplesDir, "clouds.jpg"));
    console.log("Created clouds sample image");
  } catch (error) {
    console.error("Error creating clouds image:", error);
  }
}

// Create a mixed features image
async function createMixedImage() {
  try {
    const image = new Jimp(500, 500, 0x6699ffff); // Start with light blue (sky/water)

    // Define regions for different features
    for (let x = 0; x < 500; x++) {
      for (let y = 0; y < 500; y++) {
        let color;

        // Top-left quadrant: Vegetation
        if (x < 250 && y < 250) {
          const r = Math.floor(Math.random() * 100);
          const g = 150 + Math.floor(Math.random() * 100);
          const b = Math.floor(Math.random() * 60);
          color = Jimp.rgbaToInt(r, g, b, 255);
        }
        // Top-right quadrant: Urban
        else if (x >= 250 && y < 250) {
          if (x % 30 < 3 || y % 30 < 3) {
            color = 0x333333ff; // Roads
          } else {
            const value = 100 + Math.floor(Math.random() * 155);
            color = Jimp.rgbaToInt(value, value, value, 255);
          }
        }
        // Bottom-left quadrant: Water
        else if (x < 250 && y >= 250) {
          const r = Math.floor(Math.random() * 40);
          const g = 50 + Math.floor(Math.random() * 70);
          const b = 150 + Math.floor(Math.random() * 100);
          color = Jimp.rgbaToInt(r, g, b, 255);
        }
        // Bottom-right quadrant: Clouds
        else {
          const noise = Math.sin(x * 0.05) * Math.cos(y * 0.05);
          if (noise > 0) {
            const value = 220 + Math.floor(Math.random() * 35);
            color = Jimp.rgbaToInt(value, value, value, 255);
          } else {
            color = 0x6699ffff; // Sky background
          }
        }

        image.setPixelColor(color, x, y);
      }
    }

    await image.writeAsync(path.join(samplesDir, "mixed.jpg"));
    console.log("Created mixed features sample image");
  } catch (error) {
    console.error("Error creating mixed image:", error);
  }
}

// Main function to create all sample images
async function createAllSampleImages() {
  try {
    console.log("Creating sample images...");
    await createVegetationImage();
    await createWaterImage();
    await createUrbanImage();
    await createCloudsImage();
    await createMixedImage();
    console.log("All sample images created successfully");
  } catch (error) {
    console.error("Error creating sample images:", error);
  }
}

// Execute the function
createAllSampleImages();
