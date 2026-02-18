// Payment Tracking Module for NYLTA Bulk Filing System
// Tracks all payments, upgrades, and credits to prevent double-charging

import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

export interface PaymentRecord {
  id: string;
  userId: string;
  firmName: string;
  firmEIN: string;
  submissionNumber: string;
  serviceType: 'monitoring' | 'filing';
  clientCount: number;
  amountPaid: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'ach' | 'wire' | 'check' | 'credit_card';
  createdAt: string;
  paidAt?: string;
  upgradedFrom?: string; // Reference to original monitoring payment if this is an upgrade
  upgradedTo?: string; // Reference to filing payment if this was upgraded
  clients?: Array<{
    id: string;
    llcName: string;
    nydosId?: string;
    ein?: string;
    filingType?: 'disclosure' | 'exemption';
    exemptionCategory?: string;
  }>;
  metadata?: {
    ipAddress?: string;
    contactId?: string; // RewardLion contact ID
    originalAmount?: number; // For upgrades, what was the monitoring amount
    upgradeAmount?: number; // For upgrades, what was the additional amount paid
  };
}

/**
 * Create a new payment record
 */
export async function createPaymentRecord(payment: Omit<PaymentRecord, 'id' | 'createdAt'>): Promise<PaymentRecord> {
  const id = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const record: PaymentRecord = {
    ...payment,
    id,
    createdAt: new Date().toISOString(),
  };

  await kv.set(`payment:${id}`, record);
  await kv.set(`payment:submission:${payment.submissionNumber}`, id);
  await kv.set(`payment:user:${payment.userId}:${id}`, record);

  return record;
}

/**
 * Get payment record by ID
 */
export async function getPaymentRecord(paymentId: string): Promise<PaymentRecord | null> {
  return await kv.get<PaymentRecord>(`payment:${paymentId}`);
}

/**
 * Get payment record by submission number
 */
export async function getPaymentBySubmission(submissionNumber: string): Promise<PaymentRecord | null> {
  const paymentId = await kv.get<string>(`payment:submission:${submissionNumber}`);
  if (!paymentId) return null;
  return await kv.get<PaymentRecord>(`payment:${paymentId}`);
}

/**
 * Get all payment records for a user
 */
export async function getUserPayments(userId: string): Promise<PaymentRecord[]> {
  const payments = await kv.getByPrefix<PaymentRecord>(`payment:user:${userId}:`);
  return payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentRecord['paymentStatus'],
  paidAt?: string
): Promise<boolean> {
  const payment = await getPaymentRecord(paymentId);
  if (!payment) return false;

  payment.paymentStatus = status;
  if (paidAt) {
    payment.paidAt = paidAt;
  }

  await kv.set(`payment:${paymentId}`, payment);
  await kv.set(`payment:user:${payment.userId}:${paymentId}`, payment);

  return true;
}

/**
 * Create upgrade payment record (monitoring -> filing)
 * This links the original monitoring payment to the new filing payment
 */
export async function createUpgradePayment(
  originalPaymentId: string,
  newPaymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'upgradedFrom' | 'metadata'>
): Promise<PaymentRecord | null> {
  const originalPayment = await getPaymentRecord(originalPaymentId);
  if (!originalPayment) {
    console.error('❌ Original payment not found:', originalPaymentId);
    return null;
  }

  if (originalPayment.serviceType !== 'monitoring') {
    console.error('❌ Can only upgrade from monitoring service');
    return null;
  }

  if (originalPayment.upgradedTo) {
    console.error('❌ Payment already upgraded to:', originalPayment.upgradedTo);
    return null;
  }

  // Calculate upgrade amount
  const monitoringPerClient = 249;
  const filingPerClient = 398;
  const upgradePerClient = filingPerClient - monitoringPerClient; // $149
  const expectedUpgradeAmount = upgradePerClient * originalPayment.clientCount;

  // Create new filing payment
  const upgradeId = `PAY-UPG-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const upgradePayment: PaymentRecord = {
    ...newPaymentData,
    id: upgradeId,
    createdAt: new Date().toISOString(),
    serviceType: 'filing',
    upgradedFrom: originalPaymentId,
    metadata: {
      ...newPaymentData.metadata,
      originalAmount: originalPayment.amountPaid,
      upgradeAmount: expectedUpgradeAmount,
    },
  };

  // Update original payment to mark it as upgraded
  originalPayment.upgradedTo = upgradeId;
  await kv.set(`payment:${originalPaymentId}`, originalPayment);
  await kv.set(`payment:user:${originalPayment.userId}:${originalPaymentId}`, originalPayment);

  // Save upgrade payment
  await kv.set(`payment:${upgradeId}`, upgradePayment);
  await kv.set(`payment:submission:${upgradePayment.submissionNumber}`, upgradeId);
  await kv.set(`payment:user:${upgradePayment.userId}:${upgradeId}`, upgradePayment);

  console.log(`✅ Created upgrade payment: ${upgradeId} from ${originalPaymentId}`);
  console.log(`   Original: $${originalPayment.amountPaid} (monitoring)`);
  console.log(`   Upgrade: $${expectedUpgradeAmount} (to filing)`);
  console.log(`   Total: $${originalPayment.amountPaid + expectedUpgradeAmount} (${originalPayment.clientCount} clients @ $398)`);

  return upgradePayment;
}

/**
 * Check if a submission has been paid
 */
export async function isSubmissionPaid(submissionNumber: string): Promise<boolean> {
  const payment = await getPaymentBySubmission(submissionNumber);
  return payment !== null && payment.paymentStatus === 'paid';
}

/**
 * Get payment history for a submission (including upgrades)
 */
export async function getSubmissionPaymentHistory(submissionNumber: string): Promise<PaymentRecord[]> {
  const payment = await getPaymentBySubmission(submissionNumber);
  if (!payment) return [];

  const history: PaymentRecord[] = [payment];

  // If this payment was upgraded from another, get the original
  if (payment.upgradedFrom) {
    const original = await getPaymentRecord(payment.upgradedFrom);
    if (original) {
      history.unshift(original);
    }
  }

  // If this payment was upgraded to another, get the upgrade
  if (payment.upgradedTo) {
    const upgrade = await getPaymentRecord(payment.upgradedTo);
    if (upgrade) {
      history.push(upgrade);
    }
  }

  return history;
}

/**
 * Calculate total amount paid for a submission (including upgrades)
 */
export async function getTotalAmountPaid(submissionNumber: string): Promise<number> {
  const history = await getSubmissionPaymentHistory(submissionNumber);
  return history
    .filter(p => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + p.amountPaid, 0);
}