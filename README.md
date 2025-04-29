# Planetary Image Feature Counter

A web application that allows users to analyze satellite imagery for specific features like vegetation, water bodies, urban areas, and clouds using Microsoft's Planetary Computer API.

## Features

- Search for satellite imagery from various collections (Sentinel-2, Landsat, NAIP)
- Upload your own satellite images for analysis
- Choose from sample satellite images
- Analyze images for various features:
  - Vegetation (health, coverage, NDVI)
  - Water bodies (depth, clarity, shoreline complexity)
  - Urban areas (density, development patterns)
  - Cloud coverage (thickness, usability)
- Visual representation of analysis results
- Detailed statistics and metrics
- Key findings and practical applications

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Image Processing**: Jimp, Sharp
- **API Integration**: Microsoft Planetary Computer

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Local Development

1. Clone the repository:

   ```
   git clone https://github.com/your-username/planetary-image-counter.git
   cd planetary-image-counter
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with your configuration:

   ```
   cp env.example .env
   ```

   Then edit the `.env` file with your API keys and settings.

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deploying to DigitalOcean App Platform

### Prerequisites

1. A [DigitalOcean](https://www.digitalocean.com/) account
2. A GitHub repository with your code
3. [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) installed (optional, for CLI deployment)

### Deployment Steps

#### Option 1: Using the DigitalOcean Console

1. Log in to your DigitalOcean account
2. Go to the App Platform section
3. Click "Create App"
4. Connect your GitHub account and select your repository
5. Configure the app:
   - Choose the branch to deploy
   - Specify "npm start" as the run command
   - Set environment variables from your .env file
6. Select your plan (Basic or Professional)
7. Review and launch your app

#### Option 2: Using the Configuration File

The repository includes a `.do/app.yaml` file for DigitalOcean App Platform configuration.

1. Update the GitHub repo information in `.do/app.yaml` to point to your repository
2. Use the doctl CLI to deploy:
   ```
   doctl apps create --spec .do/app.yaml
   ```

### Setting Environment Variables

After deployment, set up these environment variables in the DigitalOcean App Platform Console:

- `PORT`: 8080 (DigitalOcean default)
- `PLANETARY_COMPUTER_API_KEY`: Your Microsoft Planetary Computer API key

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Microsoft Planetary Computer for providing access to satellite imagery
- Sentinel-2, Landsat, and NAIP for the satellite data
- All contributors and supporters of the project
