import React, { useState } from 'react';
import { storeWebhookEvent } from '../../utils/webhookStorage';

export default function WebhookTriggerForm() {
  const [endpoint, setEndpoint] = useState('/api/new-website-hook');
  const [actionType, setActionType] = useState('content_update');
  const [customPayload, setCustomPayload] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string} | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      // Prepare the payload
      let payload: Record<string, any> = {};
      
      // For new-website-hook
      if (endpoint === '/api/new-website-hook') {
        payload = {
          apiKey: 'ford-family-new-website-key',
          siteId: 'ford-family-site',
          action: actionType,
          timestamp: new Date().toISOString()
        };
        
        // Add action-specific fields
        if (actionType === 'content_update') {
          payload.contentId = 'test-content-' + Date.now().toString().slice(-5);
          payload.triggerRebuild = true;
        } else if (actionType === 'media_update') {
          payload.mediaId = 'test-media-' + Date.now().toString().slice(-5);
          payload.triggerRebuild = true;
        } else if (actionType === 'rebuild') {
          payload.reason = 'Manual test trigger';
        }
      } 
      // For wp-rebuild
      else if (endpoint === '/api/wp-rebuild') {
        payload = {
          secret: 'ford-family-wp-hook-secret',
          source: 'test',
          timestamp: new Date().toISOString()
        };
      }
      // For rebuild-hook
      else if (endpoint === '/api/rebuild-hook') {
        payload = {
          secret: 'ford-family-rebuild-hook-secret',
          timestamp: new Date().toISOString()
        };
      }

      // Add custom payload if provided
      if (customPayload.trim()) {
        try {
          const customData = JSON.parse(customPayload);
          payload = { ...payload, ...customData };
        } catch (error) {
          console.error('Invalid JSON in custom payload:', error);
          setResult({ 
            success: false, 
            message: 'Invalid JSON in custom payload' 
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Call the webhook endpoint
      // In a real environment, you'd make an actual fetch request to the webhook
      // Since this is a simulation, we'll just log it and store the event
      console.log(`Simulating webhook call to ${endpoint} with action ${actionType}:`, payload);
      
      // Simulate response time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real implementation, we would make a fetch request like:
      // const response = await fetch(endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload)
      // });
      
      // For simulation purposes, store a success event
      storeWebhookEvent({
        endpoint,
        action: actionType,
        status: 'success',
        payload,
        response: {
          success: true,
          message: `Successfully processed ${actionType} webhook`,
          processedAt: new Date().toISOString()
        }
      });
      
      // Set success result
      setResult({
        success: true,
        message: `Successfully triggered ${endpoint} webhook with action ${actionType}`
      });
      
    } catch (error) {
      console.error('Error triggering webhook:', error);
      
      // Store the error event
      storeWebhookEvent({
        endpoint,
        action: actionType,
        status: 'error',
        payload: JSON.parse(customPayload || '{}'),
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Set error result
      setResult({
        success: false,
        message: `Error triggering webhook: ${error instanceof Error ? error.message : String(error)}`
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-bold mb-4">Trigger Webhook</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Endpoint Selection */}
        <div>
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">Webhook Endpoint</label>
          <select 
            id="endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="/api/new-website-hook">new.website Hook</option>
            <option value="/api/wp-rebuild">WordPress Rebuild</option>
            <option value="/api/rebuild-hook">Generic Rebuild Hook</option>
          </select>
        </div>
        
        {/* Action Type - only show for new-website-hook */}
        {endpoint === '/api/new-website-hook' && (
          <div>
            <label htmlFor="actionType" className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select 
              id="actionType"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="content_update">Content Update</option>
              <option value="media_update">Media Update</option>
              <option value="rebuild">Rebuild</option>
            </select>
          </div>
        )}
        
        {/* Custom Payload */}
        <div>
          <label htmlFor="customPayload" className="block text-sm font-medium text-gray-700 mb-1">
            Custom Payload (Optional JSON)
          </label>
          <textarea
            id="customPayload"
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            placeholder='{"customField": "value"}'
            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">
            Add additional JSON fields to include in the webhook payload
          </p>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Triggering...' : 'Trigger Webhook'}
          </button>
        </div>
      </form>
      
      {/* Result Message */}
      {result && (
        <div className={`mt-4 p-3 rounded-md ${
          result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <p className="text-sm">{result.message}</p>
        </div>
      )}
      
      {/* Quick Description */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">About this tool:</h3>
        <p className="text-sm text-gray-600">
          This form allows you to simulate webhook triggers to test your webhook endpoints. 
          Select the endpoint type, action (for new.website hooks), and optionally add custom 
          payload fields. The system will record these test events in the webhook history.
        </p>
      </div>
    </div>
  );
}