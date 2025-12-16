# Static WordPress Integration for Astro

This project uses a statically generated blog from a WordPress backend. The integration pulls content from WordPress at build time and generates static HTML pages for optimal SEO and performance.

## How It Works

1. **Build-Time Fetching**: All WordPress content is fetched during the build process
2. **Static Generation**: Blog posts, category pages, tag pages, and author pages are pre-rendered as static HTML
3. **Webhook-Triggered Rebuilds**: New content triggers a site rebuild via webhook

## Key Files

- `/src/lib/wordpress.ts`: WordPress API client
- `/src/pages/blog/[slug].astro`: Individual blog post template with `getStaticPaths()`
- `/src/pages/blog/category/[slug].astro`: Category pages with `getStaticPaths()`
- `/src/pages/blog/tag/[slug].astro`: Tag pages with `getStaticPaths()`
- `/src/pages/blog/author/[slug].astro`: Author pages with `getStaticPaths()`
- `/src/pages/blog/page/[page].astro`: Pagination with `getStaticPaths()`
- `/src/pages/api/rebuild-hook.ts`: Webhook endpoint for triggering rebuilds

## Setting Up Webhooks

To keep your static site updated when content changes in WordPress, set up a webhook:

1. **WordPress Side**: Install a webhook plugin like "WP Webhooks" or "WebHooks for WordPress"
2. **Configure Trigger Events**: Set up triggers for post publishing, updating, and deleting
3. **Webhook URL**: Point to your deployment platform's build hook or to `/api/rebuild-hook`
4. **Secret Token**: Set a secret token in both WordPress and your environment variables

## Deployment Platform Configuration

### GitHub Pages

This site is deployed to GitHub Pages using GitHub Actions:

1. **Automatic Deployments**: Any push to main or quantum-nest branch triggers an automatic build and deployment
2. **Manual Deployments**: Use GitHub Actions UI to manually trigger "Build and Deploy to GitHub Pages" workflow
3. **Scheduled Deployments**: Edit `.github/workflows/build-and-deploy.yml` to add a cron schedule
4. **Webhook Secret**: Store `WEBHOOK_SECRET` in GitHub repository Settings → Secrets and variables → Actions if needed

### Build Workflow Configuration

The build workflow is configured in `.github/workflows/build-and-deploy.yml`:

- Installs dependencies
- Builds Astro site to static HTML
- Deploys to GitHub Pages
- Runs on: push to main/quantum-nest and manual workflow_dispatch

## Adding New Content Types

To add a new content type from WordPress:

1. Add the new type interface to `/src/lib/wordpress.ts`
2. Create a new function to fetch the content type
3. Create a new page with `getStaticPaths()` to generate static routes

## Build Performance Optimization

For large WordPress sites:

1. Implement content type filtering in your API requests
2. Consider pagination in your `getStaticPaths()` functions
3. Use caching strategies during development

## Troubleshooting

If content is not updating:

1. Check webhook logs in WordPress
2. Verify your deployment platform received the build trigger
3. Check for any API errors in your build logs
4. Try a manual rebuild to confirm the content is accessible

## Local Development

During local development, the static generation will use the WordPress API to fetch content at build time. To test the webhook functionality locally:

1. Use a tool like ngrok to expose your local server
2. Configure a test WordPress instance to send webhooks to your ngrok URL
3. Test the rebuild functionality by publishing new content
