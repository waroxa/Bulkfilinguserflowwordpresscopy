import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * CSV TEMPLATE GENERATOR
 * Creates pre-filled CSV templates with different volumes for testing
 */

interface TemplateOption {
  count: number;
  description: string;
  monitoringCount: number;
  filingCount: number;
  purpose: string;
}

export default function CSVTemplateGenerator() {
  const [generating, setGenerating] = useState(false);

  const templates: TemplateOption[] = [
    {
      count: 10,
      description: "10 Clients - Quick Test",
      monitoringCount: 6,
      filingCount: 4,
      purpose: "Quick testing and demo"
    },
    {
      count: 25,
      description: "25 Clients - Tier 2 Threshold",
      monitoringCount: 0,
      filingCount: 25,
      purpose: "Test volume discount triggers (ALL FILINGS)"
    },
    {
      count: 26,
      description: "26 Clients - Mixed Services",
      monitoringCount: 13,
      filingCount: 13,
      purpose: "Confirm Tier 2 discount applies"
    },
    {
      count: 120,
      description: "120 Clients - Large Volume",
      monitoringCount: 60,
      filingCount: 60,
      purpose: "Test performance and bulk processing"
    },
    {
      count: 155,
      description: "155 Clients - Max Volume Test",
      monitoringCount: 75,
      filingCount: 80,
      purpose: "Stress test: Upload speed, HighLevel sync, Tier 3 discount"
    }
  ];

  const generateCSV = async (template: TemplateOption) => {
    setGenerating(true);
    toast.info(`Generating ${template.count} client template...`);

    try {
      const XLSX = await import('xlsx');
      
      // CSV Headers
      const headers = [
        'LLC Legal Name',
        'Fictitious Name (DBA)',
        'NY DOS ID',
        'EIN',
        'Formation Date',
        'Country of Formation',
        'State',
        'Date Authority Filed NY',
        'Contact Email',
        'Filing Type',
        'Service Level',
        'Exemption Category',
        'Exemption Explanation',
        // Company Applicant 1
        'CA1 - Full Name',
        'CA1 - DOB',
        'CA1 - Address',
        'CA1 - ID Type',
        'CA1 - ID Number',
        'CA1 - Issuing Country',
        'CA1 - Issuing State',
        'CA1 - SSN/ITIN',
        'CA1 - Role',
        // Company Applicant 2
        'CA2 - Full Name',
        'CA2 - DOB',
        'CA2 - Address',
        'CA2 - ID Type',
        'CA2 - ID Number',
        'CA2 - Issuing Country',
        'CA2 - Issuing State',
        'CA2 - SSN/ITIN',
        'CA2 - Role',
        // Beneficial Owner 1
        'BO1 - Full Name',
        'BO1 - DOB',
        'BO1 - Address',
        'BO1 - ID Type',
        'BO1 - ID Number',
        'BO1 - Issuing Country',
        'BO1 - Issuing State',
        'BO1 - Ownership %',
        'BO1 - Role',
        // Beneficial Owner 2
        'BO2 - Full Name',
        'BO2 - DOB',
        'BO2 - Address',
        'BO2 - ID Type',
        'BO2 - ID Number',
        'BO2 - Issuing Country',
        'BO2 - Issuing State',
        'BO2 - Ownership %',
        'BO2 - Role'
      ];

      const rows: any[][] = [headers];

      // Generate data rows
      let monitoringGenerated = 0;
      let filingGenerated = 0;

      for (let i = 1; i <= template.count; i++) {
        const isMonitoring = monitoringGenerated < template.monitoringCount;
        const serviceType = isMonitoring ? 'monitoring' : 'filing';
        const country = serviceType === 'monitoring' ? 'United States' : (i % 3 === 0 ? 'Canada' : 'United States');
        const state = country === 'United States' ? 'New York' : '';
        const filingType = i % 3 === 0 ? 'exemption' : 'disclosure';

        if (isMonitoring) {
          monitoringGenerated++;
        } else {
          filingGenerated++;
        }

        // Base client data
        const row = [
          `${getCompanyName(i)} LLC`,
          i % 5 === 0 ? `${getCompanyName(i)} Services` : '',
          `${1234567 + i}`,
          `${10 + Math.floor(i / 10)}-${String(1000000 + i).slice(0, 7)}`,
          `${2018 + (i % 6)}-${String(1 + (i % 12)).padStart(2, '0')}-15`,
          country,
          state,
          country !== 'United States' ? `${2020 + (i % 4)}-06-15` : '',
          `contact${i}@${getCompanyName(i).toLowerCase().replace(/\s/g, '')}.com`,
          filingType,
          serviceType,
        ];

        if (filingType === 'exemption') {
          // Exemption data
          row.push(
            getExemptionCategory(i),
            getExemptionExplanation(i),
            '', '', '', '', '', '', '', '', '', // CA1
            '', '', '', '', '', '', '', '', '', // CA2
            '', '', '', '', '', '', '', '', '', // BO1
            '', '', '', '', '', '', '', ''      // BO2
          );
        } else {
          // Disclosure data
          row.push(
            '', '', // No exemption
            // CA1
            `${getFirstName(i)} ${getLastName(i)}`,
            `${1975 + (i % 20)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
            `${100 + i} Main St|${getCity(i)}|${state || 'Ontario'}|${getZipCode(i, country)}|${country}`,
            i % 2 === 0 ? 'Passport' : 'Driver License',
            `${getIDPrefix(i % 2 === 0)}${String(100000 + i)}`,
            country,
            state || '',
            `XXX-XX-${String(1000 + i)}`,
            'Founder',
            // CA2 (50% have second CA)
            i % 2 === 0 ? `${getFirstName(i + 100)} ${getLastName(i + 50)}` : '',
            i % 2 === 0 ? `${1980 + (i % 15)}-${String(1 + ((i + 3) % 12)).padStart(2, '0')}-${String(1 + ((i + 5) % 28)).padStart(2, '0')}` : '',
            i % 2 === 0 ? `${200 + i} Oak Ave|${getCity(i + 1)}|${state || 'Ontario'}|${getZipCode(i + 1, country)}|${country}` : '',
            i % 2 === 0 ? 'State ID' : '',
            i % 2 === 0 ? `${getIDPrefix(false)}${String(200000 + i)}` : '',
            i % 2 === 0 ? country : '',
            i % 2 === 0 ? (state || '') : '',
            i % 2 === 0 ? `XXX-XX-${String(2000 + i)}` : '',
            i % 2 === 0 ? 'CEO' : '',
            // BO1
            `${getFirstName(i + 200)} ${getLastName(i + 100)}`,
            `${1985 + (i % 15)}-${String(1 + ((i + 6) % 12)).padStart(2, '0')}-${String(1 + ((i + 10) % 28)).padStart(2, '0')}`,
            `${300 + i} Park Ave|${getCity(i + 2)}|${state || 'Ontario'}|${getZipCode(i + 2, country)}|${country}`,
            i % 3 === 0 ? 'Passport' : 'Driver License',
            `${getIDPrefix(i % 3 === 0)}${String(300000 + i)}`,
            country,
            state || '',
            `${40 + (i % 20)}`,
            'Owner',
            // BO2 (70% have second BO)
            i % 10 < 7 ? `${getFirstName(i + 300)} ${getLastName(i + 150)}` : '',
            i % 10 < 7 ? `${1990 + (i % 10)}-${String(1 + ((i + 9) % 12)).padStart(2, '0')}-${String(1 + ((i + 15) % 28)).padStart(2, '0')}` : '',
            i % 10 < 7 ? `${400 + i} Broadway|${getCity(i + 3)}|${state || 'Ontario'}|${getZipCode(i + 3, country)}|${country}` : '',
            i % 10 < 7 ? 'State ID' : '',
            i % 10 < 7 ? `${getIDPrefix(false)}${String(400000 + i)}` : '',
            i % 10 < 7 ? country : '',
            i % 10 < 7 ? (state || '') : '',
            i % 10 < 7 ? `${20 + (i % 15)}` : '',
            i % 10 < 7 ? 'Co-Owner' : ''
          );
        }

        rows.push(row);
      }

      // Create workbook
      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clients");

      // Download
      XLSX.writeFile(wb, `NYLTA_Template_${template.count}_Clients.xlsx`);

      toast.success(`✅ Generated ${template.count} clients: ${template.monitoringCount} monitoring + ${template.filingCount} filing`);
    } catch (error) {
      console.error('Error generating CSV:', error);
      toast.error('Failed to generate template');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#00274E]">
        <CardHeader className="bg-[#00274E] text-white">
          <CardTitle className="text-2xl flex items-center gap-3">
            <FileSpreadsheet className="h-8 w-8" />
            CSV Template Generator
          </CardTitle>
          <CardDescription className="text-gray-200 mt-2">
            Download pre-filled CSV templates with different volumes for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.count} className="border-2 hover:border-[#00274E] transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {template.description}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p><strong>Monitoring:</strong> {template.monitoringCount} clients ($249 each)</p>
                        <p><strong>Filing:</strong> {template.filingCount} clients ($398 each)</p>
                        <p><strong>Purpose:</strong> {template.purpose}</p>
                      </div>
                      {template.count >= 25 && (
                        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mt-3">
                          <p className="text-sm text-yellow-800">
                            <strong>⚡ Volume Discount Testing:</strong> {template.count >= 25 && template.count < 76 && 'Tier 2 (5% off foreign filings)'}
                            {template.count >= 76 && template.count < 151 && 'Tier 3 (10% off foreign filings)'}
                            {template.count >= 151 && 'Tier 4 (15% off foreign filings)'}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => generateCSV(template)}
                      disabled={generating}
                      className="bg-[#00274E] hover:bg-[#003366] ml-4"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-300 rounded p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Template Details:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• All required fields pre-filled with realistic test data</li>
              <li>• Mix of disclosure and exemption filings</li>
              <li>• Includes Company Applicants and Beneficial Owners</li>
              <li>• Foreign entities included for volume discount testing</li>
              <li>• Ready to upload directly to the wizard</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions for realistic data generation
function getCompanyName(i: number): string {
  const prefixes = ['Acme', 'Global', 'Metro', 'Summit', 'Pinnacle', 'Vertex', 'Nexus', 'Zenith', 'Prime', 'Elite'];
  const types = ['Manufacturing', 'Tech', 'Consulting', 'Services', 'Holdings', 'Capital', 'Ventures', 'Solutions', 'Partners', 'Group'];
  return `${prefixes[i % prefixes.length]} ${types[(i * 3) % types.length]}`;
}

function getFirstName(i: number): string {
  const names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Jennifer', 
                 'William', 'Maria', 'Richard', 'Susan', 'Thomas', 'Patricia', 'Christopher', 'Linda', 'Daniel', 'Barbara'];
  return names[i % names.length];
}

function getLastName(i: number): string {
  const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                 'Wilson', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White'];
  return names[i % names.length];
}

function getCity(i: number): string {
  const cities = ['New York', 'Brooklyn', 'Manhattan', 'Queens', 'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Yonkers', 'White Plains'];
  return cities[i % cities.length];
}

function getZipCode(i: number, country: string): string {
  if (country === 'United States') {
    return `${10000 + (i % 900)}`;
  } else {
    return `M5H ${String(i % 10)}A${String(i % 10)}`;
  }
}

function getIDPrefix(isPassport: boolean): string {
  return isPassport ? 'PP' : 'DL';
}

function getExemptionCategory(i: number): string {
  const categories = [
    'Regulated financial institution',
    'Regulated insurance company',
    'SEC-registered investment adviser',
    'Large operating company',
    'Subsidiary of large operating company'
  ];
  return categories[i % categories.length];
}

function getExemptionExplanation(i: number): string {
  const explanations = [
    'Entity is a state-chartered bank regulated by the New York Department of Financial Services (NYDFS).',
    'Entity is licensed and regulated by the New York Department of Financial Services as an insurance company.',
    'Entity is registered with the Securities and Exchange Commission as an investment adviser.',
    'Entity has more than 20 full-time employees, physical office in US, and $5M+ gross receipts.',
    'Entity is wholly owned by a large operating company that meets all exemption criteria.'
  ];
  return explanations[i % explanations.length];
}
