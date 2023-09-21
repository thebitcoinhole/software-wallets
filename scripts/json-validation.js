const fs = require('fs');
const jsonlint = require('jsonlint');

function validateJsonFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const parsedJson = jsonlint.parse(fileContent);
    if (JSON.stringify(parsedJson, null, 2) === fileContent) {
      console.log(`JSON file '${filePath}' is valid and well-formatted.`);
    } else {
      console.error(`Error in JSON file '${filePath}': The JSON is not well-formatted.`);
      process.exit(1); // Exit with a non-zero status code
    }
  } catch (error) {
    console.error(`Error in JSON file '${filePath}':`, error.message);
    process.exit(1); // Exit with a non-zero status code
  }
}

// Specify the directory where your JSON files are located
const directoryPath = '../items';

// Get a list of all JSON files in the directory
fs.readdirSync(directoryPath).forEach((fileName) => {
  if (fileName.endsWith('.json')) {
    const filePath = `${directoryPath}/${fileName}`;
    validateJsonFile(filePath);
  }
});
