// API endpoint for webhook-triggered rebuilds
// File: /src/pages/api/rebuild-hook.ts

import type { APIRoute } from 'astro';

// You can set this to a secure token in your environment variables
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'ford-family-rebuild-hook-secret';

// This function will be called when the webhook is triggered
export const post: APIRoute = async ({ request, redirect }) => {
  try {
    // Get the secret from the request
    const data = await request.json();
    const secret = data.secret;

    // Validate the secret
    if (secret !== WEBHOOK_SECRET) {
      return new Response(JSON.stringify({
        message: 'Invalid webhook secret'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // In a real deployment environment, this would trigger a rebuild
    // For Vercel, we'll use their API to trigger a new deployment
    const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK || 'https://api.vercel.com/v1/integrations/deploy/prj_your_project_id/your_hook_id';

    // Make a request to the Vercel Deploy Hook
    try {
      const response = await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' });
      const result = await response.json();
      
      console.log('Webhook triggered - rebuild initiated', result);
      
      // If the deploy hook failed, return an error
      if (!response.ok) {
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
    } catch (deployError) {
      console.error('Error triggering deploy hook:', deployError);
      
      return new Response(JSON.stringify({
        message: 'Error triggering deploy hook',
        error: deployError instanceof Error ? deployError.message : String(deployError)
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Return success response
    return new Response(JSON.stringify({
      message: 'Rebuild triggered successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Return error response
    return new Response(JSON.stringify({
      message: 'Error processing webhook',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Optional: You can also handle GET requests to check if the webhook is up
export const get: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'Webhook endpoint is active',
    instructions: 'Send a POST request with a valid secret to trigger a rebuild'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};