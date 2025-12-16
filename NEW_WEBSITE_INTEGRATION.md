# new.website API Integration

This document describes how to integrate your Astro site with the new.website platform for automatic rebuilds and content synchronization via GitHub Pages.

## Overview

The integration allows for:

1. Automatic rebuilds when content is updated in WordPress via new.website
2. Content and media synchronization between WordPress and your Astro site
3. Manual rebuilds triggered through the new.website dashboard
4. GitHub Pages deployment via GitHub Actions

## How It Works with GitHub Pages

1. The new.website platform monitors your WordPress site for changes
2. When changes are detected, new.website sends a webhook to your Astro site's API endpoint
3. The API endpoint processes the webhook and triggers a GitHub Actions rebuild via GitHub API
4. GitHub Actions builds your Astro site and deploys to GitHub Pages automatically

## Configuration

### Environment Variables

Set the following environment variables in your GitHub repository Secrets and in your new.website project settings:

- `NEW_WEBSITE_API_KEY`: Your API key for authentication (default: 'ford-family-new-website-key')
- `NEW_WEBSITE_SITE_ID`: Your site ID in the new.website platform (default: 'ford-family-site')
- `GITHUB_TOKEN`: Your GitHub Personal Access Token for triggering workflows (for webhook handler)
- `GITHUB_REPOSITORY`: Your GitHub repository (e.g., 'next-mountain-ventures-llc/TheFordFamilyBlog')

### Webhook Endpoint

Your webhook endpoint is located at:

```
https://your-site-url.com/api/new-website-hook
```

This endpoint accepts both GET and POST requests:
- GET: Returns a status message to confirm the endpoint is active
- POST: Processes webhooks from the new.website platform

## Webhook Payload Format

The webhook expects a JSON payload with the following structure:

```json
{
  "apiKey": "your-api-key",
  "siteId": "your-site-id",
  "action": "content_update|media_update|rebuild",
  "contentId": "optional-content-id",
  "mediaId": "optional-media-id",
  "triggerRebuild": true,
  "reason": "optional reason for the action"
}
```

### Supported Actions

The webhook supports three actions:

1. `content_update`: Triggered when content is updated in WordPress
   - Required fields: `apiKey`, `siteId`, `action`, `contentId`
   - Optional fields: `triggerRebuild`

2. `media_update`: Triggered when media is updated in WordPress
   - Required fields: `apiKey`, `siteId`, `action`, `mediaId`
   - Optional fields: `triggerRebuild`

3. `rebuild`: Triggered to manually rebuild the site
   - Required fields: `apiKey`, `siteId`, `action`
   - Optional fields: `reason`

## Setting Up in new.website Dashboard

To configure this webhook in your new.website dashboard:

1. Log in to your new.website account
2. Navigate to your site settings
3. Go to the "Integrations" tab
4. Add a new webhook with:
   - URL: `https://your-site-url.com/api/new-website-hook`
   - Events to trigger: Content updates, Media updates, Manual triggers
   - Authentication: API Key (use your `NEW_WEBSITE_API_KEY`)

## Testing the Integration

You can test the integration by sending a POST request to your webhook endpoint:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "ford-family-new-website-key",
    "siteId": "ford-family-site",
    "action": "rebuild",
    "reason": "Test rebuild"
  }' \
  https://your-site-url.com/api/new-website-hook
```

A successful response will look like:

```json
{
  "success": true,
  "message": "Successfully processed rebuild webhook",
  "processedAt": "2025-10-15T12:34:56.789Z"
}
```

## Troubleshooting

If you encounter issues with the integration:

1. **Webhook Not Receiving Events**
   - Verify the webhook URL is correctly configured in the new.website dashboard
   - Check that your API key and site ID are correct
   - Ensure your site is published and the webhook endpoint is accessible

2. **Authentication Failures**
   - Confirm that the API key in your environment variables matches the one in your webhook payload
   - Check that the site ID is correct
   - Verify GITHUB_TOKEN has appropriate permissions for triggering workflows

3. **Rebuilds Not Triggering**
   - Check the logs in your new.website dashboard for webhook delivery status
   - Verify your GitHub Actions workflow is properly configured
   - Check GitHub Actions logs in your repository for any errors
   - Ensure your GitHub Personal Access Token hasn't expired

## Security Considerations

- Keep your API key secure and do not expose it in client-side code
- Use HTTPS for all webhook communications
- Consider implementing rate limiting to prevent abuse
- Regularly rotate your API keys

## Advanced Configuration

For more advanced use cases, you might want to:

1. **Implement Incremental Builds**
   - Modify the content update handler to only rebuild affected pages
   - Use the `contentId` to determine which pages need rebuilding

2. **Add Notification System**
   - Send notifications when rebuilds are triggered or fail
   - Integrate with Slack, email, or other notification services

3. **Implement Content Previews**
   - Add support for previewing unpublished content
   - Create a separate preview environment for draft content
