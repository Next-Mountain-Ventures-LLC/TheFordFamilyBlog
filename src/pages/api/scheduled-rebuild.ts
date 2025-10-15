// API endpoint for scheduled rebuilds
// File: /src/pages/api/scheduled-rebuild.ts

import type { APIRoute } from 'astro';

// You can set this to a secure token in your environment variables
const SCHEDULE_SECRET = process.env.SCHEDULE_SECRET || 'ford-family-schedule-secret';

// This function will be called by the scheduler
export const get: APIRoute = async ({ request }) => {
  try {
    // Get the secret from the request URL
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');

    // Validate the secret
    if (secret !== SCHEDULE_SECRET) {
      console.warn('Invalid schedule secret received');
      return new Response(JSON.stringify({
        message: 'Invalid schedule secret'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Get the Vercel deployment hook URL from environment variables
    const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK || 'https://api.vercel.com/v1/integrations/deploy/prj_your_project_id/your_hook_id';
    
    console.log('Triggering scheduled rebuild via Vercel deploy hook...');
    
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
        message: 'Scheduled rebuild failed',
        error: result
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Return success response
    return new Response(JSON.stringify({
      message: 'Scheduled rebuild initiated successfully',
      timestamp: new Date().toISOString(),
      details: {
        jobType: 'daily-rebuild',
        scheduledTime: '11:00am',
        deploymentInfo: result
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error processing scheduled rebuild:', error);
    
    // Return error response
    return new Response(JSON.stringify({
      message: 'Error processing scheduled rebuild',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};