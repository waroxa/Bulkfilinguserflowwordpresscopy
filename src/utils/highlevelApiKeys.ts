/**
 * GoHighLevel API Key Management
 * Fetches API keys from database instead of environment variables
 */

import { projectId } from './supabase/info';

interface ApiKeyConfig {
  apiKey: string;
  locationId: string;
}

let cachedApiKeys: ApiKeyConfig | null = null;

/**
 * Fetch GoHighLevel API keys from database
 */
export async function fetchGoHighLevelApiKeys(): Promise<ApiKeyConfig> {
  // Return cached keys if available
  if (cachedApiKeys) {
    return cachedApiKeys;
  }

  try {
    // First try environment variables (like the working tool does)
    const envApiKey = typeof import.meta.env !== 'undefined' ? (import.meta.env.VITE_HIGHLEVEL_API_KEY || '') : '';
    const envLocationId = typeof import.meta.env !== 'undefined' ? (import.meta.env.VITE_HIGHLEVEL_LOCATION_ID || 'fXXJzwVf8OtANDf2M4VP') : 'fXXJzwVf8OtANDf2M4VP';
    
    if (envApiKey && envApiKey !== '') {
      console.log('✅ Using API keys from environment variables');
      cachedApiKeys = {
        apiKey: envApiKey,
        locationId: envLocationId
      };
      return cachedApiKeys;
    }

    // Fallback to database fetch
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-339e423c/kv/get`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'highlevel_config'
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch API keys from database');
    }

    const data = await response.json();
    
    if (!data.value) {
      throw new Error('GoHighLevel API keys not configured in database');
    }

    const config = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
    
    cachedApiKeys = {
      apiKey: config.apiKey || config.VITE_HIGHLEVEL_API_KEY || '',
      locationId: config.locationId || config.VITE_HIGHLEVEL_LOCATION_ID || 'fXXJzwVf8OtANDf2M4VP'
    };

    return cachedApiKeys;
  } catch (error) {
    console.error('Error fetching GoHighLevel API keys:', error);
    throw error;
  }
}

/**
 * Save GoHighLevel API keys to database
 */
export async function saveGoHighLevelApiKeys(apiKey: string, locationId: string): Promise<void> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603/kv/set`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'highlevel_config',
          value: JSON.stringify({
            apiKey,
            locationId,
            updatedAt: new Date().toISOString()
          })
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save API keys to database');
    }

    // Update cache
    cachedApiKeys = { apiKey, locationId };
  } catch (error) {
    console.error('Error saving GoHighLevel API keys:', error);
    throw error;
  }
}

/**
 * Clear cached API keys (force reload from database)
 */
export function clearApiKeyCache(): void {
  cachedApiKeys = null;
}