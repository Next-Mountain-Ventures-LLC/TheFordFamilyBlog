import React, { useState } from 'react';
import type { WebhookEvent } from '../../utils/webhookStorage';

interface WebhookEventCardProps {
  event: WebhookEvent;
}

export default function WebhookEventCard({ event }: WebhookEventCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Format the timestamp for display
  const formattedTime = new Date(event.timestamp).toLocaleString();
  
  // Determine status color
  const statusColor = event.status === 'success' 
    ? 'bg-green-100 border-green-200 text-green-800' 
    : 'bg-red-100 border-red-200 text-red-800';
  
  // Determine the endpoint badge color
  let endpointColor = 'bg-blue-100 text-blue-800';
  if (event.endpoint.includes('wp-rebuild')) {
    endpointColor = 'bg-purple-100 text-purple-800';
  } else if (event.endpoint.includes('new-website')) {
    endpointColor = 'bg-indigo-100 text-indigo-800';
  }
  
  // Get a shortened version of the payload for the collapsed view
  const shortPayload = JSON.stringify(event.payload).substring(0, 60) + 
    (JSON.stringify(event.payload).length > 60 ? '...' : '');
  
  return (
    <div className="border rounded-lg mb-4 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${statusColor}`}>
            {event.status === 'success' ? 'Success' : 'Error'}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${endpointColor}`}>
            {event.endpoint.split('/').pop()}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {event.action || 'unknown'}
          </span>
        </div>
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </div>
      
      {/* Collapsed Summary */}
      {!expanded && (
        <div 
          className="px-4 py-2 cursor-pointer hover:bg-gray-50"
          onClick={() => setExpanded(true)}
        >
          <p className="text-sm truncate text-gray-500">
            <span className="font-medium text-gray-700">Payload:</span> {shortPayload}
          </p>
        </div>
      )}
      
      {/* Expanded Details */}
      {expanded && (
        <div className="p-4 border-t">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Payload:</h4>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-60">{JSON.stringify(event.payload, null, 2)}</pre>
          </div>
          
          {event.response && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Response:</h4>
              <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-60">{JSON.stringify(event.response, null, 2)}</pre>
            </div>
          )}
          
          {event.error && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Error:</h4>
              <pre className="bg-red-50 p-2 rounded text-xs overflow-auto max-h-60">{event.error}</pre>
            </div>
          )}
          
          <div className="text-right">
            <button 
              onClick={() => setExpanded(false)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  );
}