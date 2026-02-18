// Type definitions for NYLTA Bulk Filing Application

export interface CompanyApplicant {
  id: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  titleOrRole?: string;
  dob: string;
  address: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  idType: string;
  idNumber: string;
  idExpirationDate?: string;
  issuingCountry: string;
  issuingState: string;
  role: string;
  isSameAsBeneficialOwner?: boolean;
}

export interface BeneficialOwner {
  id: string;
  fullName: string;
  dob: string;
  address: string;
  addressLine1?: string;
  addressLine2?: string;
  addressType?: "Residential" | "Business";
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  ssn?: string;
  idType?: string;
  idNumber?: string;
  idExpirationDate?: string;
  issuingCountry?: string;
  issuingState?: string;
  ownership?: number;
  ownershipPercentage?: string;
  position?: string;
  isControlPerson?: boolean;
  isOrganizer?: boolean;
}

export interface Client {
  id: string;
  llcName: string;
  fictitiousName?: string; // DBA (Doing Business As)
  nydosId?: string;
  ein?: string;
  dateAuthorityFiledNY?: string;
  countryOfFormation: string;
  stateOfFormation?: string;
  entityType?: "domestic" | "foreign";
  filingType?: "disclosure" | "exemption";
  companyStreetAddress?: string;
  companyCity?: string;
  companyState?: string;
  companyZipCode?: string;
  companyCountry?: string;
  serviceType?: "monitoring" | "filing";
  companyApplicants?: CompanyApplicant[];
  beneficialOwners?: BeneficialOwner[];
  exemptionCategory?: string;
  exemptionReason?: string;
  attestationSignature?: string;
  attestationDate?: string;
  attestationName?: string;
  fee?: number;
  discountApplied?: boolean;
  finalPrice?: number;
}

export interface FirmProfile {
  id?: string;
  firmName: string;
  ein: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  isComplete?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirmWorker {
  id: string;
  fullName: string;
  email: string;
  title: string;
  phone?: string;
}

export interface PaymentData {
  agreementData?: any;
  payment?: {
    transaction_id?: string;
    amount?: number;
    method?: string;
  };
}

export interface ConfirmationData extends PaymentData {
  clients: Client[];
  firmInfo: FirmProfile | null;
  timestamp: string;
}