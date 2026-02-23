import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Server endpoint base URL
// Edge function is deployed as 'make-server-339e423c'
export const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-339e423c`;