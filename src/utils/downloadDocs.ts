/**
 * Documentation Download Utility
 * 
 * This utility helps download all documentation files as a bundle.
 * Usage: Call downloadAllDocs() from browser console or add a button in the UI
 */

interface DocFile {
  path: string;
  name: string;
  content: string;
}

/**
 * Downloads all documentation files as individual files
 * Browser will prompt to save each file
 */
export async function downloadAllDocsIndividually() {
  const docFiles = await fetchAllDocFiles();
  
  for (const doc of docFiles) {
    downloadFile(doc.content, doc.name, 'text/markdown');
    // Add delay to avoid browser blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`✅ Downloaded ${docFiles.length} documentation files`);
}

/**
 * Creates a text file with all documentation combined
 */
export async function downloadCombinedDocs() {
  const docFiles = await fetchAllDocFiles();
  
  let combinedContent = '# NYLTA.com Complete Documentation Archive\n\n';
  combinedContent += `Generated: ${new Date().toISOString()}\n`;
  combinedContent += `Total Files: ${docFiles.length}\n\n`;
  combinedContent += '---\n\n';
  
  for (const doc of docFiles) {
    combinedContent += `\n\n# FILE: ${doc.path}\n`;
    combinedContent += '='.repeat(80) + '\n\n';
    combinedContent += doc.content;
    combinedContent += '\n\n' + '='.repeat(80) + '\n';
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(combinedContent, `NYLTA-Documentation-${timestamp}.md`, 'text/markdown');
  
  console.log(`✅ Downloaded combined documentation (${docFiles.length} files merged)`);
}

/**
 * Fetches all documentation files from the project
 */
async function fetchAllDocFiles(): Promise<DocFile[]> {
  const docs: DocFile[] = [];
  
  // List of all documentation files
  const docPaths = [
    '/docs/account-creation-system.md',
    '/guidelines/TEAM-ACCESS-ROLES.md',
    '/guidelines/ADMIN-DASHBOARD-FEATURES.md',
  ];
  
  for (const path of docPaths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        const content = await response.text();
        const name = path.split('/').pop() || 'unknown.md';
        docs.push({ path, name, content });
      }
    } catch (error) {
      console.warn(`⚠️ Could not fetch ${path}:`, error);
    }
  }
  
  return docs;
}

/**
 * Triggers browser download for a file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
