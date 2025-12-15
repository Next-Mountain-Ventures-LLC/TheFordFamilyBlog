// DEPRECATED: This endpoint is no longer used
// The application has migrated from Vercel to GitHub Pages (static hosting only)
// GitHub Pages does not support API routes
// All form components now post directly to the Zapier webhook URL
// This file is kept for reference only

import type { APIRoute } from 'astro';

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

if (!ZAPIER_WEBHOOK_URL) {
  console.warn('Warning: ZAPIER_WEBHOOK_URL environment variable is not set. Form submissions will fail.');
}

export const post: APIRoute = async ({ request }) => {
  try {
    if (!ZAPIER_WEBHOOK_URL) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Form submission service is not configured'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Get the request body - it should be FormData
    const formData = await request.formData();
    
    // Convert FormData to a plain object for logging and forwarding
    const formDataObj: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (formDataObj[key]) {
        // Handle multiple values for the same key
        if (Array.isArray(formDataObj[key])) {
          formDataObj[key].push(value);
        } else {
          formDataObj[key] = [formDataObj[key], value];
        }
      } else {
        formDataObj[key] = value;
      }
    }

    console.log('Form submission received:', {
      form_name: formDataObj.form_name,
      email: formDataObj.email,
      timestamp: new Date().toISOString()
    });

    // Forward the form data to Zapier
    const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObj)
    });

    if (!zapierResponse.ok) {
      const errorText = await zapierResponse.text();
      console.error('Zapier webhook failed:', {
        status: zapierResponse.status,
        error: errorText
      });
      
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to process form submission'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Form successfully forwarded to Zapier');

    return new Response(JSON.stringify({
      success: true,
      message: 'Form submitted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error processing form submission:', error);

    return new Response(JSON.stringify({
      success: false,
      message: 'Error processing form submission',
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const get: APIRoute = async () => {
  return new Response(JSON.stringify({
    success: true,
    message: 'Form submission endpoint is active',
    instructions: 'Send a POST request with form data to submit forms'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
