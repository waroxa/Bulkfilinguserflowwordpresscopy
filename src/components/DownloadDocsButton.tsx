import { FileDown, FileText } from "lucide-react";
import { useState } from "react";

/**
 * Download Documentation Button Component
 * 
 * Add this to your Admin Dashboard to allow downloading all documentation files
 */
export default function DownloadDocsButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // List of all documentation files
      const docFiles = [
        { 
          path: '/docs/account-creation-system.md', 
          name: 'Account-Creation-System.md' 
        },
        { 
          path: '/guidelines/TEAM-ACCESS-ROLES.md', 
          name: 'Team-Access-Roles.md' 
        },
        { 
          path: '/guidelines/ADMIN-DASHBOARD-FEATURES.md', 
          name: 'Admin-Dashboard-Features.md' 
        },
      ];

      let combinedContent = '# NYLTA.com Complete Documentation Archive\n\n';
      combinedContent += `Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
      combinedContent += `Total Files: ${docFiles.length}\n\n`;
      combinedContent += '---\n\n';

      // Fetch and combine all files
      for (const doc of docFiles) {
        try {
          const response = await fetch(doc.path);
          if (response.ok) {
            const content = await response.text();
            combinedContent += `\n\n# FILE: ${doc.name}\n`;
            combinedContent += '='.repeat(80) + '\n\n';
            combinedContent += content;
            combinedContent += '\n\n' + '='.repeat(80) + '\n';
          }
        } catch (error) {
          console.warn(`⚠️ Could not fetch ${doc.path}:`, error);
          combinedContent += `\n\n# FILE: ${doc.name} (ERROR)\n`;
          combinedContent += '='.repeat(80) + '\n\n';
          combinedContent += `Error loading file: ${error}\n\n`;
        }
      }

      // Create and download the combined file
      const timestamp = new Date().toISOString().split('T')[0];
      const blob = new Blob([combinedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NYLTA-Documentation-${timestamp}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`✅ Downloaded combined documentation (${docFiles.length} files merged)`);
    } catch (error) {
      console.error('❌ Error downloading documentation:', error);
      alert('Failed to download documentation. Please check console for details.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 px-4 py-2 bg-[#00274E] text-white hover:bg-[#003d73] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title="Download all documentation files as a single Markdown file"
    >
      {isDownloading ? (
        <>
          <FileDown className="w-4 h-4 animate-pulse" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <FileText className="w-4 h-4" />
          <span>Download All Docs</span>
        </>
      )}
    </button>
  );
}
