# WordPress to Astro Rebuild Integration

This document describes how to set up automatic rebuilds of your Astro site when content is updated in WordPress.

## How It Works

1. When content is updated in WordPress (new post, edit post, etc.), WordPress will send a webhook to your Astro site.
2. The Astro site has an API endpoint (`/api/wp-rebuild`) that receives this webhook.
3. When the endpoint receives a valid webhook, it triggers a rebuild of the site via a deployment hook.

## Setup Instructions

### 1. GitHub Pages Deployment Setup

This Astro site uses GitHub Actions for automated builds and deployment to GitHub Pages. When content changes, you can trigger a rebuild in several ways:

**Option A: Automatic on Git Push** (Recommended)
- Any push to the main or quantum-nest branch automatically triggers a build and deployment
- No additional setup needed - already configured in `.github/workflows/build-and-deploy.yml`

**Option B: Manual GitHub Actions Trigger**
- Go to your GitHub repository → Actions tab
- Select "Build and Deploy to GitHub Pages"
- Click "Run workflow"

**Option C: Scheduled Rebuilds**
- Edit `.github/workflows/build-and-deploy.yml` to add a schedule trigger
- See SCHEDULED_REBUILD.md for detailed instructions

### 2. Configure Webhook Secret (Optional)

If you want to authenticate webhook requests from WordPress:

- `WP_WEBHOOK_SECRET`: A secure random string to authenticate webhook requests (e.g., `67136844`)
- Store this in GitHub repository Settings → Secrets and variables → Actions (or document for your webhook handler)

### 3. Set Up the WordPress Webhook Plugin

There are several options for setting up webhooks in WordPress:

#### Option A: Using WP Webhooks Plugin

1. Install and activate the [WP Webhooks](https://wordpress.org/plugins/wp-webhooks/) plugin in WordPress
2. Go to WP Webhooks > Settings > Send Data
3. Add a new webhook with the following settings:
   - Name: "Rebuild Astro Site"
   - URL: `https://your-site-url.com/api/wp-rebuild`
   - Method: POST
   - Content Type: application/json
   - Custom data: Add a key `secret` with the value matching your `WP_WEBHOOK_SECRET`
4. In the "Triggers" section, select events like:
   - Post published
   - Post updated
   - Post deleted
   - (Any other relevant triggers)

#### Option B: Custom WordPress Function

If you prefer to add code directly to your WordPress site, you can add this to your theme's `functions.php` file or a custom plugin:

```php
/**
 * Trigger a rebuild of the Astro site when content is updated
 */
function trigger_astro_rebuild($post_id) {
    // Only proceed if this is not an autosave or revision
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }

    // Get the post
    $post = get_post($post_id);

    // Only trigger for published posts
    if ($post->post_status != 'publish') {
        return;
    }

    // Your Astro site URL and webhook secret
    $webhook_url = 'https://your-site-url.com/api/wp-rebuild';
    $webhook_secret = '67136844'; // Should match WP_WEBHOOK_SECRET

    // Data to send
    $data = array(
        'secret' => $webhook_secret,
        'post_id' => $post_id,
        'post_type' => $post->post_type,
        'event' => 'post_updated'
    );

    // Send the webhook
    wp_remote_post($webhook_url, array(
        'body' => json_encode($data),
        'headers' => array('Content-Type' => 'application/json'),
        'timeout' => 30
    ));
}

// Hook into post save events
add_action('save_post', 'trigger_astro_rebuild', 10, 1);
add_action('delete_post', 'trigger_astro_rebuild', 10, 1);
```

### 4. Test the Integration

1. Make a change to a post in WordPress and publish/update it
2. Check your server logs to confirm that a new build was triggered
3. Verify that the changes appear on your site once the build completes

## Troubleshooting

If the rebuild is not being triggered:

1. Check WordPress webhook logs (if using a plugin)
2. Verify that the secret matches between WordPress and your Astro site
3. Check your server logs for any errors in the webhook endpoint
4. Make sure the `VERCEL_DEPLOY_HOOK` environment variable is correctly set
5. Test the endpoint directly by sending a POST request with tools like Postman or curl:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"secret":"67136844","test":true}' \
  https://your-site-url.com/api/wp-rebuild
```

## Security Considerations

- Keep your webhook secret secure and use a strong random string
- Consider using HTTPS-only for all webhook communications
- Regularly rotate your webhook secrets
- Monitor webhook activity for any suspicious patterns

## Advanced Configuration

For more advanced use cases, you might want to:

- Filter which types of content updates trigger rebuilds
- Implement incremental builds for better performance
- Add additional validation or rate limiting to prevent abuse
- Add notifications when rebuilds are triggered or fail
