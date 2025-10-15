import React, { useState, useEffect } from 'react';
import { getWebhookEvents, filterWebhookEvents, clearWebhookEvents, WebhookEvent } from '../../utils/webhookStorage';
import WebhookEventCard from './WebhookEventCard';

export default function WebhookHistory() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [endpoint, setEndpoint] = useState<string>('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');
  const [action, setAction] = useState<string>('');
  
  // Load events initially and set up refresh
  useEffect(() => {
    // Initial load
    refreshEvents();
    
    // Set up interval to refresh events (in case they're updated elsewhere)
    const intervalId = setInterval(refreshEvents, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Refresh events with current filters
  const refreshEvents = () => {
    const filteredEvents = filterWebhookEvents({
      endpoint: endpoint || undefined,
      action: action || undefined,
      status: status as any || undefined,
    });
    setEvents(filteredEvents);
  };
  
  // Apply filters when they change
  useEffect(() => {
    refreshEvents();
  }, [endpoint, status, action]);
  
  // Handle clearing all events
  const handleClearEvents = () => {
    if (window.confirm('Are you sure you want to clear all webhook history?')) {
      clearWebhookEvents();
      refreshEvents();
    }
  };
  
  // Get unique endpoints and actions for filter dropdowns
  const allEvents = getWebhookEvents();
  const uniqueEndpoints = [...new Set(allEvents.map(e => e.endpoint))];
  const uniqueActions = [...new Set(allEvents.map(e => e.action).filter(Boolean))];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-lg font-bold mb-4 md:mb-0">Webhook History</h2>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={refreshEvents}
            className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-100 hover:bg-blue-100"
          >
            Refresh
          </button>
          
          <button 
            onClick={handleClearEvents}
            className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded border border-red-100 hover:bg-red-100"
          >
            Clear All
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
        {/* Endpoint filter */}
        <div>
          <label htmlFor="endpointFilter" className="block text-xs font-medium text-gray-500 mb-1">Endpoint</label>
          <select
            id="endpointFilter"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Endpoints</option>
            {uniqueEndpoints.map(ep => (
              <option key={ep} value={ep}>{ep.split('/').pop()}</option>
            ))}
          </select>
        </div>
        
        {/* Status filter */}
        <div>
          <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select
            id="statusFilter"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
        </div>
        
        {/* Action filter */}
        <div>
          <label htmlFor="actionFilter" className="block text-xs font-medium text-gray-500 mb-1">Action</label>
          <select
            id="actionFilter"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            {uniqueActions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Events list */}
      <div>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map(event => (
              <WebhookEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto text-gray-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No webhook events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {allEvents.length > 0 
                ? 'Try changing your filters or refreshing the list.' 
                : 'Use the webhook trigger form to generate test events.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}