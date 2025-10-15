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

    // Trigger an Astro rebuild using Node child_process
    try {
      console.log('Triggering Astro rebuild...');
      
      // Import the required Node modules
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      
      // Promisify exec for async/await usage
      const execAsync = promisify(exec);
      
      // Use Astro's build command
      // This executes the build command defined in package.json
      // You may need to adjust this command based on your specific setup
      const { stdout, stderr } = await execAsync('npm run build');
      
      console.log('Astro build output:', stdout);
      
      if (stderr) {
        console.error('Astro build errors:', stderr);
      }
      
      // Return success response
      return new Response(JSON.stringify({
        message: 'WordPress-triggered rebuild initiated successfully',
        details: {
          timestamp: new Date().toISOString(),
          success: true,
          buildOutput: stdout.substring(0, 500) + (stdout.length > 500 ? '...' : '')
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
    } catch (buildError) {
      console.error('Error triggering Astro build:', buildError);
      
      return new Response(JSON.stringify({
        message: 'Rebuild failed',
        error: buildError instanceof Error ? buildError.message : String(buildError)
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