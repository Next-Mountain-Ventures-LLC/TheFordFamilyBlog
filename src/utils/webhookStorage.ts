/**
 * Webhook History Storage Utility
 * 
 * This utility provides a simple storage mechanism for webhook events.
 * It uses localStorage in the browser environment or a memory cache in the server environment.
 * 
 * Note: In a production environment, you would typically use a database for persistent storage.
 */

// Define the webhook event structure
export interface WebhookEvent {
  id: string;
  timestamp: string;
  endpoint: string;
  action: string;
  status: 'success' | 'error';
  payload: Record<string, any>;
  response?: Record<string, any>;
  error?: string;
}

// Memory storage fallback for server-side
const memoryStorage: WebhookEvent[] = [];

// Maximum number of events to store
const MAX_EVENTS = 100;

/**
 * Store a new webhook event
 */
export function storeWebhookEvent(event: Omit<WebhookEvent, 'id' | 'timestamp'>): WebhookEvent {
  // Generate a unique ID and timestamp
  const newEvent: WebhookEvent = {
    ...event,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  // Try to use localStorage if available
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Get existing events
      const eventsJson = localStorage.getItem('webhookEvents') || '[]';
      const events: WebhookEvent[] = JSON.parse(eventsJson);
      
      // Add new event and trim if needed
      events.unshift(newEvent);
      if (events.length > MAX_EVENTS) {
        events.length = MAX_EVENTS; // Trim to max length
      }
      
      // Save back to localStorage
      localStorage.setItem('webhookEvents', JSON.stringify(events));
    } catch (error) {
      console.error('Error storing webhook event in localStorage:', error);
      // Fallback to memory storage
      memoryStorage.unshift(newEvent);
      if (memoryStorage.length > MAX_EVENTS) {
        memoryStorage.length = MAX_EVENTS;
      }
    }
  } else {
    // Use memory storage (server-side)
    memoryStorage.unshift(newEvent);
    if (memoryStorage.length > MAX_EVENTS) {
      memoryStorage.length = MAX_EVENTS;
    }
  }

  return newEvent;
}

/**
 * Get all stored webhook events
 */
export function getWebhookEvents(): WebhookEvent[] {
  // Try to use localStorage if available
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const eventsJson = localStorage.getItem('webhookEvents') || '[]';
      return JSON.parse(eventsJson);
    } catch (error) {
      console.error('Error retrieving webhook events from localStorage:', error);
      return [...memoryStorage];
    }
  }
  
  // Return memory storage (server-side)
  return [...memoryStorage];
}

/**
 * Clear all stored webhook events
 */
export function clearWebhookEvents(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem('webhookEvents');
    } catch (error) {
      console.error('Error clearing webhook events from localStorage:', error);
    }
  }
  
  // Clear memory storage as well
  memoryStorage.length = 0;
}

/**
 * Generate a simple unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Get statistics about webhook events
 */
export function getWebhookStats() {
  const events = getWebhookEvents();
  
  // Count total events
  const total = events.length;
  
  // Count successful and failed events
  const successful = events.filter(e => e.status === 'success').length;
  const failed = total - successful;
  
  // Group by endpoint
  const byEndpoint: Record<string, number> = {};
  events.forEach(event => {
    byEndpoint[event.endpoint] = (byEndpoint[event.endpoint] || 0) + 1;
  });
  
  // Group by action
  const byAction: Record<string, number> = {};
  events.forEach(event => {
    byAction[event.action] = (byAction[event.action] || 0) + 1;
  });
  
  // Calculate success rate
  const successRate = total > 0 ? (successful / total) * 100 : 0;
  
  return {
    total,
    successful,
    failed,
    successRate,
    byEndpoint,
    byAction,
  };
}

/**
 * Filter webhook events by criteria
 */
export function filterWebhookEvents(filters: {
  endpoint?: string;
  action?: string;
  status?: 'success' | 'error';
  fromDate?: string;
  toDate?: string;
}): WebhookEvent[] {
  let events = getWebhookEvents();
  
  // Apply filters
  if (filters.endpoint) {
    events = events.filter(e => e.endpoint === filters.endpoint);
  }
  
  if (filters.action) {
    events = events.filter(e => e.action === filters.action);
  }
  
  if (filters.status) {
    events = events.filter(e => e.status === filters.status);
  }
  
  if (filters.fromDate) {
    const fromTime = new Date(filters.fromDate).getTime();
    events = events.filter(e => new Date(e.timestamp).getTime() >= fromTime);
  }
  
  if (filters.toDate) {
    const toTime = new Date(filters.toDate).getTime();
    events = events.filter(e => new Date(e.timestamp).getTime() <= toTime);
  }
  
  return events;
}