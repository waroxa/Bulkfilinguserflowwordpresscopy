import { useState } from "react";
import Papa from "papaparse";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Upload, FileSpreadsheet, Plus, Trash2, Download, AlertTriangle, Info } from "lucide-react";
import { Client } from "../App";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DatePicker } from "./DatePicker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import UploadLoadingScreen from "./UploadLoadingScreen";

export interface FirmWorker {
  id: string;
  fullName: string;
  email: string;
  title: string;
}

interface Step2ClientUploadProps {
  onComplete: (clients: Client[]) => void;
  onBack: () => void;
  initialClients: Client[];
  firmWorkers?: FirmWorker[];
}

export default function Step2ClientUpload({ onComplete, onBack, initialClients, firmWorkers = [] }: Step2ClientUploadProps) {
  // Step 1: Upload Client List (CSV or Manual Entry)
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [einStatus, setEinStatus] = useState<string>("have-ein");
  const [manualEntry, setManualEntry] = useState<Partial<Client>>({
    llcName: "",
    fictitiousName: "",
    nydosId: "",
    ein: "",
    formationDate: "",
    countryOfFormation: "United States",
    stateOfFormation: "",
    dateAuthorityFiledNY: "", // Date foreign LLC filed Application for Authority in NY
    zipCode: "",
    contactEmail: "",
    filingType: "disclosure", // Default to disclosure
    // Company Address fields
    streetAddress: "",
    city: "",
    addressCountry: "United States",
    addressState: "",
    addressZipCode: ""
  });

  const parseClientData = (data: any[][]): { clients: Client[], incomplete: number } => {
    const newClients: Client[] = [];
    let incomplete = 0;
    
    // Skip header row (index 0) and parse data rows
    for (let i = 1; i < data.length; i++) {
      const values = data[i].map(v => String(v || '').trim());
      
      if (values.length >= 9 && values[0]) { // Must have at least basic fields and LLC name
        // UPDATED: Column 9 is now filing_type (disclosure/exemption) instead of Filing Status (Exempt/Non-Exempt)
        const filingType = values[9]?.toLowerCase() === "exemption" ? "exemption" : "disclosure";
        
        // AUTO-DETECT: Determine entity type based on country of formation
        const countryOfFormation = values[5] || "United States";
        const entityType = countryOfFormation === "United States" ? "domestic" : "foreign";
        
        // GET SERVICE LEVEL from CSV (Column K / values[10])
        // FOREIGN entities MUST file (no choice)
        // DOMESTIC entities can choose "monitoring" or "filing" - default to "monitoring"
        const csvServiceLevel = values[10]?.toLowerCase().trim();
        let serviceType: "monitoring" | "filing";
        
        if (entityType === "foreign") {
          // Foreign entities MUST file - ignore CSV value
          serviceType = "filing";
        } else if (csvServiceLevel === "monitoring" || csvServiceLevel === "filing") {
          // Domestic entities: respect CSV value
          serviceType = csvServiceLevel;
        } else {
          // Default: domestic → monitoring
          serviceType = "monitoring";
        }
        
        console.log(`CSV Parser: ${values[0]} - Country: ${countryOfFormation} → Entity: ${entityType} → Service: ${serviceType} ($${serviceType === 'monitoring' ? '249' : '398'})`);
        
        const client: Client = {
          id: `client-${Date.now()}-${i}`,
          llcName: values[0] || "",
          fictitiousName: values[1] || "",
          nydosId: values[2] || "",
          ein: values[3] || "",
          formationDate: values[4] || "",
          countryOfFormation: countryOfFormation,
          stateOfFormation: values[6] || "",
          dateAuthorityFiledNY: values[7] || "", // Date Application for Authority filed in NY (foreign entities only)
          contactEmail: values[8] || "",
          filingType: filingType as "disclosure" | "exemption",
          entityType: entityType, // AUTO-DETECTED: domestic if USA, foreign otherwise
          serviceType: serviceType, // AUTO-SET: monitoring for domestic, filing for foreign
          dataComplete: false
        };

        // Parse exemption data if exemption
        if (filingType === "exemption" && values.length >= 13) {
          client.exemptionCategory = values[11] || ""; // Column L (after Fictitious Name added)
          client.exemptionExplanation = values[12] || ""; // Column M
          
          // Parse company applicants (columns 13+, after Fictitious Name added)
          const companyApplicants = [];
          
          // Parse up to 2 company applicants (8 fields each: name, dob, address, idType, idNumber, issuingCountry, issuingState, role)
          for (let caIndex = 0; caIndex < 2; caIndex++) {
            const baseCol = 13 + (caIndex * 8); // Starting column for this applicant (shifted by 1 for Fictitious Name)
            
            if (values.length > baseCol && values[baseCol]) {
              companyApplicants.push({
                id: `ca-${Date.now()}-${i}-${caIndex + 1}`,
                fullName: values[baseCol] || "",
                dob: values[baseCol + 1] || "",
                address: values[baseCol + 2] || "",
                idType: values[baseCol + 3] || "SSN",
                idNumber: values[baseCol + 4] || "",
                issuingCountry: values[baseCol + 5] || "",
                issuingState: values[baseCol + 6] || "",
                role: values[baseCol + 7] || ""
              });
            }
          }
          
          if (companyApplicants.length > 0) {
            client.companyApplicants = companyApplicants;
          }
          
          if (client.exemptionCategory) {
            client.dataComplete = true;
          }
        }

        // Parse beneficial owner data if disclosure (supports up to 4 owners)
        if (filingType === "disclosure" && values.length >= 28) {
          const beneficialOwners = [];
          const companyApplicants = [];
          
          // Parse company applicants first (columns 12-27: 2 applicants x 8 fields each)
          for (let caIndex = 0; caIndex < 2; caIndex++) {
            const baseCol = 12 + (caIndex * 8); // Was 10, now 12 because of Service Level column
            
            if (values.length > baseCol && values[baseCol]) {
              companyApplicants.push({
                id: `ca-${Date.now()}-${i}-${caIndex + 1}`,
                fullName: values[baseCol] || "",
                dob: values[baseCol + 1] || "",
                address: values[baseCol + 2] || "",
                idType: values[baseCol + 3] || "SSN",
                idNumber: values[baseCol + 4] || "",
                issuingCountry: values[baseCol + 5] || "",
                issuingState: values[baseCol + 6] || "",
                role: values[baseCol + 7] || ""
              });
            }
          }
          
          if (companyApplicants.length > 0) {
            client.companyApplicants = companyApplicants;
          }
          
          // Parse up to 4 beneficial owners (8 fields each: name, dob, address, idType, idNumber, issuingCountry, issuingState, ownershipPercentage)
          // Starting at column 28 (columns 12-27 are company applicants, so BOs start at 28)
          for (let ownerIndex = 0; ownerIndex < 4; ownerIndex++) {
            const baseCol = 28 + (ownerIndex * 8); // Starting column for this owner (stays same)
            
            if (values.length > baseCol && values[baseCol]) {
              beneficialOwners.push({
                id: `owner-${Date.now()}-${i}-${ownerIndex + 1}`,
                fullName: values[baseCol] || "",
                dob: values[baseCol + 1] || "",
                address: values[baseCol + 2] || "",
                idType: values[baseCol + 3] || "SSN",
                idNumber: values[baseCol + 4] || "",
                issuingCountry: values[baseCol + 5] || "",
                issuingState: values[baseCol + 6] || "",
                ownershipPercentage: values[baseCol + 7] || ""
              });
            }
          }

          if (beneficialOwners.length > 0) {
            client.beneficialOwners = beneficialOwners;
            client.dataComplete = true;
          }
        }

        if (!client.llcName || !client.formationDate) {
          incomplete++;
          client.dataComplete = false;
        }

        newClients.push(client);
      }
    }
    
    return { clients: newClients, incomplete };
  };

  // Helper function to auto-match company applicant with firm workers
  const matchFirmWorker = (applicantName: string) => {
    if (!applicantName || !firmWorkers.length) return null;
    
    const normalizedName = applicantName.trim().toLowerCase();
    return firmWorkers.find(worker => 
      worker.fullName.trim().toLowerCase() === normalizedName
    );
  };

  // NEW: Parser for multi-sheet template format
  const parseMultiSheetData = (clientListData: any[][], beneficialOwnersData: any[][], exemptionData: any[][], companyApplicantsData: any[][]) => {
    const newClients: Client[] = [];
    let incomplete = 0;
    
    // Skip header row (row 0)
    for (let i = 1; i < clientListData.length; i++) {
      const row = clientListData[i];
      
      // Client List columns: Client_ID, Legal_Business_Name, NY_DOS_ID, EIN_Status, EIN, 
      //                       Date_of_Formation, State_of_Formation, Country_of_Formation, 
      //                       Filing_Intent, Service_Level, Primary_Contact_Email, Primary_Contact_Phone
      
      if (row[0] && row[1]) { // Must have Client_ID and Legal_Business_Name
        const clientId = String(row[0]).trim();
        const filingIntent = String(row[8] || '').toLowerCase();
        const filingType = filingIntent === 'exemption' ? 'exemption' : 'disclosure';
        
        // AUTO-DETECT entity type based on country of formation
        const countryOfFormation = String(row[7] || 'United States');
        const entityType = countryOfFormation === 'United States' ? 'domestic' : 'foreign';
        
        // READ Service Level from column 9 (Service_Level)
        const csvServiceLevel = String(row[9] || '').toLowerCase().trim();
        let serviceType: 'monitoring' | 'filing';
        
        if (entityType === 'foreign') {
          // Foreign entities MUST file - ignore CSV value
          serviceType = 'filing';
        } else if (csvServiceLevel === 'monitoring' || csvServiceLevel === 'filing') {
          // Domestic entities: respect CSV value
          serviceType = csvServiceLevel;
        } else {
          // Default: domestic → monitoring
          serviceType = 'monitoring';
        }
        
        const client: Client = {
          id: `client-imported-${clientId}`,
          llcName: String(row[1] || ''),
          nydosId: String(row[2] || ''),
          ein: String(row[4] || ''), // EIN is column 4
          formationDate: String(row[5] || ''),
          stateOfFormation: String(row[6] || ''),
          countryOfFormation: countryOfFormation,
          contactEmail: String(row[10] || ''), // NOW column 10 (was 9)
          filingType: filingType as 'disclosure' | 'exemption',
          entityType: entityType,
          serviceType: serviceType,
          dataComplete: false
        };
        
        // Find beneficial owners for this client (if disclosure)
        if (filingType === 'disclosure' && beneficialOwnersData.length > 1) {
          const beneficialOwners = [];
          
          // Skip header row in Beneficial Owners sheet
          for (let j = 1; j < beneficialOwnersData.length; j++) {
            const boRow = beneficialOwnersData[j];
            const boClientId = String(boRow[0] || '').trim();
            
            // Beneficial Owners columns: Client_ID, Owner_Number, Full_Legal_Name, Date_of_Birth,
            //                           Street_Address, City, State, Country, Zip_Code,
            //                           Ownership_Percentage, Title_or_Role, ID_Type, ID_Number,
            //                           Issuing_Country, Issuing_State
            
            if (boClientId === clientId && boRow[2]) { // Match Client_ID and has Full_Legal_Name
              beneficialOwners.push({
                id: `bo-${clientId}-${boRow[1] || beneficialOwners.length + 1}`,
                fullName: String(boRow[2] || ''),
                dob: String(boRow[3] || ''),
                address: `${boRow[4] || ''}, ${boRow[5] || ''}, ${boRow[6] || ''} ${boRow[8] || ''}`.trim(),
                idType: String(boRow[11] || 'Passport'),
                idNumber: String(boRow[12] || ''),
                issuingCountry: String(boRow[13] || 'United States'),
                issuingState: String(boRow[14] || ''),
                ownershipPercentage: String(boRow[9] || ''),
                role: String(boRow[10] || '')
              });
            }
          }
          
          if (beneficialOwners.length > 0) {
            client.beneficialOwners = beneficialOwners;
            client.dataComplete = true;
          }
        }
        
        // Find exemption attestation for this client (if exemption)
        if (filingType === 'exemption' && exemptionData.length > 1) {
          // Skip header row in Exemption Attestations sheet
          for (let j = 1; j < exemptionData.length; j++) {
            const exemptRow = exemptionData[j];
            const exemptClientId = String(exemptRow[0] || '').trim();
            
            // Exemption columns: Client_ID, Exemption_Category, Explanation_of_Qualification,
            //                    Authorized_Signer_Name, Signer_Title, Attestation_Date, Signature_Initials
            
            if (exemptClientId === clientId) {
              client.exemptionCategory = String(exemptRow[1] || '');
              client.exemptionExplanation = String(exemptRow[2] || '');
              
              if (client.exemptionCategory) {
                client.dataComplete = true;
              }
              break; // Only one exemption per client
            }
          }
        }
        
        // Find company applicants for this client (REQUIRED - exactly 2)
        if (companyApplicantsData.length > 1) {
          const companyApplicants = [];
          
          // Skip header row in Company Applicants sheet
          for (let j = 1; j < companyApplicantsData.length; j++) {
            const caRow = companyApplicantsData[j];
            const caClientId = String(caRow[0] || '').trim();
            
            // Company Applicants columns: Client_ID, Applicant_Number, Full_Legal_Name, Date_of_Birth,
            //                             Street_Address, City, State, Country, Zip_Code,
            //                             Role_Title, ID_Type, ID_Number, Issuing_Country, Issuing_State
            
            if (caClientId === clientId && caRow[2]) { // Match Client_ID and has Full_Legal_Name
              const applicantName = String(caRow[2] || '').trim();
              const matchedWorker = matchFirmWorker(applicantName);
              
              // Auto-match logic: If name matches a firm worker, flag it
              const applicant = {
                id: `ca-${clientId}-${caRow[1] || companyApplicants.length + 1}`,
                fullName: applicantName,
                dob: String(caRow[3] || ''),
                address: `${caRow[4] || ''}|${caRow[5] || ''}|${caRow[6] || ''}|${caRow[8] || ''}|${caRow[7] || 'United States'}`,
                idType: String(caRow[10] || 'SSN'),
                idNumber: String(caRow[11] || ''),
                issuingCountry: String(caRow[12] || 'United States'),
                issuingState: String(caRow[13] || ''),
                role: String(caRow[9] || ''),
                // Flag if auto-matched with firm worker
                ...(matchedWorker && { matchedWorkerId: matchedWorker.id })
              };
              
              companyApplicants.push(applicant);
            }
          }
          
          // Must have exactly 2 company applicants
          if (companyApplicants.length === 2) {
            client.companyApplicants = companyApplicants;
          } else if (companyApplicants.length > 0) {
            console.warn(`Client ${clientId} has ${companyApplicants.length} company applicants (expected 2)`);
            client.companyApplicants = companyApplicants;
          }
        }
        
        if (!client.llcName || !client.formationDate) {
          incomplete++;
          client.dataComplete = false;
        }
        
        newClients.push(client);
      }
    }
    
    return { clients: newClients, incomplete };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("📂 Reading file...");

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (isExcel) {
      // Handle Excel file
      setUploadProgress(20);
      setUploadStatus("📊 Parsing Excel file...");
      const XLSX = await import('xlsx');
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Check if this is the NEW multi-sheet template format
          const hasClientListSheet = workbook.SheetNames.includes('Client List');
          const hasBeneficialOwnersSheet = workbook.SheetNames.includes('Beneficial Owners');
          const hasExemptionSheet = workbook.SheetNames.includes('Exemption Attestations');
          const hasCompanyApplicantsSheet = workbook.SheetNames.includes('Company Applicants');
          
          if (hasClientListSheet && (hasBeneficialOwnersSheet || hasExemptionSheet)) {
            // NEW FORMAT: Multi-sheet template
            const clientListSheet = workbook.Sheets['Client List'];
            const clientListData = XLSX.utils.sheet_to_json(clientListSheet, { header: 1 }) as any[][];
            
            const beneficialOwnersSheet = hasBeneficialOwnersSheet ? workbook.Sheets['Beneficial Owners'] : null;
            const beneficialOwnersData = beneficialOwnersSheet ? XLSX.utils.sheet_to_json(beneficialOwnersSheet, { header: 1 }) as any[][] : [];
            
            const exemptionSheet = hasExemptionSheet ? workbook.Sheets['Exemption Attestations'] : null;
            const exemptionData = exemptionSheet ? XLSX.utils.sheet_to_json(exemptionSheet, { header: 1 }) as any[][] : [];
            
            const companyApplicantsSheet = hasCompanyApplicantsSheet ? workbook.Sheets['Company Applicants'] : null;
            const companyApplicantsData = companyApplicantsSheet ? XLSX.utils.sheet_to_json(companyApplicantsSheet, { header: 1 }) as any[][] : [];
            
            if (clientListData.length < 2) {
              setUploadStatus("❌ Invalid file - no clients found in Client List sheet");
              return;
            }
            
            setUploadProgress(40);
            setUploadStatus("📋 Processing client data...");
            
            const { clients: newClients, incomplete } = parseMultiSheetData(clientListData, beneficialOwnersData, exemptionData, companyApplicantsData);
            
            setUploadProgress(60);
            setUploadStatus(`✅ Processed ${newClients.length} clients...`);
            
            // Simulate processing time for user feedback
            setTimeout(() => {
              setUploadProgress(80);
              setUploadStatus("✔️ Validating data...");
              
              setTimeout(() => {
                setClients([...clients, ...newClients]);
                setUploadProgress(100);
                
                // Enhanced status message showing auto-matching
                const matchCount = newClients.reduce((count, client) => {
                  return count + (client.companyApplicants?.filter((ca: any) => ca.matchedWorkerId).length || 0);
                }, 0);
                
                let statusMsg = `✅ ${newClients.length - incomplete} clients imported successfully${incomplete > 0 ? `, ${incomplete} incomplete` : ''}`;
                if (matchCount > 0) {
                  statusMsg += ` | ${matchCount} company applicant(s) auto-matched with firm users`;
                }
                setUploadStatus(statusMsg);
                
                // Hide loading screen after 1 second
                setTimeout(() => {
                  setIsUploading(false);
                }, 1000);
              }, 500);
            }, 500);
          } else {
            // OLD FORMAT: Single Data sheet (legacy support)
            const sheetName = workbook.SheetNames.includes('Data') ? 'Data' : workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to array of arrays
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            
            if (jsonData.length < 2) {
              setUploadStatus("❌ Invalid file - no data rows found");
              return;
            }
            
            setUploadProgress(40);
            const { clients: newClients, incomplete } = parseClientData(jsonData);
            setUploadProgress(60);
            
            setTimeout(() => {
              setUploadProgress(80);
              setTimeout(() => {
                setClients([...clients, ...newClients]);
                setUploadProgress(100);
                setUploadStatus(`✅ ${newClients.length - incomplete} clients imported successfully${incomplete > 0 ? `, ${incomplete} incomplete` : ''}`);
                setTimeout(() => setIsUploading(false), 1000);
              }, 500);
            }, 500);
          }
        } catch (error) {
          setUploadStatus("❌ Error reading Excel file");
          setIsUploading(false);
        }
      };
      
      reader.readAsArrayBuffer(file);
    } else {
      // Handle CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setUploadStatus("❌ Invalid CSV file - no data rows found");
          return;
        }

        // Parse CSV lines into array of arrays
        const csvData = lines.map(line => {
          const values: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          return values;
        });

        setUploadProgress(40);
        const { clients: newClients, incomplete } = parseClientData(csvData);
        setUploadProgress(60);
        
        setTimeout(() => {
          setUploadProgress(80);
          setTimeout(() => {
            setClients([...clients, ...newClients]);
            setUploadProgress(100);
            setUploadStatus(`✅ ${newClients.length - incomplete} clients imported successfully${incomplete > 0 ? `, ${incomplete} incomplete` : ''}`);
            setTimeout(() => setIsUploading(false), 1000);
          }, 500);
        }, 500);
      };

      reader.readAsText(file);
    }
  };

  const handleAddManual = () => {
    // ⭐ VALIDATE ALL REQUIRED FIELDS
    const errors: string[] = [];
    
    if (!manualEntry.llcName?.trim()) {
      errors.push('LLC Legal Name*');
    }
    
    if (!manualEntry.nydosId?.trim()) {
      errors.push('NY DOS ID*');
    }
    
    if (!manualEntry.formationDate) {
      errors.push('Formation Date*');
    }
    
    if (!manualEntry.contactEmail?.trim()) {
      errors.push('Contact Email*');
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(manualEntry.contactEmail)) {
        errors.push('Contact Email* (invalid format)');
      }
    }
    
    if (!manualEntry.countryOfFormation?.trim()) {
      errors.push('Country of Formation*');
    }
    
    // If USA, state is required
    if (manualEntry.countryOfFormation === 'United States' && !manualEntry.stateOfFormation?.trim()) {
      errors.push('State* (required for USA entities)');
    }
    
    if (!manualEntry.filingType) {
      errors.push('Filing Type* (disclosure or exemption)');
    }
    
    if (errors.length > 0) {
      alert(`❌ Please complete all required fields:\n\n  • ${errors.join('\n  • ')}`);
      return;
    }

    // AUTO-DETECT: Determine entity type based on country of formation
    const countryOfFormation = manualEntry.countryOfFormation || "United States";
    const entityType = countryOfFormation === "United States" ? "domestic" : "foreign";
    
    // AUTO-SET SERVICE LEVEL based on country
    // DOMESTIC (USA) → monitoring ($249) by default
    // FOREIGN (non-USA) → filing ($398) REQUIRED
    const serviceType: "monitoring" | "filing" = entityType === "foreign" ? "filing" : "monitoring";

    const newClient: Client = {
      id: `client-${Date.now()}`,
      llcName: manualEntry.llcName,
      nydosId: manualEntry.nydosId || "",
      ein: manualEntry.ein || "",
      formationDate: manualEntry.formationDate,
      countryOfFormation: countryOfFormation,
      stateOfFormation: manualEntry.stateOfFormation || "",
      zipCode: manualEntry.zipCode || "",
      contactEmail: manualEntry.contactEmail || "",
      filingType: manualEntry.filingType || "disclosure",
      entityType: entityType, // AUTO-DETECTED: domestic if USA, foreign otherwise
      serviceType: serviceType, // AUTO-SET: monitoring for domestic, filing for foreign
      dataComplete: false
    };

    setClients([...clients, newClient]);
    setManualEntry({
      llcName: "",
      nydosId: "",
      ein: "",
      formationDate: "",
      countryOfFormation: "United States",
      stateOfFormation: "",
      zipCode: "",
      contactEmail: "",
      filingType: "disclosure"
    });
    setEinStatus("have-ein");
  };

  const handleRemoveClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const handleUpdateClient = (id: string, field: keyof Client, value: any) => {
    setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleDownloadTemplate = async () => {
    // Use XLSX library to create Excel file with 5 separate sheets
    const XLSX = await import('xlsx');
    
    // ========================================
    // INSTRUCTIONS SHEET
    // ========================================
    const instructionsData = [
      ['NYLTA BULK FILING - CSV TEMPLATE INSTRUCTIONS'],
      [''],
      ['⚠️ CRITICAL UPDATE: FILING INTENT IS PER-CLIENT'],
      [''],
      ['Each row in this CSV represents a SINGLE client.'],
      ['You must indicate whether each client is submitting:'],
      ['  • Beneficial ownership disclosure (filing_type = "disclosure"), OR'],
      ['  • Claims exemption (filing_type = "exemption")'],
      [''],
      ['NYLTA.com records the information YOU provide.'],
      ['NYLTA.com does NOT determine eligibility or exemption status.'],
      [''],
      ['📋 QUICK START GUIDE (3 STEPS)'],
      [''],
      ['Step 1: Read This Instructions Tab (You are here!)'],
      ['Step 2: Go to the "Data" tab and fill in your client information'],
      ['Step 3: Save this file and upload it in the NYLTA bulk filing system'],
      [''],
      ['⚠️ IMPORTANT: Do NOT delete the header row (Row 1) in the Data tab'],
      ['⚠️ IMPORTANT: Save as .xlsx (Excel format) or .csv when uploading'],
      [''],
      [''],
      ['📝 FIELD DESCRIPTIONS & WHAT TO ENTER'],
      [''],
      ['COLUMN', 'FIELD NAME', 'REQUIRED?', 'DESCRIPTION', 'EXAMPLE'],
      ['A', 'LLC Legal Name', 'YES', 'Full legal name of the LLC as registered with NY DOS', 'Manhattan Professional Services LLC'],
      ['B', 'Fictitious Name (DBA)', 'NO', 'Fictitious name used in New York, if any. Leave blank if none.', 'Metro Pro Services'],
      ['C', 'NY DOS ID', 'YES', 'NY Department of State ID number', '6789012'],
      ['D', 'EIN', 'YES', 'Federal Employer ID Number (format: 12-3456789)', '12-3456789'],
      ['E', 'Formation Date', 'YES', 'Date LLC was formed (format: YYYY-MM-DD)', '2024-01-15'],
      ['F', 'Country of Formation', 'YES', 'Country where LLC was formed', 'United States'],
      ['G', 'State', 'If USA', 'State of formation if formed in USA', 'New York'],
      ['H', 'Date Authority Filed NY', 'If Foreign', 'Date Application for Authority filed in NY (YYYY-MM-DD) - ONLY for foreign entities', '2024-06-15'],
      ['I', 'Contact Email', 'YES', 'Email for filing confirmations', 'admin@company.com'],
      ['J', 'Filing Type', 'YES', 'Enter "disclosure" or "exemption"', 'disclosure'],
      ['K', 'Service Level', 'AUTO-SET', 'Automatically determined by Country of Formation', '(auto-set)'],
      [''],
      [''],
      ['🔹 IMPORTANT: SERVICE LEVEL (Column J) - AUTOMATICALLY SET'],
      [''],
      ['⚠️ THIS FIELD IS AUTO-SET BY THE SYSTEM BASED ON COUNTRY OF FORMATION'],
      [''],
      ['RULE 1: FOREIGN ENTITIES (non-U.S.) → MUST FILE ($398) - NO CHOICE'],
      ['  • All entities formed OUTSIDE the United States MUST select Filing service'],
      ['  • Foreign entities cannot choose Monitoring - Filing is REQUIRED'],
      ['  • Examples: Canada, UK, Germany, Mexico → FILING ($398) MANDATORY'],
      [''],
      ['RULE 2: DOMESTIC ENTITIES (U.S.) → CAN CHOOSE ($249 or $398)'],
      ['  • Entities formed in \"United States\" can select either service:'],
      ['    - MONITORING ($249): Store data, prepare for future filing, can upgrade later'],
      ['    - FILING ($398): Complete NYDOS submission with immediate filing'],
      ['  • For domestic entities in the CSV, you can specify \"monitoring\" or \"filing\" in Column J'],
      ['  • If blank, domestic entities default to Monitoring ($249)'],
      [''],
      ['EXAMPLES:'],
      ['  • Country = \"United States\" + Column J = \"monitoring\" → Monitoring ($249)'],
      ['  • Country = \"United States\" + Column J = \"filing\" → Filing ($398)'],
      ['  • Country = \"United States\" + Column J = blank → Monitoring ($249) [default]'],
      ['  • Country = \"Canada\" + ANY Column J value → Filing ($398) [FORCED]'],
      ['  • Country = \"United Kingdom\" + ANY Column J value → Filing ($398) [FORCED]'],
      [''],
      [''],
      ['🔹 FILING TYPE (Column I) - REQUIRED FOR ALL CLIENTS'],
      [''],
      ['"disclosure" - Client is submitting beneficial ownership information'],
      ['"exemption" - Client is submitting an exemption attestation'],
      [''],
      ['This is a PER-CLIENT decision. Different clients can have different filing types.'],
      [''],
      [''],
      ['🔹 IF YOUR CLIENT FILING TYPE IS "exemption" - Fill These Columns:'],
      [''],
      ['COLUMN', 'FIELD NAME', 'REQUIRED?', 'DESCRIPTION', 'EXAMPLE'],
      ['K', 'Exemption Category', 'YES (if exemption)', 'Select from approved categories', 'U.S.-Formed LLC'],
      ['L', 'Exemption Explanation', 'AUTO-FILLED', 'Auto-generated based on category', '(system will auto-fill)'],
      ['M-T', 'Company Applicant 1', 'OPTIONAL', 'Person who filed formation docs (if known)', 'See examples in Data tab'],
      ['U-AB', 'Company Applicant 2', 'OPTIONAL', 'Second applicant if applicable', 'Leave blank if only 1 applicant'],
      [''],
      ['APPROVED EXEMPTION CATEGORIES:'],
      ['  • U.S.-Formed LLC (The company was formed in the United States)'],
      ['  • Not a Reporting Company (Based on the law, this company does not need to report owners)'],
      ['  • All Owners Are U.S. Persons'],
      ['  • Large Operating Company'],
      ['  • Bank'],
      ['  • Insurance Company'],
      ['  • Governmental Authority'],
      [''],
      [''],
      ['🔹 IF YOUR CLIENT FILING TYPE IS "disclosure" - Fill These Columns:'],
      [''],
      ['COLUMN', 'FIELD NAME', 'REQUIRED?', 'DESCRIPTION', 'EXAMPLE'],
      ['M-T', 'Company Applicant 1', 'YES', 'Person who files formation docs with state', 'See examples in Data tab'],
      ['U-AB', 'Company Applicant 2', 'OPTIONAL', 'Second applicant if applicable', ''],
      ['AC-AJ', 'Beneficial Owner 1 (BO1)', 'YES', 'Owner with 25%+ ownership OR substantial control', 'Name, DOB, Address, ID info, Ownership %'],
      ['AK-AR', 'Beneficial Owner 2-4', 'If applicable', 'Additional beneficial owners (up to 4 total)', 'Same format as BO1'],
      [''],
      [''],
      ['✅ COMMON SCENARIOS & WHAT TO FILL OUT'],
      [''],
      ['SCENARIO', 'FILING TYPE', 'SERVICE LEVEL', 'WHAT TO FILL IN'],
      ['Domestic LLC claiming exemption (monitoring)', 'exemption', 'monitoring', 'Columns A-L (Company Applicants optional)'],
      ['Domestic LLC claiming exemption (filing now)', 'exemption', 'filing', 'Columns A-L (Company Applicants optional)'],
      ['Domestic LLC with 1 owner (monitoring)', 'disclosure', 'monitoring', 'Columns A-J + Company Applicant 1 (M-T) + Beneficial Owner 1 (AC-AJ)'],
      ['Domestic LLC with 1 owner (filing now)', 'disclosure', 'filing', 'Columns A-J + Company Applicant 1 (M-T) + Beneficial Owner 1 (AC-AJ)'],
      ['Foreign LLC (MUST file)', 'disclosure', 'filing', 'Columns A-J + Fill Date Authority (G) + Company Applicant 1 (M-T) + BO1 (AC-AJ)'],
      ['Foreign LLC exemption (MUST file)', 'exemption', 'filing', 'Columns A-L + Fill Date Authority (G) (Company Applicants optional)'],
      [''],
      [''],
      ['💡 HELPFUL TIPS'],
      [''],
      ['• Make sure dates are in YYYY-MM-DD format (e.g., 2024-03-15)'],
      ['• Ownership percentages should add up to 100% (or close to it)'],
      ['• ID Types: Use "State Issued Drivers License", "U.S. Passport", "State/local/tribal-issued ID", or "Foreign Passport"'],
      ['• You can have different Company Applicants and Beneficial Owners (or they can be the same person)'],
      ['• Leave columns blank if they do not apply (e.g., if exemption, leave BO columns blank)'],
      ['• The Data tab has example rows you can reference'],
      [''],
      [''],
      ['❓ STILL CONFUSED?'],
      [''],
      ['1. Go to the Data tab and look at the example rows'],
      ['2. Find an example that matches your situation'],
      ['3. Copy the format and replace with your client information'],
      ['4. Delete the example rows before uploading'],
      [''],
      ['⚠️ IMPORTANT COMPLIANCE NOTE'],
      [''],
      ['You are submitting information based on what you attest.'],
      ['NYLTA.com does not determine eligibility or exemption status.'],
      ['Final filing requirements are subject to guidance from the New York Department of State.'],
      [''],
      ['📧 Need help? Contact bulk@nylta.com'],
      ['']
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
    
    // Set column widths for instructions
    wsInstructions['!cols'] = [
      { wch: 10 },  // Column A
      { wch: 35 },  // Column B
      { wch: 15 },  // Column C
      { wch: 70 },  // Column D
      { wch: 45 }   // Column E
    ];

    // Style the instructions sheet
    if (!wsInstructions['!rows']) wsInstructions['!rows'] = [];
    wsInstructions['!rows'][0] = { hpt: 24 }; // Make title row taller

    // ========================================
    // DATA SHEET
    // ========================================
    
    // Define column headers - COMPREHENSIVE with ALL wizard fields
    const headers = [
      'LLC Legal Name',
      'Fictitious Name (DBA)',
      'NY DOS ID',
      'EIN (12-3456789)',
      'Formation Date (YYYY-MM-DD)',
      'Country of Formation',
      'State',
      'Date Authority Filed NY (if Foreign)',
      'Contact Email',
      'Filing Type (disclosure/exemption)',
      'Service Level (monitoring/filing)',
      'Exemption Category',
      'Exemption Explanation',
      // Company Applicant 1 - ALL fields
      'CA1 - Full Name',
      'CA1 - Phone Number',
      'CA1 - Email',
      'CA1 - Title/Role',
      'CA1 - DOB (YYYY-MM-DD)',
      'CA1 - Street Address',
      'CA1 - City',
      'CA1 - State',
      'CA1 - ZIP Code',
      'CA1 - Country',
      'CA1 - ID Type',
      'CA1 - ID Number',
      'CA1 - ID Expiration Date (YYYY-MM-DD)',
      'CA1 - Issuing Country',
      'CA1 - Issuing State',
      // Company Applicant 2 - ALL fields
      'CA2 - Full Name',
      'CA2 - Phone Number',
      'CA2 - Email',
      'CA2 - Title/Role',
      'CA2 - DOB (YYYY-MM-DD)',
      'CA2 - Street Address',
      'CA2 - City',
      'CA2 - State',
      'CA2 - ZIP Code',
      'CA2 - Country',
      'CA2 - ID Type',
      'CA2 - ID Number',
      'CA2 - ID Expiration Date (YYYY-MM-DD)',
      'CA2 - Issuing Country',
      'CA2 - Issuing State',
      // Beneficial Owner 1 - ALL fields
      'BO1 - Full Name',
      'BO1 - DOB (YYYY-MM-DD)',
      'BO1 - Street Address',
      'BO1 - City',
      'BO1 - Country',
      'BO1 - State',
      'BO1 - ZIP Code',
      'BO1 - Ownership %',
      'BO1 - Position/Title',
      'BO1 - ID Type',
      'BO1 - ID Number',
      'BO1 - ID Expiration Date (YYYY-MM-DD)',
      'BO1 - Issuing Country',
      'BO1 - Issuing State',
      // Beneficial Owner 2 - ALL fields
      'BO2 - Full Name',
      'BO2 - DOB (YYYY-MM-DD)',
      'BO2 - Street Address',
      'BO2 - City',
      'BO2 - Country',
      'BO2 - State',
      'BO2 - ZIP Code',
      'BO2 - Ownership %',
      'BO2 - Position/Title',
      'BO2 - ID Type',
      'BO2 - ID Number',
      'BO2 - ID Expiration Date (YYYY-MM-DD)',
      'BO2 - Issuing Country',
      'BO2 - Issuing State',
      // Beneficial Owner 3 - ALL fields
      'BO3 - Full Name',
      'BO3 - DOB (YYYY-MM-DD)',
      'BO3 - Street Address',
      'BO3 - City',
      'BO3 - Country',
      'BO3 - State',
      'BO3 - ZIP Code',
      'BO3 - Ownership %',
      'BO3 - Position/Title',
      'BO3 - ID Type',
      'BO3 - ID Number',
      'BO3 - ID Expiration Date (YYYY-MM-DD)',
      'BO3 - Issuing Country',
      'BO3 - Issuing State'
    ];
    
    // Example data rows - Mix of disclosure and exemption (INCLUDES FOREIGN ENTITIES)
    const data = [
      // Example 1: DOMESTIC EXEMPTION - Monitoring Only (not filing yet)
      [
        'Manhattan Professional Services LLC',
        '6789012',
        '12-3456789',
        '2024-01-15',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'compliance@manhattanpro.com',
        'exemption',
        'monitoring', // Domestic can choose monitoring
        'U.S.-Formed LLC',
        'The entity qualifies for the selected exemption based on the information provided.',
        'James Patrick Sullivan',
        '1975-08-12',
        '500 Madison Avenue, New York, NY 10022',
        'State Issued Drivers License',
        'S12345678',
        'United States',
        'New York',
        'Director of Compliance',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 2: DOMESTIC DISCLOSURE - Full Filing Service
      [
        'Brooklyn Tech Ventures LLC',
        '8901234',
        '45-6789012',
        '2024-03-01',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'founder@brooklyntech.com',
        'disclosure',
        'filing', // Domestic choosing full filing service
        '',
        '',
        'Sarah Elizabeth Chen',
        '1992-07-15',
        '789 Broadway, Brooklyn, NY 11211',
        'State Issued Drivers License',
        'C87654321',
        'United States',
        'New York',
        'Founder',
        '', '', '', '', '', '', '', '',
        'Sarah Elizabeth Chen',
        '1992-07-15',
        '789 Broadway, Brooklyn, NY 11211',
        'State Issued Drivers License',
        'C87654321',
        'United States',
        'New York',
        '100%',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 3: FOREIGN ENTITY - Disclosure (MUST file immediately)
      [
        'Toronto Consulting Group LLC',
        '5678901',
        '33-4455667',
        '2023-09-15',
        'Canada',
        '', // State (blank for foreign)
        '2024-01-20', // Date Authority Filed NY (REQUIRED for foreign)
        'contact@torontoconsulting.com',
        'disclosure',
        'filing', // Foreign entities MUST file (no monitoring option)
        '',
        '',
        'Michael James O\'Connor',
        '1985-04-22',
        '123 King Street West, Toronto, ON M5H 1A1, Canada',
        'Foreign Passport',
        'CA9876543',
        'Canada',
        '',
        'Managing Director',
        '', '', '', '', '', '', '', '',
        'Michael James O\'Connor',
        '1985-04-22',
        '123 King Street West, Toronto, ON M5H 1A1, Canada',
        'Foreign Passport',
        'CA9876543',
        'Canada',
        '',
        '60%',
        'Emily Rose Thompson',
        '1988-11-10',
        '456 Bay Street, Toronto, ON M5G 2L7, Canada',
        'Foreign Passport',
        'CA1234567',
        'Canada',
        '',
        '40%',
        '', '', '', '', '', '', '', ''
      ],
      // Example 4: DOMESTIC EXEMPTION - Full Filing (filing exemption immediately)
      [
        'NYC Development Corporation LLC',
        '7890123',
        '98-7654321',
        '2024-02-10',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'legal@nycdev.gov',
        'exemption',
        'filing', // Domestic choosing to file exemption now
        'Governmental Authority',
        'The entity qualifies for the selected exemption based on the information provided.',
        'Thomas Edward Harrison',
        '1968-11-30',
        '1 Centre Street, New York, NY 10007',
        'U.S. Passport',
        '987654321',
        '',
        '',
        'General Counsel',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 5: DOMESTIC DISCLOSURE - Monitoring Only (preparing for future filing)
      [
        'Empire State Holdings LLC',
        '9012345',
        '23-4567890',
        '2024-02-20',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'admin@empirestateholdings.com',
        'disclosure',
        'monitoring', // Domestic choosing monitoring, can upgrade later
        '',
        '',
        'Jennifer Marie Smith',
        '1985-03-15',
        '123 Main Street, Apt 4B, New York, NY 10001',
        'State/local/tribal-issued ID',
        'NYC1234567',
        'United States',
        'New York',
        'Managing Member',
        '', '', '', '', '', '', '', '',
        'Jennifer Marie Smith',
        '1985-03-15',
        '123 Main Street, Apt 4B, New York, NY 10001',
        'State/local/tribal-issued ID',
        'NYC1234567',
        'United States',
        'New York',
        '60%',
        'Robert James Anderson',
        '1987-06-22',
        '456 Park Avenue, Suite 2100, New York, NY 10022',
        'U.S. Passport',
        '123456789',
        '',
        '',
        '40%',
        '', '', '', '', '', '', '', ''
      ],
      // Example 6: FOREIGN ENTITY - Exemption (MUST file immediately)
      [
        'London Investment Partners LLC',
        '3456789',
        '44-5566778',
        '2023-06-10',
        'United Kingdom',
        '', // State (blank for foreign)
        '2023-12-01', // Date Authority Filed NY (REQUIRED for foreign)
        'compliance@londoninvest.co.uk',
        'exemption',
        'filing', // Foreign entities MUST file (no monitoring option)
        'Large Operating Company',
        'The entity qualifies for the selected exemption based on the information provided.',
        'Oliver William Harrison',
        '1978-02-28',
        '10 Downing Street, London SW1A 2AA, United Kingdom',
        'Foreign Passport',
        'GB7890123',
        'United Kingdom',
        '',
        'Chief Legal Officer',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 7: DOMESTIC EXEMPTION - Monitoring Only (storing exemption data)
      [
        'Queens Commercial Properties LLC',
        '1234098',
        '34-5678901',
        '2024-03-15',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'partners@queenscommercial.com',
        'exemption',
        'monitoring', // Domestic choosing monitoring for exemption
        'Large Operating Company',
        'The entity qualifies for the selected exemption based on the information provided.',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 8: DOMESTIC DISCLOSURE - Full Filing Service
      [
        'Hudson Valley Consulting LLC',
        '2345109',
        '56-7890123',
        '2024-01-20',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'partners@hudsonvalley.com',
        'disclosure',
        'filing', // Domestic choosing full filing
        '',
        '',
        'Michael Robert Thompson',
        '1980-04-10',
        '100 Main Street, White Plains, NY 10601',
        'State Issued Drivers License',
        'T11223344',
        'United States',
        'New York',
        'Managing Partner',
        '', '', '', '', '', '', '', '',
        'Michael Robert Thompson',
        '1980-04-10',
        '100 Main Street, White Plains, NY 10601',
        'State Issued Drivers License',
        'T11223344',
        'United States',
        'New York',
        '50%',
        'Lisa Marie Johnson',
        '1983-09-25',
        '250 Central Avenue, Yonkers, NY 10704',
        'U.S. Passport',
        '234567890',
        '',
        '',
        '30%',
        'David Alan Martinez',
        '1978-12-08',
        '75 Market Street, Poughkeepsie, NY 12601',
        'State Issued Drivers License',
        'M55667788',
        'United States',
        'New York',
        '20%',
        '', '', '', '', '', '', '', ''
      ],
      // Example 9: DOMESTIC EXEMPTION - Full Filing (Bank exemption)
      [
        'Liberty Financial Services LLC',
        '3456210',
        '67-8901234',
        '2024-02-05',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'compliance@libertyfinancial.com',
        'exemption',
        'filing', // Bank filing exemption immediately
        'Bank',
        'The entity qualifies for the selected exemption based on the information provided.',
        'Patricia Ann Williams',
        '1970-06-18',
        '500 Fifth Avenue, New York, NY 10110',
        'State Issued Drivers License',
        'W99887766',
        'United States',
        'New York',
        'Chief Compliance Officer',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 10: DOMESTIC DISCLOSURE - Monitoring Only
      [
        'Bronx Real Estate Management LLC',
        '4567321',
        '78-9012345',
        '2024-03-10',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'owner@bronxrealestate.com',
        'disclosure',
        'monitoring', // Domestic choosing monitoring
        '',
        '',
        'Carlos Eduardo Rodriguez',
        '1988-11-22',
        '1500 Grand Concourse, Bronx, NY 10457',
        'U.S. Passport',
        '345678901',
        '',
        '',
        'Owner and Operator',
        '', '', '', '', '', '', '', '',
        'Carlos Eduardo Rodriguez',
        '1988-11-22',
        '1500 Grand Concourse, Bronx, NY 10457',
        'U.S. Passport',
        '345678901',
        '',
        '',
        '100%',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 11: FOREIGN ENTITY - Disclosure (MUST file immediately)
      [
        'Berlin Manufacturing Group LLC',
        '8765432',
        '55-6677889',
        '2023-08-01',
        'Germany',
        '', // State (blank for foreign)
        '2024-02-15', // Date Authority Filed NY (REQUIRED for foreign)
        'info@berlinmfg.de',
        'disclosure',
        'filing', // Foreign entities MUST file
        '',
        '',
        'Hans Friedrich Mueller',
        '1982-07-14',
        'Unter den Linden 1, 10117 Berlin, Germany',
        'Foreign Passport',
        'DE8765432',
        'Germany',
        '',
        'Chief Executive Officer',
        '', '', '', '', '', '', '', '',
        'Hans Friedrich Mueller',
        '1982-07-14',
        'Unter den Linden 1, 10117 Berlin, Germany',
        'Foreign Passport',
        'DE8765432',
        'Germany',
        '',
        '40%',
        'Anna Maria Schmidt',
        '1985-03-20',
        'Potsdamer Platz 5, 10785 Berlin, Germany',
        'Foreign Passport',
        'DE2345678',
        'Germany',
        '',
        '30%',
        'Klaus Werner Fischer',
        '1980-11-08',
        'Alexanderplatz 3, 10178 Berlin, Germany',
        'Foreign Passport',
        'DE3456789',
        'Germany',
        '',
        '20%',
        'Petra Elisabeth Weber',
        '1990-05-30',
        'Kurfurstendamm 100, 10709 Berlin, Germany',
        'Foreign Passport',
        'DE4567890',
        'Germany',
        '',
        '10%'
      ],
      // Example 12: DOMESTIC EXEMPTION - Monitoring (2 Company Applicants)
      [
        'Metro Manufacturing & Distribution LLC',
        '5678432',
        '89-0123456',
        '2024-01-25',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'legal@metromanufacturing.com',
        'exemption',
        'monitoring', // Domestic choosing monitoring
        'Large Operating Company',
        'The entity qualifies for the selected exemption based on the information provided.',
        'Richard Paul Anderson',
        '1965-03-30',
        '2000 Industrial Boulevard, Rochester, NY 14623',
        'State Issued Drivers License',
        'A12312312',
        'United States',
        'New York',
        'Vice President of Legal Affairs',
        'Angela Marie Stevens',
        '1972-08-14',
        '2000 Industrial Boulevard, Rochester, NY 14623',
        'State Issued Drivers License',
        'S45645645',
        'United States',
        'New York',
        'Director of Corporate Services',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ],
      // Example 13: DOMESTIC DISCLOSURE - Full Filing Service
      [
        'Staten Island Logistics LLC',
        '6789543',
        '90-1234567',
        '2024-02-28',
        'United States',
        'New York',
        '', // Date Authority Filed NY (blank for domestic)
        'info@statenislandlogistics.com',
        'disclosure',
        'filing', // Domestic choosing full filing
        '',
        '',
        'Jessica Lynn Davis',
        '1990-05-16',
        '3000 Victory Boulevard, Staten Island, NY 10314',
        'State Issued Drivers License',
        'D78978978',
        'United States',
        'New York',
        'Co-Founder',
        '', '', '', '', '', '', '', '',
        'Jessica Lynn Davis',
        '1990-05-16',
        '3000 Victory Boulevard, Staten Island, NY 10314',
        'State Issued Drivers License',
        'D78978978',
        'United States',
        'New York',
        '70%',
        'Anthony Michael Brown',
        '1986-10-03',
        '150 Bay Street, Staten Island, NY 10301',
        'U.S. Passport',
        '456789012',
        '',
        '',
        '30%',
        '', '', '', '', '', '', '', ''
      ],
      // Example 14: DOMESTIC DISCLOSURE - Filing
      ['Chelsea Retail Group LLC', '4567890', '55-6677889', '2024-01-25', 'United States', 'New York', '', 'admin@chelsearetail.com', 'disclosure', 'filing', '', '', 'David Alexander Martinez', '1980-05-14', '200 Eighth Avenue, New York, NY 10011', 'State Issued Drivers License', 'M12345678', 'United States', 'New York', 'CEO', '', '', '', '', '', '', '', '', 'David Alexander Martinez', '1980-05-14', '200 Eighth Avenue, New York, NY 10011', 'State Issued Drivers License', 'M12345678', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 15: DOMESTIC DISCLOSURE - Filing
      ['Bronx Medical Services LLC', '5678901', '66-7788990', '2024-02-05', 'United States', 'New York', '', 'compliance@bronxmedical.com', 'disclosure', 'filing', '', '', 'Dr. Lisa Anne Rodriguez', '1975-08-20', '1000 Grand Concourse, Bronx, NY 10451', 'U.S. Passport', '789012345', '', '', 'Medical Director', '', '', '', '', '', '', '', '', 'Dr. Lisa Anne Rodriguez', '1975-08-20', '1000 Grand Concourse, Bronx, NY 10451', 'U.S. Passport', '789012345', '', '', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 16: DOMESTIC DISCLOSURE - Filing
      ['Harlem Real Estate Holdings LLC', '6789012', '77-8899001', '2024-02-10', 'United States', 'New York', '', 'invest@harlemrealty.com', 'disclosure', 'filing', '', '', 'Marcus Jerome Washington', '1982-03-12', '2 West 125th Street, New York, NY 10027', 'State Issued Drivers License', 'W98765432', 'United States', 'New York', 'Managing Partner', '', '', '', '', '', '', '', '', 'Marcus Jerome Washington', '1982-03-12', '2 West 125th Street, New York, NY 10027', 'State Issued Drivers License', 'W98765432', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 17: DOMESTIC DISCLOSURE - Filing
      ['Long Island Tech Solutions LLC', '8901234', '99-0011223', '2024-01-30', 'United States', 'New York', '', 'it@litech.com', 'disclosure', 'filing', '', '', 'Kevin Patrick O\'Malley', '1988-12-05', '500 Broadhollow Road, Melville, NY 11747', 'State Issued Drivers License', 'O12345678', 'United States', 'New York', 'CTO', '', '', '', '', '', '', '', '', 'Kevin Patrick O\'Malley', '1988-12-05', '500 Broadhollow Road, Melville, NY 11747', 'State Issued Drivers License', 'O12345678', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 18: DOMESTIC DISCLOSURE - Filing
      ['Rochester Manufacturing LLC', '1234568', '22-3344556', '2024-01-20', 'United States', 'New York', '', 'ops@rochestermfg.com', 'disclosure', 'filing', '', '', 'William Thomas Anderson', '1983-11-22', '100 State Street, Rochester, NY 14614', 'State Issued Drivers License', 'A11223344', 'United States', 'New York', 'Plant Manager', '', '', '', '', '', '', '', '', 'William Thomas Anderson', '1983-11-22', '100 State Street, Rochester, NY 14614', 'State Issued Drivers License', 'A11223344', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 19: DOMESTIC DISCLOSURE - Filing
      ['Syracuse Distribution Partners LLC', '2345679', '33-4455667', '2024-02-25', 'United States', 'New York', '', 'logistics@syracusedist.com', 'disclosure', 'filing', '', '', 'Patricia Marie Sullivan', '1977-06-30', '200 Jefferson Street, Syracuse, NY 13202', 'State Issued Drivers License', 'S55667788', 'United States', 'New York', 'Operations Director', '', '', '', '', '', '', '', '', 'Patricia Marie Sullivan', '1977-06-30', '200 Jefferson Street, Syracuse, NY 13202', 'State Issued Drivers License', 'S55667788', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 20: DOMESTIC DISCLOSURE - Filing
      ['Albany Financial Services LLC', '4567891', '55-6677889', '2024-02-01', 'United States', 'New York', '', 'finance@albanyfs.com', 'disclosure', 'filing', '', '', 'Richard James Mitchell', '1984-09-17', '1 Commerce Plaza, Albany, NY 12210', 'State Issued Drivers License', 'M99887766', 'United States', 'New York', 'CFO', '', '', '', '', '', '', '', '', 'Richard James Mitchell', '1984-09-17', '1 Commerce Plaza, Albany, NY 12210', 'State Issued Drivers License', 'M99887766', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 21: DOMESTIC DISCLOSURE - Filing
      ['Buffalo Industrial Holdings LLC', '5678902', '66-7788991', '2024-01-18', 'United States', 'New York', '', 'industry@buffaloindustrial.com', 'disclosure', 'filing', '', '', 'Daniel Robert Thompson', '1979-03-28', '600 Main Street, Buffalo, NY 14202', 'U.S. Passport', '345678901', '', '', 'General Manager', '', '', '', '', '', '', '', '', 'Daniel Robert Thompson', '1979-03-28', '600 Main Street, Buffalo, NY 14202', 'U.S. Passport', '345678901', '', '', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 22: DOMESTIC DISCLOSURE - Filing
      ['Yonkers Commercial Properties LLC', '6789013', '77-8899002', '2024-02-08', 'United States', 'New York', '', 'properties@yonkerscommercial.com', 'disclosure', 'filing', '', '', 'Elizabeth Anne Garcia', '1986-12-14', '470 Nepperhan Avenue, Yonkers, NY 10701', 'State Issued Drivers License', 'G44556677', 'United States', 'New York', 'Property Manager', '', '', '', '', '', '', '', '', 'Elizabeth Anne Garcia', '1986-12-14', '470 Nepperhan Avenue, Yonkers, NY 10701', 'State Issued Drivers License', 'G44556677', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 23: DOMESTIC DISCLOSURE - Filing
      ['New Rochelle Development Group LLC', '7890124', '88-9900113', '2024-01-12', 'United States', 'New York', '', 'development@newrochelle.com', 'disclosure', 'filing', '', '', 'Christopher Michael Davis', '1981-08-23', '515 North Avenue, New Rochelle, NY 10801', 'State Issued Drivers License', 'D77889900', 'United States', 'New York', 'Development Director', '', '', '', '', '', '', '', '', 'Christopher Michael Davis', '1981-08-23', '515 North Avenue, New Rochelle, NY 10801', 'State Issued Drivers License', 'D77889900', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 24: DOMESTIC DISCLOSURE - Filing
      ['White Plains Ventures LLC', '8901235', '99-0011224', '2024-01-28', 'United States', 'New York', '', 'ventures@wpventures.com', 'disclosure', 'filing', '', '', 'Amanda Rose Peterson', '1990-05-07', '1 North Broadway, White Plains, NY 10601', 'State Issued Drivers License', 'P11223344', 'United States', 'New York', 'Venture Partner', '', '', '', '', '', '', '', '', 'Amanda Rose Peterson', '1990-05-07', '1 North Broadway, White Plains, NY 10601', 'State Issued Drivers License', 'P11223344', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Example 25: DOMESTIC DISCLOSURE - Filing
      ['Mount Vernon Business Group LLC', '9012346', '11-2233446', '2024-02-03', 'United States', 'New York', '', 'business@mvgroup.com', 'disclosure', 'filing', '', '', 'Gregory Alan Foster', '1987-09-19', '1 Roosevelt Square, Mount Vernon, NY 10550', 'State Issued Drivers License', 'F55667788', 'United States', 'New York', 'Business Development', '', '', '', '', '', '', '', '', 'Gregory Alan Foster', '1987-09-19', '1 Roosevelt Square, Mount Vernon, NY 10550', 'State Issued Drivers License', 'F55667788', 'United States', 'New York', '100%', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    
    // Set column widths for data sheet
    ws['!cols'] = [
      { wch: 40 },  // LLC Name
      { wch: 12 },  // DOS ID
      { wch: 15 },  // EIN
      { wch: 20 },  // Formation Date
      { wch: 18 },  // Country
      { wch: 15 },  // State
      { wch: 22 },  // Date Authority Filed NY (if Foreign)
      { wch: 30 },  // Contact Email
      { wch: 25 },  // Filing Type
      { wch: 22 },  // Service Level (NEW)
      { wch: 30 },  // Exemption Category
      { wch: 50 },  // Exemption Explanation
      { wch: 25 },  // CA1 Name
      { wch: 15 },  // CA1 DOB
      { wch: 45 },  // CA1 Address
      { wch: 30 },  // CA1 ID Type
      { wch: 15 },  // CA1 ID Number
      { wch: 18 },  // CA1 Issuing Country
      { wch: 18 },  // CA1 Issuing State
      { wch: 25 },  // CA1 Role
      { wch: 25 },  // CA2 Name
      { wch: 15 },  // CA2 DOB
      { wch: 45 },  // CA2 Address
      { wch: 30 },  // CA2 ID Type
      { wch: 15 },  // CA2 ID Number
      { wch: 18 },  // CA2 Issuing Country
      { wch: 18 },  // CA2 Issuing State
      { wch: 25 },  // CA2 Role
      { wch: 25 },  // BO1 Name
      { wch: 15 },  // BO1 DOB
      { wch: 45 },  // BO1 Address
      { wch: 30 },  // BO1 ID Type
      { wch: 15 },  // BO1 ID Number
      { wch: 18 },  // BO1 Issuing Country
      { wch: 18 },  // BO1 Issuing State
      { wch: 15 },  // BO1 Ownership %
      { wch: 25 },  // BO2 Name
      { wch: 15 },  // BO2 DOB
      { wch: 45 },  // BO2 Address
      { wch: 30 },  // BO2 ID Type
      { wch: 15 },  // BO2 ID Number
      { wch: 18 },  // BO2 Issuing Country
      { wch: 18 },  // BO2 Issuing State
      { wch: 15 },  // BO2 Ownership %
      { wch: 25 },  // BO3 Name
      { wch: 15 },  // BO3 DOB
      { wch: 45 },  // BO3 Address
      { wch: 30 },  // BO3 ID Type
      { wch: 15 },  // BO3 ID Number
      { wch: 18 },  // BO3 Issuing Country
      { wch: 18 },  // BO3 Issuing State
      { wch: 15 },  // BO3 Ownership %
      { wch: 25 },  // BO4 Name
      { wch: 15 },  // BO4 DOB
      { wch: 45 },  // BO4 Address
      { wch: 30 },  // BO4 ID Type
      { wch: 15 },  // BO4 ID Number
      { wch: 18 },  // BO4 Issuing Country
      { wch: 18 },  // BO4 Issuing State
      { wch: 15 }   // BO4 Ownership %
    ];
    
    // Add data validation for dropdown columns
    if (!ws['!dataValidation']) ws['!dataValidation'] = [];
    
    // Column H (index 7): Filing Type dropdown - UPDATED
    for (let row = 2; row <= 1000; row++) {
      ws['!dataValidation'].push({
        sqref: `H${row}`,
        type: 'list',
        allowBlank: false,
        formula1: '"disclosure,exemption"', // UPDATED
        showDropDown: true
      });
    }
    
    // Column I (index 8): Exemption Category dropdown - UPDATED with new categories at top
    for (let row = 2; row <= 1000; row++) {
      ws['!dataValidation'].push({
        sqref: `I${row}`,
        type: 'list',
        allowBlank: true,
        formula1: '"U.S.-Formed LLC,Not a Reporting Company,All Owners Are U.S. Persons,Large Operating Company,Bank,Insurance Company,Governmental Authority"', // UPDATED - new categories first
        showDropDown: true
      });
    }
    
    // ID Type dropdowns for Company Applicants and Beneficial Owners
    // CA1: Column N, CA2: Column V, BO1: Column AD, BO2: Column AL, BO3: Column AT, BO4: Column BB
    const idTypeColumns = ['N', 'V', 'AD', 'AL', 'AT', 'BB'];
    for (const col of idTypeColumns) {
      for (let row = 2; row <= 1000; row++) {
        ws['!dataValidation'].push({
          sqref: `${col}${row}`,
          type: 'list',
          allowBlank: true,
          formula1: '"State Issued Drivers License,State/local/tribal-issued ID,U.S. Passport,Foreign Passport"',
          showDropDown: true
        });
      }
    }
    
    // Create workbook with both sheets
    // COMPLETELY NEW: Create 5-sheet template matching exact specifications
    const wb = XLSX.utils.book_new();

    // Build sheet data from scratch instead of reusing old data
    const instructionsSheetData = [
      ["NYLTA BULK FILING - EXCEL TEMPLATE INSTRUCTIONS - READ THIS FIRST!"],
      [""],
      ["This template has 5 sheets. You must use the correct sheets based on your filing type."],
      [""],
      ["Sheet 1: Instructions (you are here) - Read first"],
      ["Sheet 2: Client List - Fill in ALL clients here"],
      ["Sheet 3: Beneficial Owners - ONLY for Disclosure filings (up to 9 per client)"],
      ["Sheet 4: Exemption Attestations - ONLY for Exemption filings"],
      ["Sheet 5: Example Data - 10 fully completed examples"],
      [""],
      ["IMPORTANT: Each client must have Filing_Intent = 'Disclosure' or 'Exemption'"],
      [""],
      ["Need help? See Example Data sheet or contact support@nylta.com"]
    ];
    
    const wsInstr = XLSX.utils.aoa_to_sheet(instructionsSheetData);
    wsInstr['!cols'] = [{ wch: 80 }];
    
    // Client List with 10 example clients - MIX of monitoring/filing & domestic/foreign
    const clientListData = [
      ["Client_ID", "Legal_Business_Name", "NY_DOS_ID", "EIN_Status", "EIN", "Date_of_Formation", "State_of_Formation", "Country_of_Formation", "Filing_Intent", "Service_Level", "Primary_Contact_Email", "Primary_Contact_Phone"],
      [1, "Acme Holdings LLC", "1234567", "Has EIN", "12-3456789", "01/15/2020", "NY", "United States", "Disclosure", "monitoring", "contact@acme.com", "(555) 123-4567"],
      [2, "Smith Ventures Inc", "2345678", "Has EIN", "23-4567890", "03/22/2019", "DE", "United States", "Disclosure", "filing", "info@smithventures.com", "(555) 234-5678"],
      [3, "Global Tech Partners LLC", "3456789", "Has EIN", "34-5678901", "06/10/2021", "NY", "United States", "Disclosure", "monitoring", "admin@globaltech.com", "(555) 345-6789"],
      [4, "Toronto Consulting Group LLC", "4567890", "Has EIN", "45-6789012", "08/05/2023", "ON", "Canada", "Disclosure", "filing", "contact@torontoconsulting.com", "(555) 456-7890"],
      [5, "Metropolitan Holdings LLC", "5678901", "Has EIN", "56-7890123", "11/18/2018", "NY", "United States", "Disclosure", "filing", "info@metropolitan.com", "(555) 567-8901"],
      [6, "First National Bank Corp", "6789012", "Has EIN", "67-8901234", "01/01/2000", "NY", "United States", "Exemption", "monitoring", "compliance@fnb.com", "(555) 678-9012"],
      [7, "State Insurance Company", "7890123", "Has EIN", "78-9012345", "05/15/1995", "NY", "United States", "Exemption", "filing", "legal@stateinsurance.com", "(555) 789-0123"],
      [8, "London Investment Partners LLC", "8901234", "Has EIN", "89-0123456", "09/01/2010", "", "United Kingdom", "Exemption", "filing", "partners@londoninvest.com", "(555) 890-1234"],
      [9, "Public Utility Services Inc", "9012345", "Has EIN", "90-1234567", "03/12/2005", "NY", "United States", "Exemption", "monitoring", "info@publicutility.com", "(555) 901-2345"],
      [10, "Berlin Manufacturing LLC", "0123456", "Has EIN", "01-2345678", "07/20/2015", "", "Germany", "Disclosure", "filing", "director@berlinmfg.com", "(555) 012-3456"]
    ];
    const wsClients = XLSX.utils.aoa_to_sheet(clientListData);
    wsClients['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 22 }, { wch: 25 }, { wch: 18 }];
    
    // Beneficial Owners for Disclosure clients (Clients 1-5)
    const boData = [
      ["Client_ID", "Owner_Number", "Full_Legal_Name", "Date_of_Birth", "Street_Address", "City", "State", "Country", "Zip_Code", "Ownership_Percentage", "Title_or_Role", "ID_Type", "ID_Number", "Issuing_Country", "Issuing_State"],
      [1, 1, "John Smith", "05/15/1975", "123 Main St", "New York", "NY", "United States", "10001", "60", "CEO", "Driver's License", "S123456789", "United States", "NY"],
      [1, 2, "Sarah Johnson", "08/22/1980", "456 Park Ave", "Brooklyn", "NY", "United States", "11201", "40", "CFO", "Passport", "P987654321", "United States", ""],
      [2, 1, "David Smith", "03/10/1982", "321 Fifth Ave", "Manhattan", "NY", "United States", "10016", "60", "Managing Partner", "Passport", "P123456789", "United States", ""],
      [2, 2, "Jennifer Smith", "07/18/1985", "321 Fifth Ave", "Manhattan", "NY", "United States", "10016", "40", "Partner", "Driver's License", "S234567890", "United States", "NY"],
      [3, 1, "Michael Chen", "12/05/1970", "555 Tech Blvd", "Albany", "NY", "United States", "12207", "55", "CEO", "Passport", "P111222333", "United States", ""],
      [3, 2, "Lisa Rodriguez", "04/20/1983", "100 Innovation Dr", "Rochester", "NY", "United States", "14604", "45", "CTO", "Driver's License", "S444555666", "United States", "NY"],
      [4, 1, "Thomas Brown", "01/08/1990", "100 Sunrise Ln", "New York", "NY", "United States", "10002", "70", "Managing Member", "Driver's License", "S111111111", "United States", "NY"],
      [4, 2, "Elizabeth Davis", "05/22/1987", "200 Morning Dr", "Brooklyn", "NY", "United States", "11202", "30", "Member", "Passport", "P222222222", "United States", ""],
      [5, 1, "Christopher Wilson", "08/14/1982", "300 Dawn Ave", "Queens", "NY", "United States", "11376", "50", "Chairman", "Driver's License", "S333333333", "United States", "NY"],
      [5, 2, "Michelle Taylor", "11/30/1979", "400 Daybreak St", "Bronx", "NY", "United States", "10451", "50", "President", "State ID", "I444444444", "United States", "NY"]
    ];
    const wsBOs = XLSX.utils.aoa_to_sheet(boData);
    wsBOs['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 15 }];
    
    // Exemption Attestations for Exemption clients (Clients 6-10)
    const exemptData = [
      ["Client_ID", "Exemption_Category", "Explanation_of_Qualification", "Authorized_Signer_Name", "Signer_Title", "Attestation_Date", "Signature_Initials"],
      [6, "Bank", "Federally chartered bank under OCC supervision", "Henry Morrison", "Chief Compliance Officer", "12/31/2024", "HJM"],
      [7, "Insurance Company", "Licensed insurance company subject to state insurance regulation", "Patricia Chen", "General Counsel", "12/31/2024", "PC"],
      [8, "Accounting Firm", "Public accounting firm registered with PCAOB", "Robert Anderson", "Managing Partner", "12/31/2024", "RA"],
      [9, "Public Utility", "Public utility providing telecommunications services under FCC regulation", "Susan Miller", "Chief Regulatory Officer", "12/31/2024", "SM"],
      [10, "Tax-Exempt Entity", "501(c)(3) charitable organization with IRS tax-exempt status", "James Wilson", "Executive Director", "12/31/2024", "JW"]
    ];
    const wsExempt = XLSX.utils.aoa_to_sheet(exemptData);
    wsExempt['!cols'] = [{ wch: 12 }, { wch: 35 }, { wch: 40 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 }];
    
    const exampleData = [
      ["EXAMPLE CLIENT LIST:"],
      ["Client_ID", "Legal_Business_Name", "NY_DOS_ID", "EIN_Status", "EIN", "Date_of_Formation", "State_of_Formation", "Country_of_Formation", "Filing_Intent", "Primary_Contact_Email", "Primary_Contact_Phone"],
      [1, "Acme Holdings LLC", "1234567", "Has EIN", "12-3456789", "01/15/2020", "NY", "United States", "Disclosure", "contact@acme.com", "(555) 123-4567"],
      [2, "Smith Ventures Inc", "2345678", "Has EIN", "23-4567890", "03/22/2019", "DE", "United States", "Disclosure", "info@smithventures.com", "(555) 234-5678"],
      [3, "Global Tech Partners LLC", "3456789", "Has EIN", "34-5678901", "06/10/2021", "NY", "United States", "Disclosure", "admin@globaltech.com", "(555) 345-6789"],
      [4, "Sunrise Investments LLC", "4567890", "Waiting for EIN", "", "08/05/2023", "NY", "United States", "Disclosure", "contact@sunrise.com", "(555) 456-7890"],
      [5, "Metropolitan Holdings LLC", "5678901", "Has EIN", "45-6789012", "11/18/2018", "NY", "United States", "Disclosure", "info@metropolitan.com", "(555) 567-8901"],
      [6, "First National Bank Corp", "6789012", "Has EIN", "56-7890123", "01/01/2000", "NY", "United States", "Exemption", "compliance@fnb.com", "(555) 678-9012"],
      [7, "State Insurance Company", "7890123", "Has EIN", "67-8901234", "05/15/1995", "NY", "United States", "Exemption", "legal@stateinsurance.com", "(555) 789-0123"],
      [8, "Metro Accounting Firm LLP", "8901234", "Has EIN", "78-9012345", "09/01/2010", "NY", "United States", "Exemption", "partners@metroaccounting.com", "(555) 890-1234"],
      [9, "Public Utility Services Inc", "9012345", "Has EIN", "89-0123456", "03/12/2005", "NY", "United States", "Exemption", "info@publicutility.com", "(555) 901-2345"],
      [10, "Community Foundation 501c3", "0123456", "Has EIN", "90-1234567", "07/20/2015", "NY", "United States", "Exemption", "director@communityfoundation.org", "(555) 012-3456"],
      [""],
      ["EXAMPLE BENEFICIAL OWNERS (Disclosure clients only - UP TO 9 PER CLIENT):"],
      ["Client_ID", "Owner_Number", "Full_Legal_Name", "Date_of_Birth", "Street_Address", "City", "State", "Country", "Zip_Code", "Ownership_Percentage", "Title_or_Role", "ID_Type", "ID_Number", "Issuing_Country", "Issuing_State"],
      [1, 1, "John Smith", "05/15/1975", "123 Main St", "New York", "NY", "United States", "10001", "45", "CEO", "Driver's License", "S123456789", "United States", "NY"],
      [1, 2, "Sarah Johnson", "08/22/1980", "456 Park Ave", "Brooklyn", "NY", "United States", "11201", "35", "CFO", "Passport", "P987654321", "United States", ""],
      [1, 3, "Robert Williams", "11/03/1978", "789 Broadway", "Queens", "NY", "United States", "11375", "20", "COO", "Driver's License", "S987654321", "United States", "NY"],
      [2, 1, "David Smith", "03/10/1982", "321 Fifth Ave", "Manhattan", "NY", "United States", "10016", "60", "Managing Partner", "Passport", "P123456789", "United States", ""],
      [2, 2, "Jennifer Smith", "07/18/1985", "321 Fifth Ave", "Manhattan", "NY", "United States", "10016", "40", "Partner", "Driver's License", "S234567890", "United States", "NY"],
      [3, 1, "Michael Chen", "12/05/1970", "555 Tech Blvd", "Albany", "NY", "United States", "12207", "25", "CEO", "Passport", "P111222333", "United States", ""],
      [3, 2, "Lisa Rodriguez", "04/20/1983", "100 Innovation Dr", "Rochester", "NY", "United States", "14604", "20", "CTO", "Driver's License", "S444555666", "United States", "NY"],
      [3, 3, "James O'Brien", "09/15/1976", "200 Market St", "Buffalo", "NY", "United States", "14202", "15", "VP Engineering", "Passport", "P777888999", "United States", ""],
      [3, 4, "Amanda Thompson", "06/30/1988", "300 Commerce Plaza", "Syracuse", "NY", "United States", "13202", "15", "VP Operations", "Driver's License", "S000111222", "United States", "NY"],
      [3, 5, "Kevin Martinez", "02/12/1981", "400 Business Park", "Yonkers", "NY", "United States", "10701", "15", "VP Sales", "State ID", "I333444555", "United States", "NY"],
      [3, 6, "Patricia Lee", "10/25/1979", "500 Corporate Center", "White Plains", "NY", "United States", "10601", "10", "General Counsel", "Passport", "P666777888", "United States", ""],
      [4, 1, "Thomas Brown", "01/08/1990", "100 Sunrise Ln", "New York", "NY", "United States", "10002", "15", "Managing Member", "Driver's License", "S111111111", "United States", "NY"],
      [4, 2, "Elizabeth Davis", "05/22/1987", "200 Morning Dr", "Brooklyn", "NY", "United States", "11202", "14", "Member", "Passport", "P222222222", "United States", ""],
      [4, 3, "Christopher Wilson", "08/14/1992", "300 Dawn Ave", "Queens", "NY", "United States", "11376", "13", "Member", "Driver's License", "S333333333", "United States", "NY"],
      [4, 4, "Michelle Taylor", "11/30/1989", "400 Daybreak St", "Bronx", "NY", "United States", "10451", "12", "Member", "State ID", "I444444444", "United States", "NY"],
      [4, 5, "Daniel Anderson", "03/17/1991", "500 First Light Rd", "Staten Island", "NY", "United States", "10301", "11", "Member", "Passport", "P555555555", "United States", ""],
      [4, 6, "Rachel Thomas", "07/09/1986", "600 Early Bird Ct", "New Rochelle", "NY", "United States", "10801", "11", "Member", "Driver's License", "S666666666", "United States", "NY"],
      [4, 7, "Matthew Jackson", "12/21/1993", "700 Morning Glory", "Mount Vernon", "NY", "United States", "10550", "9", "Member", "Passport", "P777777777", "United States", ""],
      [4, 8, "Nicole White", "04/04/1988", "800 Sunrise Cir", "Yonkers", "NY", "United States", "10702", "8", "Member", "Driver's License", "S888888888", "United States", "NY"],
      [4, 9, "Ryan Harris", "09/26/1994", "900 Dawn Plaza", "White Plains", "NY", "United States", "10602", "7", "Member", "State ID", "I999999999", "United States", "NY"],
      [5, 1, "William Metropolitan", "02/28/1965", "1000 Metropolitan Ave", "New York", "NY", "United States", "10003", "100", "Sole Owner", "Passport", "P000000000", "United States", ""],
      [""],
      ["EXAMPLE EXEMPTION ATTESTATIONS (Exemption clients only):"],
      ["Client_ID", "Exemption_Category", "Explanation_of_Qualification", "Authorized_Signer_Name", "Signer_Title", "Attestation_Date", "Signature_Initials"],
      [6, "Bank", "Federally chartered bank under OCC supervision", "Henry Morrison", "Chief Compliance Officer", "12/31/2024", "HJM"],
      [7, "Insurance company", "Licensed under NY DFS regulation", "Susan Patterson", "General Counsel", "12/31/2024", "SKP"],
      [8, "Accounting firm", "PCAOB registered firm", "Richard Henderson", "Managing Partner", "12/31/2024", "RTH"],
      [9, "Public utility", "NY PSC regulated utility", "Margaret Foster", "VP Regulatory Affairs", "12/31/2024", "MLF"],
      [10, "Tax-exempt entity", "501(c)(3) charitable organization", "Dr. Jonathan Weber", "Executive Director", "12/31/2024", "JMW"]
    ];
    
    const wsExample = XLSX.utils.aoa_to_sheet(exampleData);
    wsExample['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 }];
    
    XLSX.utils.book_append_sheet(wb, wsInstr, 'Instructions');
    XLSX.utils.book_append_sheet(wb, wsClients, 'Client List');
    XLSX.utils.book_append_sheet(wb, wsBOs, 'Beneficial Owners');
    XLSX.utils.book_append_sheet(wb, wsExempt, 'Exemption Attestations');
    XLSX.utils.book_append_sheet(wb, wsExample, 'Example Data');
    
    // Generate Excel file
    XLSX.writeFile(wb, 'NYLTA_Bulk_Filing_Template.xlsx');
  };

  const handleContinue = () => {
    if (clients.length === 0) {
      alert("Please add at least one client to continue");
      return;
    }
    
    // No minimum client requirement - submit 1 or many clients
    onComplete(clients);
  };

  return (
    <>
      {/* Upload Loading Screen */}
      <UploadLoadingScreen 
        isVisible={isUploading}
        progress={uploadProgress}
        statusMessage={uploadStatus}
        clientCount={clients.length}
      />
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border-2 border-gray-200 shadow-sm">
          {/* Header - Professional Navy */}
          <div className="bg-[#00274E] text-white px-8 py-6 border-b-4 border-yellow-400">
            <h2 className="text-3xl mb-2">Step 1 – Upload Client List</h2>
            <p className="text-gray-200">
              Add LLCs to your bulk batch using our CSV template OR enter them manually one-by-one in the Manual Entry tab.
            </p>
          </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Per-Client Filing Intent Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 mb-1">
                  <strong>Filing intent is declared per client.</strong>
                </p>
                <p className="text-sm text-blue-800">
                  Each row in the CSV represents a single client. You must indicate whether each client is submitting 
                  beneficial ownership information (disclosure) or an exemption attestation (exemption). NYLTA.com records 
                  the information you provide and does not determine eligibility.
                </p>
              </div>
            </div>
          </div>

          {/* Two Column Layout - Professional */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Option 1: CSV Upload */}
            <div className="border-2 border-gray-300 bg-white">
              <div className="bg-gray-100 px-5 py-4 border-b-2 border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="bg-[#00274E] text-white w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-base text-gray-900">
                      <strong>Fastest: CSV Upload</strong> <span className="text-sm text-gray-600">(Recommended)</span>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="text-sm text-gray-700 mb-4">
                  Upload 10+ clients at once using our Excel template
                </p>
                <ol className="text-sm text-gray-700 space-y-2 mb-4 list-decimal list-inside">
                  <li>Click the <strong>"Download Template"</strong> button below</li>
                  <li>Open in Excel and fill in your client data</li>
                  <li>Save the file and upload it here</li>
                </ol>
                <div className="bg-yellow-50 border border-yellow-300 p-3 text-xs text-gray-700">
                  <strong>Tip:</strong> The template has examples and instructions built-in
                </div>
              </div>
            </div>

            {/* Option 2: Manual Entry */}
            <div className="border-2 border-gray-300 bg-white">
              <div className="bg-gray-100 px-5 py-4 border-b-2 border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="bg-[#00274E] text-white w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="text-base text-gray-900">
                      <strong>Alternative: Manual Entry</strong>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5">
                <p className="text-sm text-gray-700 mb-4">
                  Add clients one-by-one using the form
                </p>
                <ol className="text-sm text-gray-700 space-y-2 mb-4 list-decimal list-inside">
                  <li>Click the <strong>"Manual Entry"</strong> tab below</li>
                  <li>Fill out the form for each client</li>
                  <li>Click "Add Client" to save each one</li>
                </ol>
                <div className="bg-gray-50 border border-gray-300 p-3 text-xs text-gray-700">
                  <strong>Best for:</strong> Adding a few clients or testing the system
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 border border-gray-300 p-0 h-auto">
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-[#00274E] data-[state=active]:text-white py-3"
              >
                CSV Upload (Fastest)
              </TabsTrigger>
              <TabsTrigger 
                value="manual"
                className="data-[state=active]:bg-[#00274E] data-[state=active]:text-white py-3"
              >
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {/* Download Template Section */}
              <div className="border-2 border-yellow-400 bg-yellow-50">
                <div className="px-8 py-8 text-center space-y-4">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-[#00274E]" />
                  <div>
                    <h3 className="text-xl text-gray-900 mb-2">
                      Step 1: Download the Template
                    </h3>
                    <p className="text-sm text-gray-700 max-w-2xl mx-auto">
                      Our Excel template includes <strong>pre-sized columns</strong>, <strong>detailed instructions</strong>, 
                      and <strong>example rows</strong> showing both disclosure and exemption filings with per-client filing intent.
                    </p>
                  </div>
                  <Button 
                    onClick={handleDownloadTemplate}
                    className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E] px-8 py-6 text-base"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Excel Template with Examples
                  </Button>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                    <span>✓ Includes instructions</span>
                    <span>✓ Example clients</span>
                    <span>✓ Optimized for bulk filing</span>
                  </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="border-2 border-gray-300 bg-white">
                <div className="px-8 py-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl text-gray-900 mb-3">
                    Step 2: Upload Your Completed File
                  </h3>
                  <div className="space-y-3">
                    <Label htmlFor="csvUpload" className="cursor-pointer block text-center">
                      <span className="text-[#00274E] hover:underline text-base">
                        Click to upload CSV/Excel file
                      </span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </Label>
                    <Input
                      id="csvUpload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-600">
                      Accepted formats: <strong>.xlsx</strong>, <strong>.xls</strong>, <strong>.csv</strong>
                    </p>
                  </div>
                </div>
              </div>

              {uploadStatus && (
                <div className={`border-l-4 p-4 ${uploadStatus.startsWith('✅') ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                  <p className={`text-sm ${uploadStatus.startsWith('✅') ? 'text-green-900' : 'text-red-900'}`}>
                    {uploadStatus}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> For large batches, we recommend using the CSV template for efficiency.
                </p>
              </div>

              <div className="border-2 border-gray-300 bg-white p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="llcName" className="text-gray-900">LLC Legal Name*</Label>
                    <Input
                      id="llcName"
                      value={manualEntry.llcName}
                      onChange={(e) => setManualEntry({...manualEntry, llcName: e.target.value})}
                      placeholder="Example LLC"
                      className="border-gray-300"
                    />
                  </div>

              <div>
                <Label htmlFor="fictitiousName" className="text-gray-900">Fictitious Name (DBA)</Label>
                <Input
                  id="fictitiousName"
                  value={manualEntry.fictitiousName || ''}
                  onChange={(e) => setManualEntry({...manualEntry, fictitiousName: e.target.value})}
                  placeholder="Enter the fictitious name used in New York, if any."
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="nydosId" className="text-gray-900">NY DOS ID*</Label>
                <Input
                  id="nydosId"
                  value={manualEntry.nydosId}
                  onChange={(e) => setManualEntry({...manualEntry, nydosId: e.target.value})}
                  placeholder="1234567"
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="ein" className="text-gray-900">
                  EIN* {einStatus === "dont-have-ein" && <span className="text-xs text-gray-500">(Leave blank if you don't have it yet)</span>}
                </Label>
                <Input
                  id="ein"
                  value={manualEntry.ein}
                  onChange={(e) => setManualEntry({...manualEntry, ein: e.target.value})}
                  placeholder="12-3456789"
                  disabled={einStatus === "dont-have-ein"}
                  className="border-gray-300"
                />
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="no-ein"
                    checked={einStatus === "dont-have-ein"}
                    onChange={(e) => {
                      setEinStatus(e.target.checked ? "dont-have-ein" : "have-ein");
                      if (e.target.checked) {
                        setManualEntry({...manualEntry, ein: ""});
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor="no-ein" className="text-xs text-gray-600">
                    I don't have the EIN yet
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="formationDate" className="text-gray-900">Formation Date*</Label>
                <Input
                  id="formationDate"
                  type="date"
                  value={manualEntry.formationDate}
                  onChange={(e) => setManualEntry({...manualEntry, formationDate: e.target.value})}
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail" className="text-gray-900">Contact Email*</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={manualEntry.contactEmail}
                  onChange={(e) => setManualEntry({...manualEntry, contactEmail: e.target.value})}
                  placeholder="admin@example.com"
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="countryOfFormation" className="text-gray-900">Country of Formation*</Label>
                <Select
                  value={manualEntry.countryOfFormation}
                  onValueChange={(value) => {
                    setManualEntry({
                      ...manualEntry, 
                      countryOfFormation: value,
                      // Clear state if country is not USA
                      stateOfFormation: value === 'United States' ? manualEntry.stateOfFormation : ''
                    });
                  }}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                    <SelectItem value="Albania">Albania</SelectItem>
                    <SelectItem value="Algeria">Algeria</SelectItem>
                    <SelectItem value="Andorra">Andorra</SelectItem>
                    <SelectItem value="Angola">Angola</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Armenia">Armenia</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Austria">Austria</SelectItem>
                    <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                    <SelectItem value="Bahamas">Bahamas</SelectItem>
                    <SelectItem value="Bahrain">Bahrain</SelectItem>
                    <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                    <SelectItem value="Barbados">Barbados</SelectItem>
                    <SelectItem value="Belarus">Belarus</SelectItem>
                    <SelectItem value="Belgium">Belgium</SelectItem>
                    <SelectItem value="Belize">Belize</SelectItem>
                    <SelectItem value="Benin">Benin</SelectItem>
                    <SelectItem value="Bhutan">Bhutan</SelectItem>
                    <SelectItem value="Bolivia">Bolivia</SelectItem>
                    <SelectItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</SelectItem>
                    <SelectItem value="Botswana">Botswana</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Brunei">Brunei</SelectItem>
                    <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                    <SelectItem value="Cambodia">Cambodia</SelectItem>
                    <SelectItem value="Cameroon">Cameroon</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                    <SelectItem value="China">China</SelectItem>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                    <SelectItem value="Croatia">Croatia</SelectItem>
                    <SelectItem value="Cuba">Cuba</SelectItem>
                    <SelectItem value="Cyprus">Cyprus</SelectItem>
                    <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                    <SelectItem value="Denmark">Denmark</SelectItem>
                    <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
                    <SelectItem value="Ecuador">Ecuador</SelectItem>
                    <SelectItem value="Egypt">Egypt</SelectItem>
                    <SelectItem value="El Salvador">El Salvador</SelectItem>
                    <SelectItem value="Estonia">Estonia</SelectItem>
                    <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                    <SelectItem value="Finland">Finland</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                    <SelectItem value="Greece">Greece</SelectItem>
                    <SelectItem value="Guatemala">Guatemala</SelectItem>
                    <SelectItem value="Haiti">Haiti</SelectItem>
                    <SelectItem value="Honduras">Honduras</SelectItem>
                    <SelectItem value="Hungary">Hungary</SelectItem>
                    <SelectItem value="Iceland">Iceland</SelectItem>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Iran">Iran</SelectItem>
                    <SelectItem value="Iraq">Iraq</SelectItem>
                    <SelectItem value="Ireland">Ireland</SelectItem>
                    <SelectItem value="Israel">Israel</SelectItem>
                    <SelectItem value="Italy">Italy</SelectItem>
                    <SelectItem value="Jamaica">Jamaica</SelectItem>
                    <SelectItem value="Japan">Japan</SelectItem>
                    <SelectItem value="Jordan">Jordan</SelectItem>
                    <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                    <SelectItem value="Kuwait">Kuwait</SelectItem>
                    <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                    <SelectItem value="Latvia">Latvia</SelectItem>
                    <SelectItem value="Lebanon">Lebanon</SelectItem>
                    <SelectItem value="Libya">Libya</SelectItem>
                    <SelectItem value="Lithuania">Lithuania</SelectItem>
                    <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Malta">Malta</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
                    <SelectItem value="Moldova">Moldova</SelectItem>
                    <SelectItem value="Monaco">Monaco</SelectItem>
                    <SelectItem value="Mongolia">Mongolia</SelectItem>
                    <SelectItem value="Montenegro">Montenegro</SelectItem>
                    <SelectItem value="Morocco">Morocco</SelectItem>
                    <SelectItem value="Myanmar">Myanmar</SelectItem>
                    <SelectItem value="Nepal">Nepal</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="New Zealand">New Zealand</SelectItem>
                    <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="North Korea">North Korea</SelectItem>
                    <SelectItem value="North Macedonia">North Macedonia</SelectItem>
                    <SelectItem value="Norway">Norway</SelectItem>
                    <SelectItem value="Oman">Oman</SelectItem>
                    <SelectItem value="Pakistan">Pakistan</SelectItem>
                    <SelectItem value="Panama">Panama</SelectItem>
                    <SelectItem value="Paraguay">Paraguay</SelectItem>
                    <SelectItem value="Peru">Peru</SelectItem>
                    <SelectItem value="Philippines">Philippines</SelectItem>
                    <SelectItem value="Poland">Poland</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Qatar">Qatar</SelectItem>
                    <SelectItem value="Romania">Romania</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="Senegal">Senegal</SelectItem>
                    <SelectItem value="Serbia">Serbia</SelectItem>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Slovakia">Slovakia</SelectItem>
                    <SelectItem value="Slovenia">Slovenia</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="South Korea">South Korea</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                    <SelectItem value="Sudan">Sudan</SelectItem>
                    <SelectItem value="Sweden">Sweden</SelectItem>
                    <SelectItem value="Switzerland">Switzerland</SelectItem>
                    <SelectItem value="Syria">Syria</SelectItem>
                    <SelectItem value="Taiwan">Taiwan</SelectItem>
                    <SelectItem value="Tanzania">Tanzania</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                    <SelectItem value="Trinidad and Tobago">Trinidad and Tobago</SelectItem>
                    <SelectItem value="Tunisia">Tunisia</SelectItem>
                    <SelectItem value="Turkey">Turkey</SelectItem>
                    <SelectItem value="Uganda">Uganda</SelectItem>
                    <SelectItem value="Ukraine">Ukraine</SelectItem>
                    <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                    <SelectItem value="Uruguay">Uruguay</SelectItem>
                    <SelectItem value="Venezuela">Venezuela</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                    <SelectItem value="Yemen">Yemen</SelectItem>
                    <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Only show State dropdown if United States is selected */}
              {manualEntry.countryOfFormation === 'United States' && (
                <div>
                  <Label htmlFor="stateOfFormation" className="text-gray-900">State*</Label>
                  <Select
                    value={manualEntry.stateOfFormation}
                    onValueChange={(value) => setManualEntry({...manualEntry, stateOfFormation: value})}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="Alabama">Alabama</SelectItem>
                      <SelectItem value="Alaska">Alaska</SelectItem>
                      <SelectItem value="Arizona">Arizona</SelectItem>
                      <SelectItem value="Arkansas">Arkansas</SelectItem>
                      <SelectItem value="California">California</SelectItem>
                      <SelectItem value="Colorado">Colorado</SelectItem>
                      <SelectItem value="Connecticut">Connecticut</SelectItem>
                      <SelectItem value="Delaware">Delaware</SelectItem>
                      <SelectItem value="Florida">Florida</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Hawaii">Hawaii</SelectItem>
                      <SelectItem value="Idaho">Idaho</SelectItem>
                      <SelectItem value="Illinois">Illinois</SelectItem>
                      <SelectItem value="Indiana">Indiana</SelectItem>
                      <SelectItem value="Iowa">Iowa</SelectItem>
                      <SelectItem value="Kansas">Kansas</SelectItem>
                      <SelectItem value="Kentucky">Kentucky</SelectItem>
                      <SelectItem value="Louisiana">Louisiana</SelectItem>
                      <SelectItem value="Maine">Maine</SelectItem>
                      <SelectItem value="Maryland">Maryland</SelectItem>
                      <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                      <SelectItem value="Michigan">Michigan</SelectItem>
                      <SelectItem value="Minnesota">Minnesota</SelectItem>
                      <SelectItem value="Mississippi">Mississippi</SelectItem>
                      <SelectItem value="Missouri">Missouri</SelectItem>
                      <SelectItem value="Montana">Montana</SelectItem>
                      <SelectItem value="Nebraska">Nebraska</SelectItem>
                      <SelectItem value="Nevada">Nevada</SelectItem>
                      <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                      <SelectItem value="New Jersey">New Jersey</SelectItem>
                      <SelectItem value="New Mexico">New Mexico</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="North Carolina">North Carolina</SelectItem>
                      <SelectItem value="North Dakota">North Dakota</SelectItem>
                      <SelectItem value="Ohio">Ohio</SelectItem>
                      <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                      <SelectItem value="Oregon">Oregon</SelectItem>
                      <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                      <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                      <SelectItem value="South Carolina">South Carolina</SelectItem>
                      <SelectItem value="South Dakota">South Dakota</SelectItem>
                      <SelectItem value="Tennessee">Tennessee</SelectItem>
                      <SelectItem value="Texas">Texas</SelectItem>
                      <SelectItem value="Utah">Utah</SelectItem>
                      <SelectItem value="Vermont">Vermont</SelectItem>
                      <SelectItem value="Virginia">Virginia</SelectItem>
                      <SelectItem value="Washington">Washington</SelectItem>
                      <SelectItem value="West Virginia">West Virginia</SelectItem>
                      <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                      <SelectItem value="Wyoming">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Date Application for Authority Filed in New York - ONLY for foreign entities */}
              {manualEntry.countryOfFormation && manualEntry.countryOfFormation !== 'United States' && (
                <div>
                  <Label htmlFor="dateAuthorityFiledNY" className="text-gray-900">Date Application for Authority Filed in New York*</Label>
                  <Input
                    id="dateAuthorityFiledNY"
                    type="date"
                    value={manualEntry.dateAuthorityFiledNY || ''}
                    onChange={(e) => setManualEntry({...manualEntry, dateAuthorityFiledNY: e.target.value})}
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    The date a foreign LLC filed its Application for Authority with the New York Department of State to become authorized to do business in New York
                  </p>
                </div>
              )}
            </div>

            {/* Company Address Section */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Company Address</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {/* Street Address */}
                <div>
                  <Label htmlFor="streetAddress" className="text-gray-900">Street Address *</Label>
                  <Input
                    id="streetAddress"
                    value={manualEntry.streetAddress || ''}
                    onChange={(e) => setManualEntry({...manualEntry, streetAddress: e.target.value})}
                    placeholder="Street Address (number, street, and apt. or suite no)"
                    className="border-gray-300"
                  />
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city" className="text-gray-900">City *</Label>
                  <Input
                    id="city"
                    value={manualEntry.city || ''}
                    onChange={(e) => setManualEntry({...manualEntry, city: e.target.value})}
                    placeholder="City"
                    className="border-gray-300"
                  />
                </div>

                {/* Address Country */}
                <div>
                  <Label htmlFor="addressCountry" className="text-gray-900">Country *</Label>
                  <Select
                    value={manualEntry.addressCountry || 'United States'}
                    onValueChange={(value) => {
                      setManualEntry({
                        ...manualEntry,
                        addressCountry: value,
                        addressState: value === 'United States' ? manualEntry.addressState : ''
                      });
                    }}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                      <SelectItem value="Albania">Albania</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Address State */}
                <div>
                  <Label htmlFor="addressState" className="text-gray-900">State *</Label>
                  {manualEntry.addressCountry === 'United States' ? (
                    <Select
                      value={manualEntry.addressState || ''}
                      onValueChange={(value) => setManualEntry({...manualEntry, addressState: value})}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Alabama">Alabama</SelectItem>
                        <SelectItem value="Alaska">Alaska</SelectItem>
                        <SelectItem value="Arizona">Arizona</SelectItem>
                        <SelectItem value="Arkansas">Arkansas</SelectItem>
                        <SelectItem value="Colorado">Colorado</SelectItem>
                        <SelectItem value="Connecticut">Connecticut</SelectItem>
                        <SelectItem value="Delaware">Delaware</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Hawaii">Hawaii</SelectItem>
                        <SelectItem value="Idaho">Idaho</SelectItem>
                        <SelectItem value="Illinois">Illinois</SelectItem>
                        <SelectItem value="Indiana">Indiana</SelectItem>
                        <SelectItem value="Iowa">Iowa</SelectItem>
                        <SelectItem value="Kansas">Kansas</SelectItem>
                        <SelectItem value="Kentucky">Kentucky</SelectItem>
                        <SelectItem value="Louisiana">Louisiana</SelectItem>
                        <SelectItem value="Maine">Maine</SelectItem>
                        <SelectItem value="Maryland">Maryland</SelectItem>
                        <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                        <SelectItem value="Michigan">Michigan</SelectItem>
                        <SelectItem value="Minnesota">Minnesota</SelectItem>
                        <SelectItem value="Mississippi">Mississippi</SelectItem>
                        <SelectItem value="Missouri">Missouri</SelectItem>
                        <SelectItem value="Montana">Montana</SelectItem>
                        <SelectItem value="Nebraska">Nebraska</SelectItem>
                        <SelectItem value="Nevada">Nevada</SelectItem>
                        <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                        <SelectItem value="New Jersey">New Jersey</SelectItem>
                        <SelectItem value="New Mexico">New Mexico</SelectItem>
                        <SelectItem value="North Carolina">North Carolina</SelectItem>
                        <SelectItem value="North Dakota">North Dakota</SelectItem>
                        <SelectItem value="Ohio">Ohio</SelectItem>
                        <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                        <SelectItem value="Oregon">Oregon</SelectItem>
                        <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                        <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                        <SelectItem value="South Carolina">South Carolina</SelectItem>
                        <SelectItem value="South Dakota">South Dakota</SelectItem>
                        <SelectItem value="Tennessee">Tennessee</SelectItem>
                        <SelectItem value="Utah">Utah</SelectItem>
                        <SelectItem value="Vermont">Vermont</SelectItem>
                        <SelectItem value="Virginia">Virginia</SelectItem>
                        <SelectItem value="Washington">Washington</SelectItem>
                        <SelectItem value="West Virginia">West Virginia</SelectItem>
                        <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                        <SelectItem value="Wyoming">Wyoming</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="addressState"
                      value=""
                      placeholder="Select a country first"
                      disabled
                      className="border-gray-300 bg-gray-100"
                    />
                  )}
                </div>

                {/* Zip Code */}
                <div>
                  <Label htmlFor="addressZipCode" className="text-gray-900">Zip Code *</Label>
                  <Input
                    id="addressZipCode"
                    value={manualEntry.addressZipCode || ''}
                    onChange={(e) => setManualEntry({...manualEntry, addressZipCode: e.target.value})}
                    placeholder="Zip Code"
                    className="border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* UPDATED: Filing Type Selection */}
              <div>
                <Label htmlFor="filingType">Filing Type*</Label>
                <Select
                  value={manualEntry.filingType}
                  onValueChange={(value: "disclosure" | "exemption") => setManualEntry({...manualEntry, filingType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select filing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disclosure">Beneficial Ownership Disclosure</SelectItem>
                    <SelectItem value="exemption">Claims Exemption</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  This is per-client. NYLTA.com does not determine eligibility.
                </p>
              </div>
            </div>

            <Button onClick={handleAddManual} className="w-full bg-[#00274E] hover:bg-[#003d73] text-white mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Client to List
            </Button>
          </div>
        </TabsContent>
      </Tabs>

        {/* Client List Display */}
        {clients.length > 0 && (
          <div className="mt-8">
            <div className="bg-gray-100 border-2 border-gray-300 px-6 py-4 mb-4 flex items-center justify-between">
              <h3 className="text-lg text-gray-900">
                Clients in Batch: <strong>{clients.length}</strong>
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete all ${clients.length} clients? This cannot be undone.`)) {
                    setClients([]);
                  }
                }}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            </div>

            
            <div className="border-2 border-gray-300 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="text-gray-900">LLC Name</TableHead>
                    <TableHead className="text-gray-900">DOS ID</TableHead>
                    <TableHead className="text-gray-900">EIN</TableHead>
                    <TableHead className="text-gray-900">Filing Type</TableHead>
                    <TableHead className="text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.llcName}</TableCell>
                      <TableCell>{client.nydosId}</TableCell>
                      <TableCell>{client.ein || <span className="text-gray-400">No EIN</span>}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 text-xs border ${
                          client.filingType === 'disclosure' 
                            ? 'bg-blue-50 text-blue-900 border-blue-200' 
                            : 'bg-yellow-50 text-yellow-900 border-yellow-200'
                        }`}>
                          {client.filingType === 'disclosure' ? 'Disclosure' : 'Exemption'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveClient(client.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
          <Button onClick={onBack} variant="outline" className="border-gray-300 px-8 py-6">
            Back
          </Button>
          <Button 
            onClick={handleContinue}
            className="bg-[#00274E] hover:bg-[#003d73] text-white px-8 py-6"
            disabled={clients.length === 0}
            size="lg"
          >
            Continue with {clients.length} Client{clients.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}