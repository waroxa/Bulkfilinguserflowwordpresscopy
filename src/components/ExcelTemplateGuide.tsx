import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import * as XLSX from 'xlsx';

export default function ExcelTemplateGuide() {
  
  const generateExcelTemplate = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // ==================== SHEET 1: INSTRUCTIONS ====================
    const instructionsData = [
      ["NYLTA BULK FILING - EXCEL TEMPLATE INSTRUCTIONS"],
      [""],
      ["⚠️ CRITICAL UPDATE: FILING INTENT IS PER-CLIENT"],
      [""],
      ["Each row in the Client List represents a SINGLE client."],
      ["You must indicate whether each client is submitting:"],
      ['  • Beneficial ownership disclosure (Filing_Intent = "Disclosure"), OR'],
      ['  • Exemption attestation (Filing_Intent = "Exemption")'],
      [""],
      ["NYLTA.com records the information YOU provide."],
      ["NYLTA.com does NOT determine eligibility or exemption status."],
      [""],
      ["💡 TIP: Complete your Firm Profile FIRST for auto-matching!"],
      ["If you add authorized users in your firm profile, the system will automatically"],
      ["match and pre-fill their information when you enter their names in Company Applicants."],
      [""],
      ["📋 QUICK START GUIDE (5 STEPS)"],
      [""],
      ["Step 1: Complete your Firm Profile (includes authorized users)"],
      ["Step 2: Read This Instructions Tab (You are here!)"],
      ['Step 3: Go to the "Client List" tab and fill in your client information'],
      ["Step 4: Fill in Beneficial Owners OR Exemption Attestations AND Company Applicants"],
      ["Step 5: Review the Example Data tab for guidance"],
      ["Step 6: Save this file and upload it in the NYLTA bulk filing system"],
      [""],
      ["⚠️ IMPORTANT: Do NOT delete the header row (Row 1) in any tab"],
      ["⚠️ IMPORTANT: Save as .xlsx (Excel format) or .csv when uploading"],
      [""],
      [""],
      ["📊 SHEET-BY-SHEET BREAKDOWN"],
      [""],
      ["Sheet 1: Instructions (You are here)"],
      ["  - Read this first to understand the template"],
      [""],
      ["Sheet 2: Client List (PRIMARY DATA ENTRY)"],
      ["  - One row per client"],
      ["  - Filing_Intent field controls the workflow"],
      ['  - If "Disclosure" → Complete Beneficial Owners sheet'],
      ['  - If "Exemption" → Complete Exemption Attestations sheet'],
      [""],
      ["Sheet 3: Beneficial Owners (UP TO 9 PER CLIENT)"],
      ["  - ONLY required if Filing_Intent = Disclosure"],
      ["  - Each row = ONE beneficial owner"],
      ["  - Use Client_ID to link to Client List"],
      ["  - Up to 9 owners per client (Owner_Number 1-9)"],
      [""],
      ["Sheet 4: Exemption Attestations"],
      ["  - ONLY required if Filing_Intent = Exemption"],
      ["  - One row per client seeking exemption"],
      ["  - Must provide attestation details"],
      ["  - NYLTA.com does NOT validate exemption eligibility"],
      [""],
      ["Sheet 5: Company Applicants (EXACTLY 2 PER CLIENT - REQUIRED)"],
      ["  - REQUIRED for ALL clients (both Disclosure and Exemption)"],
      ["  - Exactly 2 applicants per client"],
      ["  - Applicant #1: Tiffany Colon (pre-filled)"],
      ["  - Applicant #2: Your firm representative (attorney/paralegal/staff)"],
      ["  - If name matches authorized user from firm profile, info auto-fills"],
      [""],
      ["Sheet 6: Example Data"],
      ["  - 10 fully completed examples"],
      ["  - Mix of Disclosure and Exemption filings"],
      ["  - Shows proper formatting and data entry"],
      ["  - Includes Company Applicants for all clients"],
      [""],
      [""],
      ["⚠️ COMMON MISTAKES TO AVOID"],
      [""],
      ["❌ Don't mix filing types - each client has ONE Filing_Intent"],
      ["❌ Don't skip the Filing_Intent field - it's required"],
      ["❌ Don't fill BOTH Beneficial Owners AND Exemptions for the same client"],
      ["❌ Don't use spaces in Client_ID - use numbers only (1, 2, 3...)"],
      ["❌ Don't exceed 9 beneficial owners per client"],
      ["❌ Don't skip Company Applicants - EXACTLY 2 required per client"],
      ["❌ Don't modify Applicant #1 (NYLTA) - it must remain as shown in examples"],
      [""],
      [""],
      ["📞 NEED HELP?"],
      ["Contact: support@nylta.com"],
      ["Phone: (555) 123-4567"]
    ];
    const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
    wsInstructions['!cols'] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

    // ==================== SHEET 2: CLIENT LIST ====================
    const clientListHeaders = [
      "Client_ID",
      "Legal_Business_Name",
      "NY_DOS_ID",
      "EIN_Status",
      "EIN",
      "Date_of_Formation",
      "State_of_Formation",
      "Country_of_Formation",
      "Filing_Intent",
      "Primary_Contact_Email",
      "Primary_Contact_Phone"
    ];
    const wsClientList = XLSX.utils.aoa_to_sheet([clientListHeaders]);
    wsClientList['!cols'] = [
      { wch: 12 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 18 }
    ];
    XLSX.utils.book_append_sheet(wb, wsClientList, "Client List");

    // ==================== SHEET 3: BENEFICIAL OWNERS ====================
    const beneficialOwnersHeaders = [
      "Client_ID",
      "Owner_Number",
      "Full_Legal_Name",
      "Date_of_Birth",
      "Street_Address",
      "City",
      "State",
      "Country",
      "Zip_Code",
      "Ownership_Percentage",
      "Title_or_Role",
      "ID_Type",
      "ID_Number",
      "Issuing_Country",
      "Issuing_State"
    ];
    const wsBeneficialOwners = XLSX.utils.aoa_to_sheet([beneficialOwnersHeaders]);
    wsBeneficialOwners['!cols'] = [
      { wch: 12 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 30 },
      { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 20 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, wsBeneficialOwners, "Beneficial Owners");

    // ==================== SHEET 4: EXEMPTION ATTESTATIONS ====================
    const exemptionHeaders = [
      "Client_ID",
      "Exemption_Category",
      "Explanation_of_Qualification",
      "Authorized_Signer_Name",
      "Signer_Title",
      "Attestation_Date",
      "Signature_Initials"
    ];
    const wsExemptions = XLSX.utils.aoa_to_sheet([exemptionHeaders]);
    wsExemptions['!cols'] = [
      { wch: 12 }, { wch: 35 }, { wch: 40 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 }
    ];
    XLSX.utils.book_append_sheet(wb, wsExemptions, "Exemption Attestations");

    // ==================== SHEET 5: COMPANY APPLICANTS ====================
    const companyApplicantHeaders = [
      "Client_ID",
      "Applicant_Number",
      "Full_Legal_Name",
      "Date_of_Birth",
      "Street_Address",
      "City",
      "State",
      "Country",
      "Zip_Code",
      "Role_Title",
      "ID_Type",
      "ID_Number",
      "Issuing_Country",
      "Issuing_State"
    ];
    const wsCompanyApplicants = XLSX.utils.aoa_to_sheet([companyApplicantHeaders]);
    wsCompanyApplicants['!cols'] = [
      { wch: 12 }, { wch: 18 }, { wch: 25 }, { wch: 15 }, { wch: 30 },
      { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 25 },
      { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, wsCompanyApplicants, "Company Applicants");

    // ==================== SHEET 6: EXAMPLE DATA ====================
    const exampleInstructions = [
      ["EXAMPLE DATA - 10 FULLY COMPLETED CLIENTS"],
      [""],
      ["This sheet shows 10 complete examples demonstrating:"],
      ["  • 5 Disclosure filings (with beneficial owners)"],
      ["  • 5 Exemption filings (with attestations)"],
      ["  • Proper Client_ID linking"],
      ["  • Various owner counts (1-9)"],
      ["  • Edge cases (EIN pending, complex structures)"],
      [""],
      ["Use these as templates for your own data entry."],
      [""],
      [""],
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
      [""],
      ["EXAMPLE BENEFICIAL OWNERS (for Disclosure clients only):"],
      ["Client_ID", "Owner_Number", "Full_Legal_Name", "Date_of_Birth", "Street_Address", "City", "State", "Country", "Zip_Code", "Ownership_Percentage", "Title_or_Role", "ID_Type", "ID_Number", "Issuing_Country", "Issuing_State"],
      // Client 1 - Acme Holdings (3 owners)
      [1, 1, "John Michael Smith", "05/15/1975", "123 Main Street", "New York", "NY", "United States", "10001", "45", "CEO", "Driver's License", "S123456789", "United States", "NY"],
      [1, 2, "Sarah Elizabeth Johnson", "08/22/1980", "456 Park Avenue", "Brooklyn", "NY", "United States", "11201", "35", "CFO", "Passport", "P987654321", "United States", ""],
      [1, 3, "Robert James Williams", "11/03/1978", "789 Broadway", "Queens", "NY", "United States", "11375", "20", "COO", "Driver's License", "S987654321", "United States", "NY"],
      // Client 2 - Smith Ventures (2 owners)
      [2, 1, "David Michael Smith", "03/10/1982", "321 Fifth Avenue", "Manhattan", "NY", "United States", "10016", "60", "Managing Partner", "Passport", "P123456789", "United States", ""],
      [2, 2, "Jennifer Anne Smith", "07/18/1985", "321 Fifth Avenue", "Manhattan", "NY", "United States", "10016", "40", "Partner", "Driver's License", "S234567890", "United States", "NY"],
      // Client 3 - Global Tech (6 owners)
      [3, 1, "Michael Chen", "12/05/1970", "555 Tech Boulevard", "Albany", "NY", "United States", "12207", "25", "Founder & CEO", "Passport", "P111222333", "United States", ""],
      [3, 2, "Lisa Marie Rodriguez", "04/20/1983", "100 Innovation Drive", "Rochester", "NY", "United States", "14604", "20", "CTO", "Driver's License", "S444555666", "United States", "NY"],
      [3, 3, "James Patrick O'Brien", "09/15/1976", "200 Market Street", "Buffalo", "NY", "United States", "14202", "15", "VP Engineering", "Passport", "P777888999", "United States", ""],
      [3, 4, "Amanda Sue Thompson", "06/30/1988", "300 Commerce Plaza", "Syracuse", "NY", "United States", "13202", "15", "VP Operations", "Driver's License", "S000111222", "United States", "NY"],
      [3, 5, "Kevin Robert Martinez", "02/12/1981", "400 Business Park", "Yonkers", "NY", "United States", "10701", "15", "VP Sales", "State ID", "I333444555", "United States", "NY"],
      [3, 6, "Patricia Ann Lee", "10/25/1979", "500 Corporate Center", "White Plains", "NY", "United States", "10601", "10", "General Counsel", "Passport", "P666777888", "United States", ""],
      // Client 4 - Sunrise (9 owners - maximum allowed)
      [4, 1, "Thomas Edward Brown", "01/08/1990", "100 Sunrise Lane", "New York", "NY", "United States", "10002", "15", "Managing Member", "Driver's License", "S111111111", "United States", "NY"],
      [4, 2, "Elizabeth Grace Davis", "05/22/1987", "200 Morning Drive", "Brooklyn", "NY", "United States", "11202", "14", "Member", "Passport", "P222222222", "United States", ""],
      [4, 3, "Christopher John Wilson", "08/14/1992", "300 Dawn Avenue", "Queens", "NY", "United States", "11376", "13", "Member", "Driver's License", "S333333333", "United States", "NY"],
      [4, 4, "Michelle Anne Taylor", "11/30/1989", "400 Daybreak Street", "Bronx", "NY", "United States", "10451", "12", "Member", "State ID", "I444444444", "United States", "NY"],
      [4, 5, "Daniel Paul Anderson", "03/17/1991", "500 First Light Road", "Staten Island", "NY", "United States", "10301", "11", "Member", "Passport", "P555555555", "United States", ""],
      [4, 6, "Rachel Marie Thomas", "07/09/1986", "600 Early Bird Court", "New Rochelle", "NY", "United States", "10801", "11", "Member", "Driver's License", "S666666666", "United States", "NY"],
      [4, 7, "Matthew Scott Jackson", "12/21/1993", "700 Morning Glory Way", "Mount Vernon", "NY", "United States", "10550", "9", "Member", "Passport", "P777777777", "United States", ""],
      [4, 8, "Nicole Lynn White", "04/04/1988", "800 Sunrise Circle", "Yonkers", "NY", "United States", "10702", "8", "Member", "Driver's License", "S888888888", "United States", "NY"],
      [4, 9, "Ryan Patrick Harris", "09/26/1994", "900 Dawn Plaza", "White Plains", "NY", "United States", "10602", "7", "Member", "State ID", "I999999999", "United States", "NY"],
      // Client 5 - Metropolitan (1 owner - simple case)
      [5, 1, "William Charles Metropolitan", "02/28/1965", "1000 Metropolitan Avenue", "New York", "NY", "United States", "10003", "100", "Sole Owner", "Passport", "P000000000", "United States", ""],
      [""],
      [""],
      ["EXAMPLE EXEMPTION ATTESTATIONS (for Exemption clients only):"],
      ["Client_ID", "Exemption_Category", "Explanation_of_Qualification", "Authorized_Signer_Name", "Signer_Title", "Attestation_Date", "Signature_Initials"],
      [6, "Bank", "Entity operates as a federally chartered bank under OCC supervision", "Henry J. Morrison", "Chief Compliance Officer", "12/31/2024", "HJM"],
      [7, "Insurance company", "Licensed insurance company operating under NY Department of Financial Services regulation", "Susan K. Patterson", "General Counsel", "12/31/2024", "SKP"],
      [8, "Accounting firm", "Public accounting firm registered with PCAOB and licensed by NY State Board of Accountancy", "Richard T. Henderson", "Managing Partner", "12/31/2024", "RTH"],
      [9, "Public utility", "Regulated public utility providing essential services under NY Public Service Commission oversight", "Margaret L. Foster", "VP Regulatory Affairs", "12/31/2024", "MLF"],
      [10, "Tax-exempt entity", "501(c)(3) charitable organization recognized by IRS with public charity status", "Dr. Jonathan M. Weber", "Executive Director", "12/31/2024", "JMW"],
      [""],
      [""],
      ["EXAMPLE COMPANY APPLICANTS (2 per client - REQUIRED FOR ALL CLIENTS):"],
      ["Client_ID", "Applicant_Number", "Full_Legal_Name", "Date_of_Birth", "Street_Address", "City", "State", "Country", "Zip_Code", "Role_Title", "ID_Type", "ID_Number", "Issuing_Country", "Issuing_State"],
      // Applicant 1 is always Tiffany Colon, Applicant 2 is from firm
      [1, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [1, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [2, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [2, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [3, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [3, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [4, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [4, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [5, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [5, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [6, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [6, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [7, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [7, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [8, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [8, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [9, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [9, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"],
      [10, 1, "Tiffany Colon", "01/01/1990", "123 Filing Center Drive", "Albany", "New York", "United States", "12207", "NYLTA Authorized Filing Agent", "SSN", "XXX-XX-XXXX", "United States", "NY"],
      [10, 2, "Jennifer Martinez", "06/15/1985", "100 Law Plaza", "New York", "NY", "United States", "10005", "Senior Attorney", "Driver's License", "M123456789", "United States", "NY"]
    ];
    
    const wsExamples = XLSX.utils.aoa_to_sheet(exampleInstructions);
    wsExamples['!cols'] = [
      { wch: 12 }, { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
      { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 18 },
      { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 }
    ];
    XLSX.utils.book_append_sheet(wb, wsExamples, "Example Data");

    // Generate Excel file and trigger download
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'NYLTA_Bulk_Filing_Template.xlsx';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <FileSpreadsheet className="h-10 w-10 text-[#00274E]" />
            <div>
              <h1 className="text-gray-900 text-3xl">Excel Template Guide</h1>
              <p className="text-gray-600 mt-1">NYLTA Bulk Filing Template Structure</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Download Section */}
        <Card className="mb-8 border-2 border-[#00274E]">
          <CardHeader className="bg-[#00274E] text-white">
            <CardTitle className="flex items-center gap-2">
              <Download className="h-6 w-6" />
              Download Template
            </CardTitle>
            <CardDescription className="text-gray-200">
              Get the official NYLTA bulk filing Excel template
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>File Name:</strong> NYLTA_Bulk_Filing_Template_v1.xlsx
                </p>
                <p className="text-sm text-gray-600">
                  Compatible with Microsoft Excel 2016+ and Google Sheets
                </p>
              </div>
              <Button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#00274E]" onClick={generateExcelTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Overview */}
        <Card className="mb-8">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle>Template Overview</CardTitle>
            <CardDescription>
              The Excel template contains 5 sheets designed for efficient bulk filing data entry
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                {
                  name: "1. Instructions (Read Me First)",
                  description: "Complete usage guide, field definitions, and validation rules",
                  icon: "📖",
                  color: "bg-blue-50 border-blue-200"
                },
                {
                  name: "2. Client List (Primary Data Entry)",
                  description: "Main sheet for entering all client companies with basic information",
                  icon: "📋",
                  color: "bg-green-50 border-green-200"
                },
                {
                  name: "3. Beneficial Owners (UP TO 9 PER CLIENT)",
                  description: "Enter beneficial owner details for non-exempt clients (up to 9 per client)",
                  icon: "👥",
                  color: "bg-purple-50 border-purple-200"
                },
                {
                  name: "4. Exemption Attestations (Conditional)",
                  description: "Complete exemption categories and attestations for exempt clients",
                  icon: "✓",
                  color: "bg-yellow-50 border-yellow-200"
                },
                {
                  name: "5. Example Data (10 Fully Completed Clients)",
                  description: "Sample data showing both exempt and non-exempt filing scenarios",
                  icon: "💡",
                  color: "bg-gray-50 border-gray-200"
                }
              ].map((sheet, index) => (
                <div key={index} className={`border ${sheet.color} p-4`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{sheet.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-1">{sheet.name}</h3>
                      <p className="text-sm text-gray-600">{sheet.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sheet 1: Instructions */}
        <Card className="mb-8">
          <CardHeader className="bg-blue-50 border-b border-blue-200">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              Sheet 1: Instructions (Read Me First)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-[#00274E] mb-2">Contents:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li><strong>Template Version & Last Updated Date</strong></li>
                  <li><strong>Quick Start Guide:</strong> 5-step process overview</li>
                  <li><strong>Field Definitions:</strong> Complete list of all fields with descriptions</li>
                  <li><strong>Data Validation Rules:</strong> Required formats, character limits, acceptable values</li>
                  <li><strong>Filing Type Decision Tree:</strong> How to determine if a client should file for disclosure or exemption</li>
                  <li><strong>Common Errors & Solutions:</strong> Troubleshooting guide</li>
                  <li><strong>Support Contact Information</strong></li>
                </ul>
              </div>
              
              <Alert className="bg-blue-50 border-blue-300">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>Important:</strong> Please read the Instructions sheet completely before entering any data.
                  It contains critical information about filing requirements and data formats.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Sheet 2: Client List */}
        <Card className="mb-8">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Sheet 2: Client List (PRIMARY DATA ENTRY)
            </CardTitle>
            <CardDescription className="text-gray-700">
              Mirrors Step 1 (Upload) + Step 2 (Company Applicant) + Filing Intent Decision
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="mb-6 bg-red-50 border-red-300">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900">
                <strong>CRITICAL:</strong> Filing_Intent controls which additional sheets must be completed. 
                This field determines whether the client goes through Disclosure (beneficial ownership) or Exemption (attestation) workflow.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="text-[#00274E] mb-3">Column Structure:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-[#00274E] text-white">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-left">Column</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Field Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Required?</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Format/Validation</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">A</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Client_ID</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Unique number (1, 2, 3...)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">B</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Legal_Business_Name</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Text (max 200 characters)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">C</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>NY_DOS_ID</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">7 digits (e.g., 1234567)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">D</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>EIN_Status</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Dropdown: "Has EIN" / "Waiting for EIN"</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">E</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>EIN</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Conditional</td>
                        <td className="border border-gray-300 px-3 py-2">XX-XXXXXXX (required if EIN_Status = "Has EIN")</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">F</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Date_of_Formation</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">MM/DD/YYYY</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">G</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>State_of_Formation</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">2-letter state code (e.g., NY, DE, CA)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">H</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Country_of_Formation</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">Default: "United States"</td>
                      </tr>
                      <tr className="bg-yellow-50 border-2 border-yellow-400">
                        <td className="border border-gray-300 px-3 py-2">I</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Filing_Intent</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Dropdown: "Disclosure" / "Exemption"</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">J</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Primary_Contact_Email</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">Valid email format</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">K</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Primary_Contact_Phone</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">(XXX) XXX-XXXX</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-400 border-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <AlertDescription className="text-yellow-900">
                  <strong>Filing_Intent Logic:</strong><br/>
                  • If <strong>"Disclosure"</strong> → Sheet 3 (Beneficial Owners) is REQUIRED<br/>
                  • If <strong>"Exemption"</strong> → Sheet 4 (Exemption Attestations) is REQUIRED<br/>
                  <br/>
                  This field controls the entire workflow for each client.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Sheet 3: Beneficial Owners */}
        <Card className="mb-8">
          <CardHeader className="bg-purple-50 border-b border-purple-200">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Sheet 3: Beneficial Owners (UP TO 9 PER CLIENT)
            </CardTitle>
            <CardDescription className="text-gray-700">
              Mirrors Step 5 – Beneficial Owners (Disclosure Filing Path)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="mb-6 bg-purple-50 border-purple-300">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              <AlertDescription className="text-purple-900">
                <strong>ONLY REQUIRED if Filing_Intent = "Disclosure"</strong><br/>
                Each row represents ONE beneficial owner. Use multiple rows with the same Client_ID to add multiple beneficial owners (up to 9 per client).
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="text-[#00274E] mb-3">Column Structure (Per Beneficial Owner):</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-[#00274E] text-white">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-left">Column</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Field Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Required?</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Format/Options</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">A</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Client_ID</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Must match Client_ID from Sheet 2</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">B</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Owner_Number</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">1–9 (identifies which owner this is)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">C</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Full_Legal_Name</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">First Middle Last</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">D</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Date_of_Birth</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">MM/DD/YYYY</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">E</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Street_Address</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Residential address</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">F</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>City</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Text</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">G</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>State</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">2-letter state code or N/A</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">H</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Country</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Full country name</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">I</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Zip_Code</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">5 or 9 digits (US) or postal code</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">J</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Ownership_Percentage</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">Numeric (0-100)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">K</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Title_or_Role</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Optional</td>
                        <td className="border border-gray-300 px-3 py-2">E.g., "CEO", "Managing Member"</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">L</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>ID_Type</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Dropdown: Passport / Driver's License / State ID</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">M</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>ID_Number</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Alphanumeric</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">N</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Issuing_Country</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Full country name</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">O</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Issuing_State</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Conditional</td>
                        <td className="border border-gray-300 px-3 py-2">Required for US Driver's License/State ID</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-purple-50 border-2 border-purple-400 p-4">
                <h4 className="text-[#00274E] mb-2">📌 Critical Usage Notes:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li><strong>Each row = ONE beneficial owner</strong></li>
                  <li><strong>Up to 9 beneficial owners</strong> allowed per Client_ID</li>
                  <li><strong>Use multiple rows</strong> with the same Client_ID to add multiple beneficial owners</li>
                  <li><strong>Owner_Number</strong> field identifies which owner this is (1-9)</li>
                  <li><strong>ONLY required for clients with Filing_Intent = "Disclosure"</strong></li>
                  <li><strong>Leave completely blank</strong> for clients with Filing_Intent = "Exemption"</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-300 p-4">
                <h4 className="text-[#00274E] mb-2">📝 Example: Client with 3 Beneficial Owners</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Row 1:</strong> Client_ID = 1, Owner_Number = 1, Full_Legal_Name = "John Smith", ...</p>
                  <p><strong>Row 2:</strong> Client_ID = 1, Owner_Number = 2, Full_Legal_Name = "Jane Doe", ...</p>
                  <p><strong>Row 3:</strong> Client_ID = 1, Owner_Number = 3, Full_Legal_Name = "Robert Johnson", ...</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sheet 4: Exemption Attestations */}
        <Card className="mb-8">
          <CardHeader className="bg-yellow-50 border-b border-yellow-200">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              Sheet 4: Exemption Attestations (Conditional)
            </CardTitle>
            <CardDescription className="text-gray-700">
              Mirrors Step 4 – Exemption Category (Exemption Filing Path)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="mb-6 bg-yellow-50 border-yellow-300">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <AlertDescription className="text-yellow-900">
                <strong>ONLY REQUIRED if Filing_Intent = "Exemption"</strong><br/>
                Each row represents ONE exemption attestation. NYLTA.com records the information but does not validate eligibility.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h4 className="text-[#00274E] mb-3">Column Structure:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-[#00274E] text-white">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-left">Column</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Field Name</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Required?</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Format/Options</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">A</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Client_ID</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Must match Client_ID from Sheet 2</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">B</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Exemption_Category</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Dropdown: 23 exemption categories</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">C</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Explanation_of_Qualification</strong></td>
                        <td className="border border-gray-300 px-3 py-2">Conditional</td>
                        <td className="border border-gray-300 px-3 py-2">Text (max 500 chars) - required if "Other"</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">D</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Authorized_Signer_Name</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Full name of person attesting</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">E</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Signer_Title</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Title of attesting party (e.g., "CPA", "Attorney")</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">F</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Attestation_Date</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">MM/DD/YYYY (date of attestation)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">G</td>
                        <td className="border border-gray-300 px-3 py-2"><strong>Signature_Initials</strong></td>
                        <td className="border border-gray-300 px-3 py-2"><span className="text-red-600">Required</span></td>
                        <td className="border border-gray-300 px-3 py-2">Initials (e.g., "JS" for John Smith)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-300 p-4">
                <h4 className="text-[#00274E] mb-2">⚠️ IMPORTANT DISCLAIMER:</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Exemption filing must behave exactly like the wizard:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Client selects Filing_Intent = "Exemption"</li>
                  <li>Beneficial Owner sheet is NOT required</li>
                  <li>Exemption Attestation sheet IS required</li>
                  <li>Client affirms eligibility via attestation fields</li>
                  <li><strong>NYLTA.com records the information but does not validate eligibility</strong></li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 p-4">
                <h4 className="text-[#00274E] mb-2">📋 Exemption Categories (Dropdown Options):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Securities reporting issuer</li>
                    <li>Governmental authority</li>
                    <li>Bank</li>
                    <li>Credit union</li>
                    <li>Depository institution holding company</li>
                    <li>Money services business</li>
                    <li>Broker or dealer in securities</li>
                    <li>Securities exchange or clearing agency</li>
                    <li>Investment company or adviser</li>
                    <li>Venture capital fund adviser</li>
                    <li>Insurance company</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1">
                    <li>State-licensed insurance producer</li>
                    <li>Commodity Exchange Act entity</li>
                    <li>Accounting firm</li>
                    <li>Public utility</li>
                    <li>Financial market utility</li>
                    <li>Pooled investment vehicle</li>
                    <li>Tax-exempt entity</li>
                    <li>Entity assisting tax-exempt entity</li>
                    <li>Large operating company</li>
                    <li>Subsidiary of certain exempt entities</li>
                    <li>Inactive entity</li>
                    <li>Other (requires explanation)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sheet 5: Example Data */}
        <Card className="mb-8">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Sheet 5: Example Data (10 Fully Completed Clients)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-gray-700">
                This sheet contains 10 complete example records demonstrating both filing types:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4">
                  <h4 className="text-[#00274E] mb-2">📋 5 Disclosure Examples</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Single beneficial owner</li>
                    <li>• Multiple beneficial owners</li>
                    <li>• Different ID types (Passport, DL, State ID)</li>
                    <li>• Domestic and foreign owners</li>
                    <li>• Company applicant variations</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 p-4">
                  <h4 className="text-[#00274E] mb-2">✓ 5 Exemption Examples</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Large operating company</li>
                    <li>• Tax-exempt entity</li>
                    <li>• Inactive entity</li>
                    <li>• Securities reporting issuer</li>
                    <li>• Other (with explanation)</li>
                  </ul>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-300">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>Best Practice:</strong> Review the example data before entering your own. 
                  It demonstrates proper formatting and shows how different scenarios should be handled.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Data Validation & Error Prevention */}
        <Card className="mb-8">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle>Built-in Data Validation & Error Prevention</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="text-[#00274E]">✅ Dropdown Lists:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Filing Type (Disclosure/Exemption)</li>
                  <li>• Exemption Categories (23 options)</li>
                  <li>• ID Types (Passport/DL/State ID)</li>
                  <li>• States (2-letter codes)</li>
                  <li>• Countries (ISO codes)</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-[#00274E]">✅ Format Validation:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• EIN format (XX-XXXXXXX)</li>
                  <li>• SSN format (XXX-XX-XXXX)</li>
                  <li>• Date format (MM/DD/YYYY)</li>
                  <li>• Email validation</li>
                  <li>• ZIP code validation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips for Success */}
        <Card className="mb-8 border-2 border-green-500">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Tips for Successful Bulk Filing
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <p className="text-sm text-gray-700">
                  <strong>Start with Sheet 1 (Instructions)</strong> - Read all field definitions and validation rules before entering data
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <p className="text-sm text-gray-700">
                  <strong>Review Example Data (Sheet 5)</strong> - Study the examples to understand proper formatting
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <p className="text-sm text-gray-700">
                  <strong>Complete Client List first</strong> - Enter all clients in Sheet 2 before moving to Sheets 3 or 4
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">4.</span>
                <p className="text-sm text-gray-700">
                  <strong>Use dropdown menus</strong> - Don't type values that have dropdowns (Filing Type, Exemption Categories, etc.)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">5.</span>
                <p className="text-sm text-gray-700">
                  <strong>Double-check Client IDs</strong> - Ensure Client IDs match exactly between Sheet 2 and Sheets 3/4
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 font-bold">6.</span>
                <p className="text-sm text-gray-700">
                  <strong>Save frequently</strong> - Use "Save As" to create backup copies during data entry
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="border-2 border-[#00274E]">
          <CardHeader className="bg-[#00274E] text-white">
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-700 mb-4">
              If you encounter issues with the template or have questions about data entry:
            </p>
            <div className="space-y-2 text-sm text-gray-700">
              <p>📧 <strong>Email:</strong> support@nylta.com</p>
              <p>📞 <strong>Phone:</strong> (555) 123-4567</p>
              <p>💬 <strong>Live Chat:</strong> Available Mon-Fri 9am-5pm EST</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}