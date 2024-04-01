require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const itemId = process.argv[2];
const changelogUrl = process.argv[3];
const platforms = process.argv[4];

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
    var regex = /^# Release ([\d.]+) \(([^)]+)\)/;
    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            latestVersion = "v" + match[1];
            latestReleaseDate = formatDate(match[2]);
            break;
        }
    }

    // ## [51.5] - 2023-12-22
    regex = /^## \[([\d.]+)\] - (\d{4}-\d{2}-\d{2})/;
    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            latestVersion = "v" + match[1];
            latestReleaseDate = formatDate(match[2]);
            break;
        }
    }

    if (latestVersion != undefined) {
        console.log(`Sanitized version: ${latestVersion}`);
    } else  {
        console.error("latestVersion not found")
        process.exit(1);
    }

    if (latestReleaseDate != undefined) {
        console.log(`Release Date: ${latestReleaseDate}`);
    } else  {
        console.error("latestReleaseDate not found")
        process.exit(1);
    }
    
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
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

    // Get the month, day, and year components from the Date object
    const month = months[date.getMonth()];
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
        }

        try {
            const wallet = JSON.parse(data);
            var modifyJson = false

            // TODO For Bluewallet, some versions are not for all the platforms. Inspect the assets to see which platform to update

            platforms.split(',').forEach(platform => {
                var currentVersion = wallet[`${platform}-support`][`${platform}-latest-version`].value
                console.log("Current version found: " + currentVersion)

                var currentReleaseDate = wallet[`${platform}-support`][`${platform}-latest-release-date`].value
                console.log("Current Release date found: " + currentReleaseDate)
                
                if (latestVersion !== currentVersion) {
                    wallet[`${platform}-support`][`${platform}-latest-version`].value = latestVersion
                    wallet[`${platform}-support`][`${platform}-latest-release-date`].value= latestReleaseDate
                    modifyJson = true
                }
            });

            if (modifyJson) {
                console.log("Updating JSON")

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
