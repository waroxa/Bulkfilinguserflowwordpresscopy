/**
 * GoHighLevel API Key Management
 *
 * Priority order:
 *   1. In-memory cache (fastest)
 *   2. Vite build-time env vars (import.meta.env.VITE_HIGHLEVEL_API_KEY)
 *   3. Server endpoint /ghl/config (reads Supabase secrets via Deno.env)
 *
 * The API key is a Supabase Edge Function secret, so it is NOT available
 * as a Vite env var in this environment.  The server endpoint is the
 * primary source; the env-var branch is kept for local dev convenience.
 */

import { projectId, publicAnonKey } from './supabase/info';

interface ApiKeyConfig {
  apiKey: string;
  locationId: string;
}

let cachedApiKeys: ApiKeyConfig | null = null;

/**
 * Get an auth token to call the server. Tries Supabase session first,
 * falls back to the public anon key.
 */
async function getAuthToken(): Promise<string> {
  try {
    // Try to get the Supabase session from the singleton client
    const { supabase } = await import('./supabase/client');
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      return data.session.access_token;
    }
  } catch {
    // ignore – fall through
  }
  return publicAnonKey;
}

/**
 * Fetch GoHighLevel API keys
 */
export async function fetchGoHighLevelApiKeys(): Promise<ApiKeyConfig> {
  // 1. Return cached keys if available
  if (cachedApiKeys) {
    return cachedApiKeys;
  }

  // 2. Try Vite build-time env vars (works in local dev)
  try {
    const envApiKey = import.meta.env?.VITE_HIGHLEVEL_API_KEY || '';
    const envLocationId = import.meta.env?.VITE_HIGHLEVEL_LOCATION_ID || 'QWhUZ1cxgQgSMFYGloyK';

    if (envApiKey && envApiKey !== '') {
      console.log('Using GHL API keys from Vite env vars');
      cachedApiKeys = { apiKey: envApiKey, locationId: envLocationId };
      return cachedApiKeys;
    }
  } catch {
    // import.meta.env may not exist in all contexts
  }

  // 3. Fetch from the server endpoint (reads Supabase secrets)
  try {
    const token = await getAuthToken();
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-339e423c/ghl/config`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errText}`);
    }

    const data = await response.json();

    if (!data.apiKey) {
      throw new Error('Server returned empty GHL API key — check VITE_HIGHLEVEL_API_KEY Supabase secret');
    }

    cachedApiKeys = {
      apiKey: data.apiKey,
      locationId: data.locationId || 'QWhUZ1cxgQgSMFYGloyK'
    };
    console.log('Using GHL API keys from server /ghl/config');
    return cachedApiKeys;
  } catch (error) {
    console.error('Error fetching GoHighLevel API keys:', error);
    throw error;
  }
}

/**
 * Save GoHighLevel API keys to KV (admin tool)
 */
export async function saveGoHighLevelApiKeys(apiKey: string, locationId: string): Promise<void> {
  // Just update the cache; the canonical source is the Supabase secret
  cachedApiKeys = { apiKey, locationId };
}

/**
 * Clear cached API keys (force reload)
 */
export function clearApiKeyCache(): void {
  cachedApiKeys = null;
}
