/**
 * Wizard-specific types for the 6-step Bulk Filing Wizard
 * Re-exports base types from /types.ts and adds wizard-specific state
 */

export type { Client, CompanyApplicant, BeneficialOwner, FirmProfile } from '../../types';
import type { Client } from '../../types';

// ── Wizard step identifiers ──
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

// ── CSV Parse result row ──
export interface CSVRow {
  [header: string]: string;
}

// ── Exemption categories (from GHL select_exemption_category field) ──
export const EXEMPTION_CATEGORIES = [
  'Securities Reporting Issuer',
  'Governmental Authority',
  'Bank',
  'Credit Union',
  'Depository Institution Holding Company',
  'Money Services Business',
  'Broker or Dealer in Securities',
  'Securities Exchange or Clearing Agency',
  'Other Exchange Act Registered Entity',
  'Investment Company or Investment Adviser',
  'Venture Capital Fund Adviser',
  'Insurance Company',
  'State-Licensed Insurance Producer',
  'Commodity Exchange Act Registered Entity',
  'Accounting Firm',
  'Public Utility',
  'Financial Market Utility',
  'Pooled Investment Vehicle',
  'Tax-Exempt Entity',
  'Entity Assisting a Tax-Exempt Entity',
  'Large Operating Company',
  'Subsidiary of Certain Exempt Entities',
  'Inactive Entity',
] as const;

export type ExemptionCategory = (typeof EXEMPTION_CATEGORIES)[number];

// ── Attestation data ──
export interface AttestationData {
  signature: string;       // Base64 data URL from canvas
  fullName: string;
  initials: string;
  title: string;
  date: string;            // YYYY-MM-DD
}

// ── Batch submission progress ──
export interface SubmissionProgress {
  total: number;
  completed: number;
  failed: number;
  currentClient: string;
  status: 'idle' | 'submitting' | 'complete' | 'error';
  errors: Array<{ clientName: string; error: string }>;
  contactIds: string[];
}

// ── Full wizard state ──
export interface WizardState {
  step: WizardStep;
  clients: Client[];
  attestation: AttestationData | null;
  submissionProgress: SubmissionProgress;
  batchId: string;
  orderNumber: string;
  confirmationNumber: string;
}

// ── CSV header → Client field mapping ──
export const CSV_HEADER_MAP: Record<string, keyof Client | string> = {
  'LLC Legal Name': 'llcName',
  'NY DOS ID': 'nydosId',
  'EIN (12-3456789)': 'ein',
  'Formation Date (YYYY-MM-DD)': 'formationDate',
  'Country of Formation': 'countryOfFormation',
  'State (if USA)': 'stateOfFormation',
  'Contact Email': 'contactEmail',
  'Filing Type (disclosure/exemption)': 'filingType',
  'Entity Type (domestic/foreign)': 'entityType',
  'Exemption Category': 'exemptionCategory',
  'Exemption Explanation': 'exemptionExplanation',
  'Fictitious Name / DBA': 'fictitiousName',
  'Date Authority Filed in NY': 'dateAuthorityFiledNY',
  'Company Street Address': 'companyStreetAddress',
  'Company City': 'companyCity',
  'Company State': 'companyState',
  'Company Zip Code': 'companyZipCode',
  'Company Country': 'companyCountry',
};
