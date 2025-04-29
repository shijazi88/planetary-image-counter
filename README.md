# Planetary Image Feature Counter

A web application for counting and analyzing features in satellite imagery using Microsoft's Planetary Computer API.

## Features

- Search for satellite images from various collections (Sentinel-2, Landsat, NAIP)
- Specify search parameters like bounding box and limit
- Browse and select images from search results
- Analyze images to count different types of features:
  - Vegetation coverage
  - Water bodies
  - Urban areas
  - Cloud coverage
- Visualize detected features with color highlighting
- Display statistics about feature count and area percentage

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript
- **Image Processing**: Sharp, Jimp
- **Data Source**: Microsoft Planetary Computer API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/planetary-image-counter.git
   cd planetary-image-counter
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following contents:

   ```
   # Microsoft Planetary Computer API
   PLANETARY_COMPUTER_API_URL=https://planetarycomputer.microsoft.com/api/stac/v1

   # Server Configuration
   PORT=3000

   # Optional: If you have a Planetary Computer API key
   # PC_SDK_SUBSCRIPTION_KEY=your_key_here
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. Select a satellite image collection from the dropdown
2. Enter a bounding box (or use the default San Francisco example)
3. Click "Search" or "Get Sample Image" to browse available imagery
4. Click on an image to select it for analysis
5. Choose the feature type you want to detect
6. Click "Analyze Image" to process and display results

## How It Works

1. The application connects to Microsoft's Planetary Computer API to search for satellite imagery
2. When you select an image, it is downloaded and processed on the server
3. The image processing algorithms analyze pixel values to identify different features based on spectral characteristics
4. Results are visualized with color highlighting and statistics are calculated

## Future Improvements

- Add more sophisticated feature detection algorithms
- Support for custom feature definitions
- Time series analysis of feature changes
- Integration with machine learning models for more accurate detection
- Support for downloading results and processed images

## License

This project is licensed under the ISC License.

## Acknowledgments

- [Microsoft Planetary Computer](https://planetarycomputer.microsoft.com/) for providing access to satellite data
- [Sharp](https://sharp.pixelplumbing.com/) and [Jimp](https://github.com/oliver-moran/jimp) for image processing capabilities
