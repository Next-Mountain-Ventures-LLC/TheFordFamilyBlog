# WordPress to Astro Rebuild Integration

This document describes how to set up automatic rebuilds of your Astro site when content is updated in WordPress.

## How It Works

1. When content is updated in WordPress (new post, edit post, etc.), WordPress will send a webhook to your Astro site.
2. The Astro site has an API endpoint (`/api/wp-rebuild`) that receives this webhook.
3. When the endpoint receives a valid webhook, it triggers a rebuild of the site via a Vercel deployment hook.

## Setup Instructions

### 1. Configure Vercel Deploy Hook

First, you need to create a Vercel deployment hook:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Git > Deploy Hooks
3. Create a new hook with a name like "WordPress Content Update"
4. Copy the generated URL (it should look like `https://api.vercel.com/v1/integrations/deploy/prj_xxxx/xxxxxx`)

### 2. Configure Environment Variables

In your Vercel project, add these environment variables:

- `VERCEL_DEPLOY_HOOK`: The deploy hook URL you copied in the previous step
- `WP_WEBHOOK_SECRET`: A secure random string that will be used to authenticate webhook requests (e.g., `ford-family-wp-hook-secret`)

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
    $webhook_secret = 'ford-family-wp-hook-secret'; // Should match WP_WEBHOOK_SECRET

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
2. Check the Vercel deployment logs to confirm that a new build was triggered
3. Verify that the changes appear on your site once the build completes

## Troubleshooting

If the rebuild is not being triggered:

1. Check WordPress webhook logs (if using a plugin)
2. Verify that the secret matches between WordPress and your Astro site
3. Check the Vercel function logs for any errors in the webhook endpoint
4. Test the endpoint directly by sending a POST request with tools like Postman or curl:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"secret":"ford-family-wp-hook-secret","test":true}' \
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