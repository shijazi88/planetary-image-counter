# Deploying to DigitalOcean App Platform

This guide walks you through the process of deploying the Planetary Image Feature Counter application to DigitalOcean App Platform.

## Prerequisites

1. A [DigitalOcean](https://www.digitalocean.com/) account
2. Your code pushed to a GitHub repository
3. (Optional) The DigitalOcean CLI (`doctl`) installed for command-line deployment

## Deployment Options

### Option 1: Using the DigitalOcean Web Console

1. Log in to your [DigitalOcean account](https://cloud.digitalocean.com/login)

2. Navigate to the App Platform section:

   - Click on "Apps" in the left sidebar
   - Click "Create App" button

3. Connect your repository:

   - Connect your GitHub account if not already connected
   - Select the repository containing your Planetary Image Counter code
   - Choose the branch you want to deploy (typically `main`)

4. Configure the application:

   - DigitalOcean should automatically detect the Node.js application
   - Ensure the Run Command is set to `npm start`
   - Set the HTTP port to `8080` (DigitalOcean's default)

5. Configure environment variables:

   - Add the following environment variables:
     - `PORT`: `8080`
     - `PLANETARY_COMPUTER_API_KEY`: Your API key from Microsoft Planetary Computer

6. Choose your plan:

   - Basic tier is sufficient for most use cases
   - Select the "Basic" plan and the smallest instance size ("Basic-XS")

7. Review your app settings and click "Launch App"

### Option 2: Using the Configuration File (CLI)

This repository includes a `.do/app.yaml` file which can be used to deploy via the CLI.

1. Update the GitHub information in `.do/app.yaml`:

   - Open `.do/app.yaml`
   - Edit the `repo` field to point to your repository
   - Example: `repo: yourusername/planetary-image-counter`

2. Install and authenticate the DigitalOcean CLI:

   ```
   brew install doctl  # For macOS (using Homebrew)
   doctl auth init     # Follow the prompts to authenticate
   ```

3. Create the app using the specification file:

   ```
   doctl apps create --spec .do/app.yaml
   ```

4. Set up environment variables using the CLI:
   ```
   doctl apps update APP_ID --set-env-vars "PLANETARY_COMPUTER_API_KEY=your_api_key"
   ```
   (Replace `APP_ID` with your actual app ID from the previous step)

## Post-Deployment Steps

1. **Verify the deployment**:

   - Once deployment is complete, you can access your app at the URL provided by DigitalOcean
   - Test all features to make sure they're working correctly

2. **Set up a custom domain** (optional):

   - In the App Platform console, navigate to your app
   - Go to the "Settings" tab
   - Under "Domains", add your custom domain
   - Follow the instructions to configure DNS records

3. **Set up monitoring** (optional):
   - In the App Platform console, monitor app performance
   - Set up alerts for critical metrics

## Troubleshooting

If you encounter issues with your deployment, check the following:

1. **Build/deployment logs**:

   - Check the build logs in the App Platform console for any errors

2. **Runtime logs**:

   - Check the runtime logs for any runtime errors
   - You can view these in the "Components" tab of your app

3. **Environment variables**:

   - Ensure all required environment variables are set correctly
   - Make sure the `PORT` is set to `8080`

4. **Resource limits**:
   - If your app is crashing, you might need to upgrade to a larger instance size

## Updating Your App

To update your app after making changes:

1. Push your changes to the GitHub repository (to the branch you configured)
2. DigitalOcean will automatically detect the changes and redeploy your app

For manual deployment updates, use:

```
doctl apps update APP_ID --spec .do/app.yaml
```

## Additional Resources

- [DigitalOcean App Platform Documentation](https://docs.digitalocean.com/products/app-platform/)
- [Node.js on App Platform](https://docs.digitalocean.com/products/app-platform/languages-frameworks/nodejs/)
- [Environment Variables in App Platform](https://docs.digitalocean.com/products/app-platform/how-to/use-environment-variables/)
