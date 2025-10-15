// API endpoint specifically for new.website platform webhooks
// File: /src/pages/api/new-website-hook.ts

import type { APIRoute } from 'astro';
import { storeWebhookEvent } from '../../utils/webhookStorage';

// You can set this to a secure token in your environment variables
const NEW_WEBSITE_API_KEY = process.env.NEW_WEBSITE_API_KEY || 'ford-family-new-website-key';
const NEW_WEBSITE_SITE_ID = process.env.NEW_WEBSITE_SITE_ID || 'ford-family-site';

// This function will be called when new.website sends a webhook
export const post: APIRoute = async ({ request }) => {
  try {
    // Get the request headers and body
    const contentType = request.headers.get('content-type');
    
    // Process different content types appropriately
    let apiKey;
    let siteId;
    let action;
    let postData: Record<string, any> = {};
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON data
      const data = await request.json();
      apiKey = data.apiKey;
      siteId = data.siteId;
      action = data.action;
      postData = data;
    } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
      // Handle form data
      const formData = await request.formData();
      apiKey = formData.get('apiKey')?.toString();
      siteId = formData.get('siteId')?.toString();
      action = formData.get('action')?.toString();
      
      // Convert formData to object for logging
      for (const [key, value] of formData.entries()) {
        postData[key] = value;
      }
    } else {
      // Handle other formats
      const text = await request.text();
      try {
        // Try to parse as JSON first
        const jsonData = JSON.parse(text);
        apiKey = jsonData.apiKey;
        siteId = jsonData.siteId;
        action = jsonData.action;
        postData = jsonData;
      } catch (e) {
        // If not JSON, assume it's a query string
        const params = new URLSearchParams(text);
        apiKey = params.get('apiKey');
        siteId = params.get('siteId');
        action = params.get('action');
        
        // Convert params to object for logging
        for (const [key, value] of params.entries()) {
          postData[key] = value;
        }
      }
    }

    // Log the incoming webhook (except for the API key)
    const sanitizedData = { ...postData };
    if (sanitizedData.apiKey) {
      sanitizedData.apiKey = '[REDACTED]';
    }
    console.log('new.website webhook received:', sanitizedData);

    // Validate the API key and site ID
    if (apiKey !== NEW_WEBSITE_API_KEY) {
      console.warn('Invalid new.website API key received');
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid API key'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (siteId !== NEW_WEBSITE_SITE_ID) {
      console.warn('Invalid new.website site ID received');
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid site ID'
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Process the webhook based on the action
    switch (action) {
      case 'content_update':
        await handleContentUpdate(postData);
        break;
      case 'media_update':
        await handleMediaUpdate(postData);
        break;
      case 'rebuild':
        await triggerRebuild(postData);
        break;
      default:
        console.warn(`Unrecognized action: ${action}`);
        return new Response(JSON.stringify({
          success: false,
          message: 'Unrecognized action'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }

    // Create response data
    const responseData = {
      success: true,
      message: `Successfully processed ${action} webhook`,
      processedAt: new Date().toISOString()
    };
    
    // Store webhook event in history
    storeWebhookEvent({
      endpoint: '/api/new-website-hook',
      action: action || 'unknown',
      status: 'success',
      payload: postData,
      response: responseData
    });
    
    // Return success response
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error processing new.website webhook:', error);
    
    // Create error response data
    const errorData = {
      success: false,
      message: 'Error processing webhook',
      error: error instanceof Error ? error.message : String(error)
    };
    
    // Store webhook error event in history
    storeWebhookEvent({
      endpoint: '/api/new-website-hook',
      action: 'error',
      status: 'error',
      payload: {},
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Return error response
    return new Response(JSON.stringify(errorData), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Handle content update action
async function handleContentUpdate(data: Record<string, any>) {
  console.log('Processing content update:', data.contentId);
  
  // Here you would typically:
  // 1. Fetch the updated content from new.website API
  // 2. Update your local cache or data store
  // 3. Trigger a rebuild of affected pages
  
  // For now, we'll simulate these steps
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // If necessary, trigger a rebuild
  if (data.triggerRebuild === true) {
    await triggerRebuild({ reason: `Content update for ${data.contentId}` });
  }
}

// Handle media update action
async function handleMediaUpdate(data: Record<string, any>) {
  console.log('Processing media update:', data.mediaId);
  
  // Here you would typically:
  // 1. Fetch the updated media from new.website API
  // 2. Update your local media files
  // 3. Trigger a rebuild of affected pages if necessary
  
  // For now, we'll simulate these steps
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // If necessary, trigger a rebuild
  if (data.triggerRebuild === true) {
    await triggerRebuild({ reason: `Media update for ${data.mediaId}` });
  }
}

// Trigger a rebuild of the site
async function triggerRebuild(data: Record<string, any>) {
  console.log('Triggering site rebuild:', data.reason || 'manual trigger');
  
  // For new.website platform, you would use their API to trigger a build
  const NEW_WEBSITE_BUILD_HOOK = process.env.NEW_WEBSITE_BUILD_HOOK || 'https://api.new.website/v1/sites/ford-family-site/rebuild';
  
  try {
    // Prepare the payload for the build hook
    const payload = {
      apiKey: NEW_WEBSITE_API_KEY,
      siteId: NEW_WEBSITE_SITE_ID,
      reason: data.reason || 'API webhook trigger',
      timestamp: new Date().toISOString()
    };
    
    // Make the API request to trigger the build
    const response = await fetch(NEW_WEBSITE_BUILD_HOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NEW_WEBSITE_API_KEY}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to trigger rebuild: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Rebuild initiated successfully:', result);
    
    return result;
  } catch (error) {
    console.error('Error triggering rebuild:', error);
    throw error;
  }
}

// Handle GET requests to check if the webhook is up
export const get: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: true,
    message: 'new.website webhook endpoint is active',
    instructions: 'Send a POST request with a valid API key and site ID to trigger actions'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};