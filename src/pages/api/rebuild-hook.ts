// API endpoint for webhook-triggered rebuilds
// File: /src/pages/api/rebuild-hook.ts

import type { APIRoute } from 'astro';

// You can set this to a secure token in your environment variables
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-token';

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
    // This is a placeholder for your deployment platform's API call
    // For example, on Vercel you might use their API to trigger a new deployment
    console.log('Webhook triggered - rebuild initiated');

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