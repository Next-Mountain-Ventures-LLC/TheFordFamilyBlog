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

## Manual Rebuild

You can manually trigger a rebuild from the GitHub Actions tab in your repository:

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select "Build and Deploy to GitHub Pages"
4. Click "Run workflow"
5. Choose your branch and click "Run workflow"

The build will start immediately and deploy to GitHub Pages when complete.

## Adjusting the Schedule

To change the scheduled rebuild time, edit `.github/workflows/build-and-deploy.yml`:

1. Update the cron schedule in the `on:` section
2. Cron format: `'minute hour day month weekday'`
3. Example: `'0 12 * * 1'` runs at 12:00 PM UTC every Monday
4. Commit and push your changes

## Timezone Considerations

GitHub Actions uses UTC for cron schedules. To schedule for your local timezone:

1. Convert your desired time to UTC
2. Update the cron expression accordingly
3. Example: For 11:10 AM EST (UTC-5), use `'10 16 * * *'`

## Monitoring Scheduled Rebuilds

1. Go to GitHub repository → Actions tab
2. Click on "Build and Deploy to GitHub Pages"
3. View workflow runs and logs
4. Check deployment status in the "Deployments" tab of your repository
