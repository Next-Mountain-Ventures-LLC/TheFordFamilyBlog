# Scheduled Rebuilds for GitHub Pages

This document explains how to set up a daily scheduled rebuild of your Astro site at 11:10am using GitHub Actions.

## How It Works

1. GitHub Actions runs a scheduled workflow at the specified time
2. The workflow checks out your repository, builds the site, and deploys it to GitHub Pages
3. The site is rebuilt and redeployed automatically on schedule

## Setup Instructions

### GitHub Actions Scheduled Workflow

Your site is configured with a GitHub Actions workflow that:
- Builds on push to main/quantum-nest branches
- Can be manually triggered via workflow_dispatch
- Can be scheduled using GitHub Actions cron syntax

To add a scheduled rebuild, update `.github/workflows/build-and-deploy.yml` with a schedule trigger:

```yaml
on:
  push:
    branches: [main, quantum-nest]
  schedule:
    # Run at 11:10 AM UTC every day
    - cron: '10 11 * * *'
  workflow_dispatch:
```

### 2. Set Up a Cron Job or Scheduled Task

You have several options to trigger the daily rebuild:

#### Option A: Using a Cron Service (Recommended)

1. Sign up for a free cron job service like [Cron-job.org](https://cron-job.org), [EasyCron](https://easycron.com), or [GitHub Actions](https://github.com/features/actions)

2. Create a new cron job with the following settings:
   - URL: `https://your-site-url.com/api/scheduled-rebuild?secret=ford-family-schedule-secret` (use your actual secret)
   - Method: GET
   - Schedule: Daily at 11:10 AM
   - Timezone: Your preferred timezone

#### Option B: Using GitHub Actions

If your site is hosted in a GitHub repository, you can use GitHub Actions to create a scheduled workflow:

1. Create a file at `.github/workflows/scheduled-rebuild.yml` in your repository:

```yaml
name: Daily Rebuild

on:
  schedule:
    # Run at 11:10 AM UTC every day
    - cron: '10 11 * * *'

jobs:
  rebuild:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger rebuild
        run: |
          curl -X GET "https://your-site-url.com/api/scheduled-rebuild?secret=ford-family-schedule-secret"
```

2. Adjust the cron schedule as needed for your timezone

#### Option C: Using Vercel Cron Jobs

If you're using Vercel, you can use their built-in Cron Jobs feature:

1. Add the following to your `vercel.json` file:

```json
{
  "crons": [
    {
      "path": "/api/scheduled-rebuild?secret=ford-family-schedule-secret",
      "schedule": "10 11 * * *"
    }
  ]
}
```

2. Adjust the cron schedule as needed for your timezone

### 3. Testing the Scheduled Rebuild

To test that your scheduled rebuild is configured correctly:

1. Visit your scheduled rebuild endpoint directly in a browser:
   `https://your-site-url.com/api/scheduled-rebuild?secret=ford-family-schedule-secret`

2. You should see a JSON response confirming that the rebuild has been triggered
3. Check your Vercel dashboard to verify that a new deployment has started

## Troubleshooting

If the scheduled rebuild is not working:

1. Verify that your environment variables are set correctly
2. Check your cron service logs to ensure the request is being made
3. Test the endpoint manually to confirm it's working
4. Check your server logs for any errors in the scheduled rebuild endpoint

## Advanced Configuration

You can extend the scheduled rebuild functionality:

- Set up multiple schedules for different times of day
- Add more sophisticated validation or rate limiting
- Implement conditional rebuilds based on content changes
- Send notification emails when rebuilds are completed or fail
