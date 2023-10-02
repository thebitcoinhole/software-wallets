require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const itemId = process.argv[2];
const changelogUrl = process.argv[3];

var latestVersion
var latestReleaseDate

axios
  .get(changelogUrl)
  .then((response) => {
    var body = response.data
    // Split the content into lines
    const lines = body.split('\n');

    // # Release 4.4.6 (August 18, 2023) (security update)
    // Find the first line starting with "#"
    const regex = /^# Release ([\d.]+) \(([^)]+)\)/;
    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            latestVersion = "v" + match[1];
            latestReleaseDate = formatDate(match[2]);
            break;
        }
    }

    console.log(`Sanitized version: ${latestVersion}`);
    console.log(`Release Date: ${latestReleaseDate}`);
    updateJson(itemId, latestVersion, latestReleaseDate);

  })
  .catch((error) => {
    console.error('Error fetching release information:', error.message);
    process.exit(1);
  });

function formatDate(inputDate) {
    // Create a Date object from the input string
    const date = new Date(inputDate);

    // Define an array of month names
    const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Get the month, day, and year components from the Date object
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Create the formatted date string
    return `${month} ${day}, ${year}`;
  }

function updateJson(itemId, latestVersion, latestReleaseDate) {
    // Define the path to your JSON file.
    const filePath = `../items/${itemId}.json`;

    // Read the JSON file.
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            process.exit(1);
            return;
        }

        try {
            const wallet = JSON.parse(data);
            var modifyJson = false

            console.log("Updating hardware wallet firmware")

            var currentVersion = wallet["firmware"]["latest-version"].value
            console.log("Current version found: " + currentVersion)
            if (latestVersion !== currentVersion) {
                wallet["firmware"]["latest-version"].value = latestVersion
                modifyJson = true
            }
            
            var currentReleaseDate = wallet["firmware"]["latest-release-date"].value
            if (latestReleaseDate !== currentReleaseDate) {
                wallet["firmware"]["latest-release-date"].value = latestReleaseDate
                modifyJson = true
            }
            console.log("Current Release date found: " + currentReleaseDate)

            if (modifyJson) {
                // Convert the modified object back to a JSON string.
                const updatedJsonString = JSON.stringify(wallet, null, 2);

                // Write the updated JSON string back to the file.
                fs.writeFile(filePath, updatedJsonString, (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing JSON file:', writeErr);
                    } else {
                        console.log('JSON file updated successfully.');
                    }
                });
            }

        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            process.exit(1);
        }
    });
}
