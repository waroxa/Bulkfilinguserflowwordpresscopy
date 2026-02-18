/**
 * Payment Approval System
 * 
 * Allows admins to approve/reject payments and automatically:
 * - Update submission status in database
 * - Send tags to RewardLion CRM
 * - Trigger workflows
 * - Award/refund credits
 */

import { supabase } from './supabase/client';
import { addHighLevelTags, addHighLevelNote, searchHighLevelContactByEmail } from './highlevel';
import { addCredits, calculateCreditsEarned } from './credits';

export interface PaymentApprovalResult {
  success: boolean;
  message: string;
  newStatus?: string;
  rewardLionTagged?: boolean;
  creditsAwarded?: number;
}

/**
 * Approve a payment - mark as Paid and trigger workflows
 */
export async function approvePayment(
  submissionId: string,
  adminName: string,
  firmEmail: string,
  clientCount: number,
  confirmationNumber: string
): Promise<PaymentApprovalResult> {
  try {
    console.log(`💰 Admin ${adminName} approving payment for submission ${submissionId}`);
    
    // 1. Update submission status to Paid
    const { error: updateError } = await supabase
      .from('bulk_filing_submissions')
      .update({
        status: 'Paid',
        payment_approved_at: new Date().toISOString(),
        payment_approved_by: adminName,
        last_activity: new Date().toISOString()
      })
      .eq('id', submissionId);
    
    if (updateError) {
      console.error('❌ Error updating submission status:', updateError);
      return {
        success: false,
        message: `Failed to update submission: ${updateError.message}`
      };
    }
    
    // 2. Calculate and award credits
    const creditsEarned = calculateCreditsEarned(clientCount);
    let creditsAwarded = 0;
    
    if (creditsEarned > 0) {
      // Get user ID from submission
      const { data: submission } = await supabase
        .from('bulk_filing_submissions')
        .select('user_id')
        .eq('id', submissionId)
        .single();
      
      if (submission?.user_id) {
        const creditSuccess = await addCredits(
          submission.user_id,
          creditsEarned,
          'earned',
          `Credits earned from bulk filing #${confirmationNumber}`,
          { relatedSubmissionId: submissionId }
        );
        
        if (creditSuccess) {
          creditsAwarded = creditsEarned;
          console.log(`✅ Awarded ${creditsEarned} credits to user ${submission.user_id}`);
        }
      }
    }
    
    // 3. Tag contact in RewardLion
    let rewardLionTagged = false;
    try {
      console.log(`🔍 Searching for RewardLion contact: ${firmEmail}`);
      const contactId = await searchHighLevelContactByEmail(firmEmail);
      
      if (contactId) {
        // Add tags: payment_approved, bulk_filing_paid
        const tagSuccess = await addHighLevelTags(contactId, [
          'payment_approved',
          'bulk_filing_paid',
          `submission_${confirmationNumber}`
        ]);
        
        if (tagSuccess) {
          console.log('✅ RewardLion contact tagged successfully');
          rewardLionTagged = true;
          
          // Add note to contact history
          const note = `Payment approved by ${adminName} on ${new Date().toLocaleString()}\\nSubmission: ${confirmationNumber}\\nClients: ${clientCount}\\nCredits Earned: ${creditsEarned}`;
          await addHighLevelNote(contactId, note);
        }
      } else {
        console.warn(`⚠️ No RewardLion contact found for ${firmEmail}`);
      }
    } catch (rewardLionError) {
      console.warn('⚠️ RewardLion tagging failed (non-critical):', rewardLionError);
    }
    
    return {
      success: true,
      message: `Payment approved successfully. ${creditsAwarded > 0 ? `${creditsAwarded} credits awarded.` : ''}`,
      newStatus: 'Paid',
      rewardLionTagged,
      creditsAwarded
    };
    
  } catch (error) {
    console.error('❌ Error in approvePayment:', error);
    return {
      success: false,
      message: `Error approving payment: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Reject/Fail a payment
 */
export async function rejectPayment(
  submissionId: string,
  adminName: string,
  firmEmail: string,
  reason: string,
  confirmationNumber: string
): Promise<PaymentApprovalResult> {
  try {
    console.log(`❌ Admin ${adminName} rejecting payment for submission ${submissionId}`);
    
    // 1. Update submission status to Failed
    const { error: updateError } = await supabase
      .from('bulk_filing_submissions')
      .update({
        status: 'Failed',
        payment_rejection_reason: reason,
        payment_rejected_at: new Date().toISOString(),
        payment_rejected_by: adminName,
        last_activity: new Date().toISOString()
      })
      .eq('id', submissionId);
    
    if (updateError) {
      console.error('❌ Error updating submission status:', updateError);
      return {
        success: false,
        message: `Failed to update submission: ${updateError.message}`
      };
    }
    
    // 2. Tag contact in RewardLion
    let rewardLionTagged = false;
    try {
      console.log(`🔍 Searching for RewardLion contact: ${firmEmail}`);
      const contactId = await searchHighLevelContactByEmail(firmEmail);
      
      if (contactId) {
        // Add tags: payment_failed, payment_issue
        const tagSuccess = await addHighLevelTags(contactId, [
          'payment_failed',
          'payment_issue',
          `submission_${confirmationNumber}_failed`
        ]);
        
        if (tagSuccess) {
          console.log('✅ RewardLion contact tagged successfully');
          rewardLionTagged = true;
          
          // Add note to contact history
          const note = `Payment rejected by ${adminName} on ${new Date().toLocaleString()}\\nSubmission: ${confirmationNumber}\\nReason: ${reason}`;
          await addHighLevelNote(contactId, note);
        }
      } else {
        console.warn(`⚠️ No RewardLion contact found for ${firmEmail}`);
      }
    } catch (rewardLionError) {
      console.warn('⚠️ RewardLion tagging failed (non-critical):', rewardLionError);
    }
    
    return {
      success: true,
      message: `Payment rejected: ${reason}`,
      newStatus: 'Failed',
      rewardLionTagged
    };
    
  } catch (error) {
    console.error('❌ Error in rejectPayment:', error);
    return {
      success: false,
      message: `Error rejecting payment: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Mark payment as processing (pending manual review)
 */
export async function markPaymentProcessing(
  submissionId: string,
  adminName: string,
  firmEmail: string,
  notes: string,
  confirmationNumber: string
): Promise<PaymentApprovalResult> {
  try {
    console.log(`⏳ Admin ${adminName} marking payment as processing for submission ${submissionId}`);
    
    // 1. Update submission status to Processing
    const { error: updateError } = await supabase
      .from('bulk_filing_submissions')
      .update({
        status: 'Processing',
        processing_notes: notes,
        marked_processing_at: new Date().toISOString(),
        marked_processing_by: adminName,
        last_activity: new Date().toISOString()
      })
      .eq('id', submissionId);
    
    if (updateError) {
      console.error('❌ Error updating submission status:', updateError);
      return {
        success: false,
        message: `Failed to update submission: ${updateError.message}`
      };
    }
    
    // 2. Tag contact in RewardLion
    let rewardLionTagged = false;
    try {
      const contactId = await searchHighLevelContactByEmail(firmEmail);
      
      if (contactId) {
        const tagSuccess = await addHighLevelTags(contactId, [
          'payment_processing',
          'manual_review_required'
        ]);
        
        if (tagSuccess) {
          rewardLionTagged = true;
          const note = `Payment marked as processing by ${adminName}\\nSubmission: ${confirmationNumber}\\nNotes: ${notes}`;
          await addHighLevelNote(contactId, note);
        }
      }
    } catch (rewardLionError) {
      console.warn('⚠️ RewardLion tagging failed (non-critical):', rewardLionError);
    }
    
    return {
      success: true,
      message: 'Payment marked as processing',
      newStatus: 'Processing',
      rewardLionTagged
    };
    
  } catch (error) {
    console.error('❌ Error in markPaymentProcessing:', error);
    return {
      success: false,
      message: `Error marking payment as processing: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}