// API endpoint specifically for WordPress webhooks
// File: /src/pages/api/wp-rebuild.ts

import type { APIRoute } from 'astro';

// You can set this to a secure token in your environment variables
const WP_WEBHOOK_SECRET = process.env.WP_WEBHOOK_SECRET || '67136844';

// This function will be called when WordPress sends a webhook
export const post: APIRoute = async ({ request, redirect }) => {
  try {
    // Get the request headers and body
    const contentType = request.headers.get('content-type');
    
    // Process different content types appropriately
    let secret;
    let postData = {};
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON data
      const data = await request.json();
      secret = data.secret;
      postData = data;
    } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
      // Handle form data from WordPress
      const formData = await request.formData();
      secret = formData.get('secret')?.toString();
      
      // Convert formData to object for logging
      for (const [key, value] of formData.entries()) {
        postData[key] = value;
      }
    } else {
      // Handle raw text or other formats as needed
      const text = await request.text();
      try {
        // Try to parse as JSON first
        const jsonData = JSON.parse(text);
        secret = jsonData.secret;
        postData = jsonData;
      } catch (e) {
        // If not JSON, assume it's a query string
        const params = new URLSearchParams(text);
        secret = params.get('secret');
        
        // Convert params to object for logging
        for (const [key, value] of params.entries()) {
          postData[key] = value;
        }
      }
    }

    // Log the incoming webhook (except for the secret)
    const sanitizedData = { ...postData };
    if (sanitizedData.secret) {
      sanitizedData.secret = '[REDACTED]';
    }
    console.log('WordPress webhook received:', sanitizedData);

    // Validate the secret
    if (secret !== WP_WEBHOOK_SECRET) {
      console.warn('Invalid WordPress webhook secret received');
      return new Response(JSON.stringify({
        message: 'Invalid webhook secret'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // For static sites, we need to use a deployment hook from your hosting provider
    try {
      console.log('Processing webhook request...');
      
      // Get the deployment hook URL from environment variables
      const DEPLOY_HOOK = process.env.DEPLOY_HOOK || '';
      
      if (!DEPLOY_HOOK) {
        console.warn('No DEPLOY_HOOK environment variable set');
        return new Response(JSON.stringify({
          message: 'Webhook received, but no deployment hook configured',
          details: {
            timestamp: new Date().toISOString(),
            success: false,
            error: 'Missing DEPLOY_HOOK environment variable'
          }
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Call the deployment hook
      const response = await fetch(DEPLOY_HOOK, { method: 'POST' });
      const result = await response.text();
      
      console.log('Deployment hook response:', {
        status: response.status,
        result
      });
      
      // Return success response
      return new Response(JSON.stringify({
        message: 'WordPress-triggered rebuild initiated successfully',
        details: {
          timestamp: new Date().toISOString(),
          success: response.ok,
          status: response.status,
          responseInfo: result.substring(0, 500) + (result.length > 500 ? '...' : '')
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
    } catch (deployError) {
      console.error('Error triggering deployment hook:', deployError);
      
      return new Response(JSON.stringify({
        message: 'Rebuild request failed',
        error: deployError instanceof Error ? deployError.message : String(deployError)
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

  } catch (error) {
    console.error('Error processing WordPress webhook:', error);
    
    // Return error response
    return new Response(JSON.stringify({
      message: 'Error processing WordPress webhook',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Handle GET requests to check if the webhook is up
export const get: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'WordPress rebuild webhook is active',
    instructions: 'Send a POST request with a valid secret to trigger a rebuild'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};