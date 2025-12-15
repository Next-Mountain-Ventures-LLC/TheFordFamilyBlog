// DEPRECATED: This endpoint is no longer in use
// The Ford Family website has migrated away from Vercel deployment hooks
// This file is kept for backwards compatibility only
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

    // Use the existing Vercel deployment hook from rebuild-hook.ts
    try {
      console.log('Processing WordPress webhook request...');
      
      // Get the Vercel deployment hook URL from environment variables
      const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK || 'https://api.vercel.com/v1/integrations/deploy/prj_your_project_id/your_hook_id';
      
      console.log('Triggering Vercel deploy hook...');
      
      // Call the Vercel deployment hook
      const response = await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' });
      
      let result;
      try {
        // Try to parse response as JSON
        result = await response.json();
      } catch (e) {
        // Fallback to text if not JSON
        result = await response.text();
      }
      
      console.log('Vercel deployment hook response:', {
        status: response.status,
        result
      });
      
      // If the deploy hook failed, return an error
      if (!response.ok) {
        console.warn('Vercel deployment hook failed:', result);
        return new Response(JSON.stringify({
          message: 'Rebuild trigger failed',
          error: result
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Convert result to string if it's an object
      const resultString = typeof result === 'string' ? result : JSON.stringify(result);
      const truncatedResult = resultString.substring(0, 500) + (resultString.length > 500 ? '...' : '');

      // Return success response
      return new Response(JSON.stringify({
        message: 'WordPress-triggered rebuild initiated successfully',
        details: {
          timestamp: new Date().toISOString(),
          success: response.ok,
          status: response.status,
          responseInfo: truncatedResult
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
