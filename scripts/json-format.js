const fs = require('fs');
const path = require('path');

function formatJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const parsedJson = JSON.parse(fileContent);
    const formattedJson = JSON.stringify(parsedJson, null, 2);
    fs.writeFileSync(filePath, formattedJson);
  } catch (error) {
    console.error(`Error in JSON file '${filePath}':`, error.message);
  }
}

// Specify the directory where your JSON files are located
const directoryPath = '../items';

// Get a list of all JSON files in the directory
fs.readdirSync(directoryPath).forEach((fileName) => {
  const filePath = path.join(directoryPath, fileName);
  if (fileName.endsWith('.json')) {
    formatJsonFile(filePath);
  }
});