import React from 'react';
import { getWebhookStats } from '../../utils/webhookStorage';

export default function WebhookStats() {
  const stats = getWebhookStats();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-lg font-bold mb-4">Webhook Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Events Card */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
          <h3 className="text-blue-800 font-medium text-sm mb-1">Total Events</h3>
          <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
        </div>
        
        {/* Success Rate Card */}
        <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
          <h3 className="text-green-800 font-medium text-sm mb-1">Success Rate</h3>
          <p className="text-3xl font-bold text-green-900">{stats.successRate.toFixed(1)}%</p>
          <p className="text-xs text-green-700 mt-1">{stats.successful} successful / {stats.failed} failed</p>
        </div>
        
        {/* Recent Activity Card */}
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
          <h3 className="text-purple-800 font-medium text-sm mb-1">Most Recent</h3>
          <p className="text-xl font-bold text-purple-900">
            {stats.total > 0 ? new Date().toLocaleDateString() : 'No events'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events by Endpoint */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2 text-sm">Events by Endpoint</h3>
          <div className="bg-gray-50 rounded-lg p-4 border">
            {Object.keys(stats.byEndpoint).length > 0 ? (
              <ul className="space-y-2">
                {Object.entries(stats.byEndpoint).map(([endpoint, count]) => (
                  <li key={endpoint} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{endpoint.split('/').pop()}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${(count / stats.total) * 100}%`}}
                        ></div>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No endpoint data available</p>
            )}
          </div>
        </div>
        
        {/* Events by Action */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2 text-sm">Events by Action</h3>
          <div className="bg-gray-50 rounded-lg p-4 border">
            {Object.keys(stats.byAction).length > 0 ? (
              <ul className="space-y-2">
                {Object.entries(stats.byAction).map(([action, count]) => (
                  <li key={action} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{action || 'unknown'}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{width: `${(count / stats.total) * 100}%`}}
                        ></div>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No action data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}