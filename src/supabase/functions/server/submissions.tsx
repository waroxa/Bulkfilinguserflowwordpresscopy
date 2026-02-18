/**
 * SUBMISSION TRACKING MODULE
 * Handles monitoring and filing submissions with upgrade tracking
 * CRITICAL: Prevents double-charging for upgrades
 */

import * as kv from './kv_store.tsx';

export interface SubmissionRecord {
  // Basic Info
  submissionNumber: string;
  userId: string;
  firmName: string;
  firmEIN: string;
  
  // Service Details
  serviceType: 'monitoring' | 'filing';
  clientCount: number;
  
  // Status
  submittedDate: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Payment
  amountPaid: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId: string; // Links to payment:xxx
  
  // Client Data
  clients: Array<{
    id: string;
    llcName: string;
    nydosId?: string;
    ein?: string;
    formationDate?: string;
    countryOfFormation?: string;
    stateOfFormation?: string;
    contactEmail?: string;
    filingType?: 'disclosure' | 'exemption';
    serviceType?: 'monitoring' | 'filing';
    entityType?: 'domestic' | 'foreign';
    exemptionCategory?: string;
    exemptionExplanation?: string;
    companyApplicants?: any[];
    beneficialOwners?: any[];
  }>;
  
  // ⭐ UPGRADE TRACKING (CRITICAL FOR ZERO DOUBLE-CHARGING)
  isUpgradeable: boolean; // true ONLY for monitoring that hasn't been upgraded
  upgradedToSubmissionNumber: string | null; // Set when monitoring is upgraded to filing
  originalMonitoringSubmission: string | null; // Set on filing if it came from upgrade
  upgradePaymentId: string | null; // Payment record for the upgrade transaction
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Metadata
  metadata?: {
    ipAddress?: string;
    contactId?: string; // HighLevel/RewardLion contact ID
    assignedTo?: string; // Employee userId if assigned
    assignedAt?: string;
  };
}

/**
 * Generate unique submission number
 */
function generateSubmissionNumber(serviceType: 'monitoring' | 'filing'): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const prefix = serviceType === 'monitoring' ? 'MON' : 'FIL';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return `NYLTA-${year}${month}${day}-${prefix}-${random}`;
}

/**
 * Create a new submission record (monitoring or filing)
 */
export async function createSubmission(
  data: Omit<SubmissionRecord, 'submissionNumber' | 'createdAt' | 'updatedAt' | 'isUpgradeable' | 'upgradedToSubmissionNumber' | 'originalMonitoringSubmission' | 'upgradePaymentId'>
): Promise<SubmissionRecord> {
  
  const submissionNumber = generateSubmissionNumber(data.serviceType);
  const timestamp = new Date().toISOString();
  
  const submission: SubmissionRecord = {
    ...data,
    submissionNumber,
    isUpgradeable: data.serviceType === 'monitoring', // Only monitoring can be upgraded
    upgradedToSubmissionNumber: null,
    originalMonitoringSubmission: null,
    upgradePaymentId: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  // Save to KV store with multiple indexes
  await kv.set(`submission:${submissionNumber}`, submission);
  await kv.set(`submission:user:${data.userId}:${submissionNumber}`, submission);
  
  // If monitoring, add to upgradeable index
  if (data.serviceType === 'monitoring' && data.paymentStatus === 'paid') {
    await addToUpgradeableIndex(data.userId, submission);
  }
  
  console.log(`✅ Created ${data.serviceType} submission: ${submissionNumber}`);
  
  return submission;
}

/**
 * Get submission by submission number
 */
export async function getSubmission(submissionNumber: string): Promise<SubmissionRecord | null> {
  return await kv.get<SubmissionRecord>(`submission:${submissionNumber}`);
}

/**
 * Get all submissions for a user
 */
export async function getUserSubmissions(userId: string): Promise<SubmissionRecord[]> {
  const submissions = await kv.getByPrefix<SubmissionRecord>(`submission:user:${userId}:`);
  return submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Get monitoring submissions that can be upgraded
 */
export async function getUpgradeableSubmissions(userId: string): Promise<SubmissionRecord[]> {
  const index = await kv.get<{ submissions: any[] }>(`monitoring_upgradeable:${userId}`);
  if (!index) return [];
  
  // Filter out already upgraded
  const upgradeableList = index.submissions.filter(s => !s.isUpgraded);
  
  // Get full submission records
  const fullRecords = await Promise.all(
    upgradeableList.map(s => getSubmission(s.submissionNumber))
  );
  
  return fullRecords.filter(s => s !== null) as SubmissionRecord[];
}

/**
 * Add monitoring submission to upgradeable index
 */
async function addToUpgradeableIndex(userId: string, submission: SubmissionRecord) {
  const key = `monitoring_upgradeable:${userId}`;
  const existing = await kv.get<{ submissions: any[] }>(key) || { submissions: [] };
  
  existing.submissions.push({
    submissionNumber: submission.submissionNumber,
    firmName: submission.firmName,
    clientCount: submission.clientCount,
    submittedDate: submission.submittedDate,
    amountPaid: submission.amountPaid,
    isUpgraded: false
  });
  
  await kv.set(key, existing);
}

/**
 * Upgrade monitoring submission to filing
 * Returns the new filing submission
 */
export async function upgradeToFiling(
  monitoringSubmissionNumber: string,
  upgradePaymentId: string
): Promise<SubmissionRecord | null> {
  
  // Get original monitoring submission
  const monitoring = await getSubmission(monitoringSubmissionNumber);
  if (!monitoring) {
    console.error(`❌ Monitoring submission not found: ${monitoringSubmissionNumber}`);
    return null;
  }
  
  // Verify it can be upgraded
  if (monitoring.serviceType !== 'monitoring') {
    console.error(`❌ Submission is not monitoring type: ${monitoringSubmissionNumber}`);
    return null;
  }
  
  if (!monitoring.isUpgradeable) {
    console.error(`❌ Submission is not upgradeable: ${monitoringSubmissionNumber}`);
    return null;
  }
  
  if (monitoring.upgradedToSubmissionNumber) {
    console.error(`❌ Submission already upgraded: ${monitoringSubmissionNumber}`);
    return null;
  }
  
  // Create new filing submission
  const filingSubmissionNumber = generateSubmissionNumber('filing');
  const timestamp = new Date().toISOString();
  
  const filing: SubmissionRecord = {
    ...monitoring,
    submissionNumber: filingSubmissionNumber,
    serviceType: 'filing',
    amountPaid: 398, // Total amount (monitoring $249 + upgrade $149)
    status: 'pending', // Ready for NYDOS filing
    isUpgradeable: false, // Filing cannot be upgraded
    upgradedToSubmissionNumber: null,
    originalMonitoringSubmission: monitoringSubmissionNumber, // ⭐ LINK BACK
    upgradePaymentId, // Link to upgrade payment
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  // Save filing submission
  await kv.set(`submission:${filingSubmissionNumber}`, filing);
  await kv.set(`submission:user:${filing.userId}:${filingSubmissionNumber}`, filing);
  
  // Update monitoring submission
  monitoring.isUpgradeable = false; // ⭐ NO LONGER UPGRADEABLE
  monitoring.upgradedToSubmissionNumber = filingSubmissionNumber; // ⭐ LINK TO FILING
  monitoring.updatedAt = timestamp;
  
  await kv.set(`submission:${monitoringSubmissionNumber}`, monitoring);
  await kv.set(`submission:user:${monitoring.userId}:${monitoringSubmissionNumber}`, monitoring);
  
  // Update upgradeable index
  const indexKey = `monitoring_upgradeable:${monitoring.userId}`;
  const index = await kv.get<{ submissions: any[] }>(indexKey);
  if (index) {
    const submissionIndex = index.submissions.findIndex(s => s.submissionNumber === monitoringSubmissionNumber);
    if (submissionIndex !== -1) {
      index.submissions[submissionIndex].isUpgraded = true; // ⭐ MARK AS UPGRADED
      index.submissions[submissionIndex].upgradedToSubmissionNumber = filingSubmissionNumber;
      await kv.set(indexKey, index);
    }
  }
  
  console.log(`✅ Upgraded monitoring ${monitoringSubmissionNumber} to filing ${filingSubmissionNumber}`);
  
  return filing;
}

/**
 * Update submission status
 */
export async function updateSubmissionStatus(
  submissionNumber: string,
  status: SubmissionRecord['status']
): Promise<boolean> {
  const submission = await getSubmission(submissionNumber);
  if (!submission) return false;
  
  submission.status = status;
  submission.updatedAt = new Date().toISOString();
  
  await kv.set(`submission:${submissionNumber}`, submission);
  await kv.set(`submission:user:${submission.userId}:${submissionNumber}`, submission);
  
  return true;
}

/**
 * Update payment status for a submission
 */
export async function updateSubmissionPaymentStatus(
  submissionNumber: string,
  paymentStatus: SubmissionRecord['paymentStatus']
): Promise<boolean> {
  const submission = await getSubmission(submissionNumber);
  if (!submission) return false;
  
  submission.paymentStatus = paymentStatus;
  submission.updatedAt = new Date().toISOString();
  
  await kv.set(`submission:${submissionNumber}`, submission);
  await kv.set(`submission:user:${submission.userId}:${submissionNumber}`, submission);
  
  return true;
}

/**
 * Assign submission to employee
 */
export async function assignSubmissionToEmployee(
  submissionNumber: string,
  employeeId: string
): Promise<boolean> {
  const submission = await getSubmission(submissionNumber);
  if (!submission) return false;
  
  if (!submission.metadata) {
    submission.metadata = {};
  }
  
  submission.metadata.assignedTo = employeeId;
  submission.metadata.assignedAt = new Date().toISOString();
  submission.updatedAt = new Date().toISOString();
  
  await kv.set(`submission:${submissionNumber}`, submission);
  await kv.set(`submission:user:${submission.userId}:${submissionNumber}`, submission);
  
  return true;
}
