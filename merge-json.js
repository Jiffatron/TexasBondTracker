// Simple script to merge multiple JSON files
// Usage: node merge-json.js

const fs = require('fs');
const path = require('path');

// Configuration
const dataDir = './client/public/data';
const outputFiles = {
  bonds: 'bonds.json',
  municipalities: 'municipalities.json', 
  activities: 'activities.json'
};

// Function to merge JSON files by pattern
function mergeJsonFiles(pattern, outputFile) {
  const files = fs.readdirSync(dataDir)
    .filter(file => file.includes(pattern) && file.endsWith('.json'))
    .filter(file => file !== outputFile); // Don't include the output file itself

  console.log(`Merging ${pattern} files:`, files);

  let mergedData = [];
  
  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (Array.isArray(data)) {
      mergedData = mergedData.concat(data);
    } else {
      console.warn(`Warning: ${file} is not an array, skipping`);
    }
  });

  // Write merged data
  const outputPath = path.join(dataDir, outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2));
  console.log(`✅ Merged ${mergedData.length} items into ${outputFile}`);
}

// Example usage:
// This will merge all files containing "bonds" into bonds.json
// mergeJsonFiles('bonds', outputFiles.bonds);

// This will merge all files containing "municipal" into municipalities.json  
// mergeJsonFiles('municipal', outputFiles.municipalities);

console.log('JSON Merger Ready!');
console.log('Uncomment the lines above to merge files');
