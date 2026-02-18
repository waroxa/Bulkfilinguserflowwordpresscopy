/**
 * Credits Management System - KV Store Implementation
 * 
 * Handles bulk filing credits with real-time data, admin controls,
 * and comprehensive audit history for compliance using KV store.
 */

import { projectId, publicAnonKey } from './supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-339e423c`;

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // Positive for additions, negative for usage
  type: 'earned' | 'used' | 'admin_adjustment' | 'refund' | 'bonus';
  description: string;
  relatedSubmissionId?: string;
  createdBy: string; // User ID or 'system' or 'admin'
  createdAt: string;
  metadata?: {
    adminName?: string;
    reason?: string;
    previousBalance?: number;
    newBalance?: number;
  };
}

export interface UserCredits {
  userId: string;
  availableCredits: number;
  totalEarned: number;
  totalUsed: number;
  lastUpdated: string;
}

/**
 * Get user's current credit balance from KV store
 */
export async function getUserCredits(userId: string): Promise<number> {
  try {
    const response = await fetch(`${SERVER_URL}/credits/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Error fetching user credits:', await response.text());
      return 0;
    }
    
    const data = await response.json();
    return data.availableCredits || 0;
  } catch (error) {
    console.error('Error in getUserCredits:', error);
    return 0;
  }
}

/**
 * Get user's credit transaction history from KV store
 */
export async function getCreditHistory(userId: string): Promise<CreditTransaction[]> {
  try {
    const response = await fetch(`${SERVER_URL}/credits/${userId}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Error fetching credit history:', await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('Error in getCreditHistory:', error);
    return [];
  }
}

/**
 * Add credits to a user (earned from bulk filing or admin adjustment)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: 'earned' | 'admin_adjustment' | 'refund' | 'bonus',
  description: string,
  metadata?: {
    adminName?: string;
    reason?: string;
    relatedSubmissionId?: string;
  }
): Promise<boolean> {
  try {
    const response = await fetch(`${SERVER_URL}/credits/${userId}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        type,
        description,
        metadata
      })
    });
    
    if (!response.ok) {
      console.error('Error adding credits:', await response.text());
      return false;
    }
    
    const result = await response.json();
    console.log(`✅ Added ${amount} credits to user ${userId}. New balance: ${result.newBalance}`);
    return true;
  } catch (error) {
    console.error('Error in addCredits:', error);
    return false;
  }
}

/**
 * Use credits (deduct from user balance)
 */
export async function useCredits(
  userId: string,
  amount: number,
  description: string,
  submissionId?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${SERVER_URL}/credits/${userId}/use`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        description,
        submissionId
      })
    });
    
    if (!response.ok) {
      console.error('Error using credits:', await response.text());
      return false;
    }
    
    const result = await response.json();
    console.log(`✅ Used ${amount} credits from user ${userId}. New balance: ${result.newBalance}`);
    return true;
  } catch (error) {
    console.error('Error in useCredits:', error);
    return false;
  }
}

/**
 * Admin function to adjust credits with reason and audit trail
 */
export async function adminAdjustCredits(
  userId: string,
  amount: number, // Can be positive or negative
  reason: string,
  adminName: string
): Promise<boolean> {
  try {
    console.log(`🔧 Admin ${adminName} adjusting credits for user ${userId} by ${amount}`);
    
    const response = await fetch(`${SERVER_URL}/credits/${userId}/admin-adjust`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        reason,
        adminName
      })
    });
    
    if (!response.ok) {
      console.error('Error adjusting credits:', await response.text());
      return false;
    }
    
    const result = await response.json();
    console.log(`✅ Admin adjusted credits. New balance: ${result.newBalance}`);
    return true;
  } catch (error) {
    console.error('Error in adminAdjustCredits:', error);
    return false;
  }
}

/**
 * Calculate credits earned from a bulk filing purchase
 */
export function calculateCreditsEarned(clientCount: number): number {
  // Bulk filings are sold in batches of 10
  // If user files 12 clients, they pay for 20 filings
  // They earn 8 credits (20 - 12 = 8)
  
  const batchSize = 10;
  const batchesNeeded = Math.ceil(clientCount / batchSize);
  const totalFilingsPurchased = batchesNeeded * batchSize;
  const creditsEarned = totalFilingsPurchased - clientCount;
  
  return creditsEarned;
}

/**
 * Calculate how many credits can be applied to a new filing
 */
export async function calculateCreditApplication(
  userId: string,
  clientCount: number
): Promise<{
  availableCredits: number;
  creditsToApply: number;
  remainingCredits: number;
  clientsAfterCredits: number;
  batchesNeeded: number;
  totalCost: number;
}> {
  const availableCredits = await getUserCredits(userId);
  const creditsToApply = Math.min(availableCredits, clientCount);
  const clientsAfterCredits = clientCount - creditsToApply;
  const remainingCredits = availableCredits - creditsToApply;
  
  const batchSize = 10;
  const batchesNeeded = Math.ceil(clientsAfterCredits / batchSize);
  const pricePerFiling = 398; // Base price
  const totalCost = batchesNeeded * batchSize * pricePerFiling;
  
  return {
    availableCredits,
    creditsToApply,
    remainingCredits,
    clientsAfterCredits,
    batchesNeeded,
    totalCost
  };
}
