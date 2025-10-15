import React, { useState } from 'react';
import WebhookStats from './WebhookStats';
import WebhookHistory from './WebhookHistory';
import WebhookTriggerForm from './WebhookTriggerForm';

export default function WebhookDashboard() {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-foreground">Webhook Testing Dashboard</h1>
          <p className="text-muted-foreground">Monitor, test, and analyze your webhook integrations</p>
        </div>
      </div>
      
      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Section - Always visible */}
        <div className="col-span-1">
          <WebhookStats />
        </div>
        
        {/* Trigger Form - Always visible */}
        <div className="col-span-1">
          <WebhookTriggerForm />
        </div>
        
        {/* Endpoint Documentation - Tab in mobile, column in desktop */}
        <div className="col-span-1 hidden md:block">
          <div className="bg-white p-6 rounded-lg shadow-sm border h-full">
            <h2 className="text-lg font-bold mb-4">Webhook Endpoints</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-primary">New Website Hook</h3>
                <code className="block bg-gray-50 p-2 rounded text-xs mt-1">/api/new-website-hook</code>
                <p className="text-xs text-gray-500 mt-1">
                  Handles webhooks from the new.website platform for content updates, 
                  media updates, and rebuild requests.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-primary">WordPress Rebuild</h3>
                <code className="block bg-gray-50 p-2 rounded text-xs mt-1">/api/wp-rebuild</code>
                <p className="text-xs text-gray-500 mt-1">
                  Dedicated endpoint for WordPress to trigger rebuilds when content changes.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-primary">Generic Rebuild</h3>
                <code className="block bg-gray-50 p-2 rounded text-xs mt-1">/api/rebuild-hook</code>
                <p className="text-xs text-gray-500 mt-1">
                  General purpose rebuild endpoint for any service to trigger a site rebuild.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-primary mb-2">Authentication</h3>
                <p className="text-xs text-gray-500">
                  All webhook endpoints require authentication:
                </p>
                <ul className="text-xs text-gray-500 list-disc ml-4 mt-2 space-y-1">
                  <li><strong>new-website-hook:</strong> Requires apiKey and siteId</li>
                  <li><strong>wp-rebuild:</strong> Requires secret token</li>
                  <li><strong>rebuild-hook:</strong> Requires secret token</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Full-width History Section */}
        <div className="col-span-1 md:col-span-3">
          <WebhookHistory />
        </div>
      </div>
      
      {/* Mobile Tabs for Documentation - Only visible on mobile */}
      <div className="block md:hidden mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-bold mb-4">Webhook Endpoints</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-primary">New Website Hook</h3>
              <code className="block bg-gray-50 p-2 rounded text-xs mt-1">/api/new-website-hook</code>
              <p className="text-xs text-gray-500 mt-1">
                Handles webhooks from the new.website platform for content updates, 
                media updates, and rebuild requests.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-primary">WordPress Rebuild</h3>
              <code className="block bg-gray-50 p-2 rounded text-xs mt-1">/api/wp-rebuild</code>
              <p className="text-xs text-gray-500 mt-1">
                Dedicated endpoint for WordPress to trigger rebuilds when content changes.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-primary">Generic Rebuild</h3>
              <code className="block bg-gray-50 p-2 rounded text-xs mt-1">/api/rebuild-hook</code>
              <p className="text-xs text-gray-500 mt-1">
                General purpose rebuild endpoint for any service to trigger a site rebuild.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}