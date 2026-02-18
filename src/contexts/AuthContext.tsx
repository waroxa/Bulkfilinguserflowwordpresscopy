import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { createHighLevelContact, parseFullName } from '../utils/highlevel';
import type { Session, User } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Define server URL - use Supabase Edge Function endpoint
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2c01e603`;

interface AccountData {
  userId: string;
  email: string;
  firmName: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'cpa' | 'attorney' | 'compliance' | 'processor' | 'admin';
  country?: string;
  professionalType?: string;
  smsConsent?: boolean;
  emailMarketingConsent?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  isFirstLogin: boolean;
  firmProfileCompleted: boolean;
  workers?: any[];
  createdAt: string;
  updatedAt: string;
  // Computed property
  contactName?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  account: AccountData | null;
  loading: boolean;
  signUp: (
    email: string, 
    password: string, 
    firmName: string, 
    firstName: string,
    lastName: string,
    phone: string, 
    role: string,
    country?: string,
    professionalType?: string,
    smsConsent?: boolean,
    emailMarketingConsent?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateAccount: (updates: Partial<AccountData>) => Promise<{ success: boolean; error?: string }>;
  refreshAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch account data from backend
  const fetchAccount = async (accessToken: string) => {
    if (!accessToken) {
      // No access token means user is not logged in - this is normal, not an error
      return;
    }
    
    try {
      const response = await fetch(`${SERVER_URL}/account`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Add computed contactName property
        const accountWithContactName = {
          ...data.account,
          contactName: `${data.account.firstName || ''} ${data.account.lastName || ''}`.trim()
        };
        setAccount(accountWithContactName);
      } else if (response.status === 404) {
        // Account was deleted by admin - sign out the user
        console.log('Account not found (may have been deleted by admin). Signing out...');
        await supabase.auth.signOut();
        setAccount(null);
        setSession(null);
        setUser(null);
      } else {
        // Only log actual errors (not 401 or 503 which are expected for logged out users or unavailable service)
        if (response.status !== 401 && response.status !== 503) {
          console.error('Failed to fetch account data:', response.status);
        }
        setAccount(null);
      }
    } catch (error) {
      // Silently handle fetch errors - this can happen when:
      // 1. Server is not available (expected in development without backend)
      // 2. Network issues
      // 3. CORS issues
      // We don't want to spam the console with errors for expected scenarios
      setAccount(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.access_token) {
        fetchAccount(session.access_token).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.access_token) {
        fetchAccount(session.access_token);
      } else {
        setAccount(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    firmName: string,
    firstName: string,
    lastName: string,
    phone: string,
    role: string,
    country?: string,
    professionalType?: string,
    smsConsent?: boolean,
    emailMarketingConsent?: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Attempting signup with:', { email, firmName, firstName, lastName, role });
      console.log('Server URL:', SERVER_URL);
      
      // Try to create HighLevel contact FIRST before backend signup
      let highLevelContactId: string | null = null;
      let highLevelTags: string[] = [];
      let highLevelSyncStatus: 'success' | 'failed' | 'pending' = 'pending';
      let highLevelSyncError: string | null = null;
      
      try {
        console.log('🔄 Creating HighLevel contact before signup...');
        highLevelContactId = await createHighLevelContact({
          firstName,
          lastName,
          email,
          phone,
          companyName: firmName,  // Top-level field, not customField
          country: country || 'US',  // Top-level field, not customField
          tags: ['bulk_status_pending_approval', `role_${role.toLowerCase()}`],
          customFields: {
            account_type: 'Bulk Filing',
            account_status: 'Pending',
            professional_type: professionalType || role,
            sms_consent: smsConsent || false,  // Pass boolean, function will convert to "Yes"/"No"
            email_marketing_consent: emailMarketingConsent || false,  // Pass boolean
            firm_profile_completed: false  // Pass boolean, function will convert to "false" string
          }
        });
        
        if (highLevelContactId) {
          console.log('✅ HighLevel contact created:', highLevelContactId);
          highLevelTags = ['bulk_status_pending_approval', `role_${role.toLowerCase()}`];
          highLevelSyncStatus = 'success';
        } else {
          console.warn('⚠️ HighLevel contact creation returned null');
          highLevelSyncStatus = 'failed';
          highLevelSyncError = 'Contact creation returned null';
        }
      } catch (hlError) {
        console.warn('⚠️ HighLevel contact creation failed (non-critical):', hlError);
        highLevelSyncStatus = 'failed';
        highLevelSyncError = hlError instanceof Error ? hlError.message : 'Unknown error';
      }
      
      const response = await fetch(`${SERVER_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email,
          password,
          firmName,
          firstName,
          lastName,
          phone,
          role,
          country,
          professionalType,
          smsConsent,
          emailMarketingConsent,
          // Include HighLevel tracking data
          highLevelContactId,
          highLevelTags,
          highLevelSyncStatus,
          highLevelSyncError
        }),
      });

      console.log('Signup response status:', response.status);
      console.log('Signup response headers:', response.headers);
      
      // Try to parse response as JSON
      let data;
      try {
        data = await response.json();
        console.log('Signup response data:', data);
      } catch (parseError) {
        console.error('Failed to parse signup response as JSON:', parseError);
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        return { success: false, error: `Server returned invalid response (status ${response.status})` };
      }

      if (response.ok && data.success) {
        return { success: true };
      } else {
        const errorMessage = data.error || `Sign up failed with status ${response.status}`;
        console.error('Signup failed:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: `Network error: ${error instanceof Error ? error.message : 'Unable to connect to server'}` };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Return the actual Supabase error message (e.g., "Invalid login credentials")
        console.log('Sign in error from Supabase:', error.message);
        return { success: false, error: error.message };
      }

      // Fetch account data after successful login
      if (data.session?.access_token) {
        // Fetch account data to check status
        const response = await fetch(`${SERVER_URL}/account`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
          },
        });

        if (response.ok) {
          const accountData = await response.json();
          const userAccount = accountData.account;
          
          // Check if account is approved
          if (userAccount.status === 'pending') {
            // Sign out the user
            await supabase.auth.signOut();
            return { 
              success: false, 
              error: 'Your account is pending approval. Our team will review your application and notify you via email within 48 hours.' 
            };
          }
          
          if (userAccount.status === 'rejected') {
            // Sign out the user
            await supabase.auth.signOut();
            return { 
              success: false, 
              error: 'Your account application was not approved. Please contact support for more information.' 
            };
          }
          
          // Account is approved - set it
          const accountWithContactName = {
            ...userAccount,
            contactName: `${userAccount.firstName || ''} ${userAccount.lastName || ''}`.trim()
          };
          setAccount(accountWithContactName);
        } else if (response.status === 404) {
          // Account was deleted - sign out and provide clear message
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: 'This account no longer exists. Please contact support or create a new account.' 
          };
        } else {
          // Could not fetch account data - other error
          await supabase.auth.signOut();
          return { success: false, error: 'Unable to verify account status. Please try again.' };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setAccount(null);
    
    // Clear session storage
    sessionStorage.clear();
  };

  const updateAccount = async (updates: Partial<AccountData>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!session?.access_token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch(`${SERVER_URL}/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const accountWithContactName = {
          ...data.account,
          contactName: `${data.account.firstName || ''} ${data.account.lastName || ''}`.trim()
        };
        setAccount(accountWithContactName);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Update failed' };
      }
    } catch (error) {
      console.error('Update account error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const refreshAccount = async () => {
    if (session?.access_token) {
      await fetchAccount(session.access_token);
    }
  };

  const value = {
    session,
    user,
    account,
    loading,
    signUp,
    signIn,
    signOut,
    updateAccount,
    refreshAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}