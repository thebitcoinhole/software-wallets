require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const itemId = process.argv[2];
const platforms = process.argv[3];
const changelogUrl = process.argv[4];
const owner = process.argv[5];
const repo = process.argv[6];
const tag = process.argv[7];
const latestRelease = process.argv[8];
const allReleases = process.argv[9];
const allReleasesInclude = process.argv[10];
const allReleasesExclude = process.argv[11];
const assetsMatch = process.argv[12];

const githubApiKey = process.env.GITHUB_TOKEN

const longMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

var headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${githubApiKey}`,
  };
var apiUrl 
if (tag == "true") {
    apiUrl = `https://api.github.com/repos/${owner}/${repo}/tags`;
} else if (latestRelease == "true") {
    apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
} else if (allReleases == "true") {
    apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases`;
} else if (changelogUrl != "null") {
    apiUrl = changelogUrl
    headers = {}
} else {
    console.error('Not defined api url to use');
    process.exit(1);
}

const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
var latestVersion
var latestReleaseDate
// var assetFileNames = [];

axios
  .get(apiUrl, { headers })
  .then((response) => {

    // var assets = []
    var body = ""
    if (latestRelease == "true") {
        console.log("Using latest releases API")
        body = response.data.body

        latestReleaseDate = getDate(response.data.published_at)
        //assets = response.data.assets
        latestVersion = response.data.name.trim()
        console.log("Release name: " + latestVersion)
        if (latestVersion === undefined || latestVersion === "") {
            latestVersion = response.data.tag_name.trim()
            console.log("Tag name: " + latestVersion)
        }
    } else if (allReleases == "true") {
        console.log("Using releases API")
        response.data.forEach((release) => {
            if (latestVersion === undefined) {
                var match = false
                if (allReleasesInclude != undefined && allReleasesInclude != "null") {
                    match = release.name.toLowerCase().includes(allReleasesInclude.toLowerCase())
                } else if (allReleasesExclude != undefined && allReleasesExclude != "null") {
                    match = !release.name.toLowerCase().includes(allReleasesExclude.toLowerCase())
                } else if (assetsMatch != undefined && assetsMatch != "null") {
                    release.assets.forEach((asset) => {
                        if (asset.name.endsWith(assetsMatch)) {
                            match = true
                        }
                    });
                } else {
                    console.error('Not defined any allReleasesInclude or allReleasesExclude');
                    process.exit(1);
                }


                if (match) {
                    body = release.body
                    latestReleaseDate = getDate(release.published_at)
                    //assets = release.assets
                    latestVersion = release.name.trim()
                    console.log("Release name: " + latestVersion)
                    if (latestVersion === undefined || latestVersion === "") {
                        latestVersion = release.tag_name
                        console.log("Tag name: " + latestVersion)
                    }
                }
            }
        });
    } else if (tag == "true") {
        console.log("Using tags API")
        const tags = response.data;

        console.log("Tags found:")
        for (const tag of tags) {
            console.log("- " + tag.name)
            if (latestVersion == undefined && !tag.name.trim().includes("$(MARKETING_VERSION)")) {
                latestVersion = tag.name.trim()
            }
        }

        // 2.7.14-1035
        if (itemId == "muun") {
            latestVersion = latestVersion.split("-")[0]
        }
        latestReleaseDate = today()
    } else if (changelogUrl != "null") {
        var body = response.data
        // Split the content into lines
        const lines = body.split('\n');

        if (itemId == "muun") {
            // ## [51.5] - 2023-12-22
            const regex = /^## \[([\d.]+)\] - (\d{4}-\d{2}-\d{2})/;
            for (const line of lines) {
                const match = line.match(regex);
                if (match) {
                    console.log("Matched line: " + line)
                    latestVersion = match[1];
                    latestReleaseDate = formatYYYYMMDD(match[2]);
                    break;
                }
            }
        } else if (itemId == "electrum") {
            // # Release 4.4.6 (August 18, 2023) (security update)
            // Find the first line starting with "#"
            const regex = /^# Release ([\d.]+) \(([^)]+)\)/;
            for (const line of lines) {
                const match = line.match(regex);
                if (match) {
                    console.log("Matched line: " + line)
                    latestVersion = match[1];
                    latestReleaseDate = formatMonthDDYYYY(match[2]);
                    break;
                }
            }
        } else {
            console.error("Date parser not found")
            process.exit(1);
        }
        
        if (latestVersion == undefined) {
            console.error("latestVersion not found")
            process.exit(1);
        }

        if (latestReleaseDate == undefined) {
            console.error("latestReleaseDate not found")
            process.exit(1);
        }
    }

    if (!ignoreVersion(itemId, latestVersion)) {

        // Bitcoin Core
        latestVersion = latestVersion.replace(/^Bitcoin Core /, '');

        // My Cytadel (Version 1.5 (Blazing Venus) Latest)
        latestVersion = latestVersion.replace(/^Version (\d+(\.\d+)+) \(.*\)$/, '$1');

        // Mutiny
        latestVersion = latestVersion.replace(/^Mutiny Wallet /, '');

        // Zeuz: v0.8.5-hotfix
        latestVersion = latestVersion.replace(/-hotfix$/, '');

        // Nunchuk: android.1.9.46
        latestVersion = latestVersion.replace(/^android./, '');

        // Phoenix
        if (itemId == "phoenix") {
            const match = latestVersion.match(/Android (\d+\.\d+\.\d+)/);
            if (match) {
                latestVersion = match[1]
            } else {
                latestVersion = latestVersion.replace(/^Phoenix Android /, '');
                latestVersion = latestVersion.replace(/^Phoenix Android\/iOS /, '');
            }
        }

        // Specter
        latestVersion = latestVersion.replace(/^Specter /, '');

        // Stack Wallet
        latestVersion = latestVersion.replace(/^Stack Wallet /, '');

        // Wasabi v2.0.4 - Faster Than Fast Latest
        latestVersion = latestVersion.replace(/^Wasabi v(\d+(\.\d+)+) - .*$/, '$1');
        latestVersion = latestVersion.replace(/^Wasabi Wallet v(\d+(\.\d+)+) - .*$/, '$1');
        latestVersion = latestVersion.replace(/^Wasabi Wallet v(\d+(\.\d+)+)*$/, '$1');

        // For example: "2023-09-08T2009-v5.1.4"
        latestVersion = latestVersion.replace(/.*-([^:]+)$/, '$1');

        latestVersion = latestVersion.replace(/^(v\d+(\.\d+)+):(.*)$/, '$1');
        latestVersion = latestVersion.replace(/^Android Release\s*/, '');
        latestVersion = latestVersion.replace(/^Release\s*/, '');
        latestVersion = latestVersion.replace(/^release_/, '');

        latestVersion = latestVersion.replace(/^v\./, '');

        // Check if the input starts with "v" and is a valid version (x.y.z)
        const versionPattern = /^v\d+(\.\d+)*$/;
        if (!versionPattern.test(latestVersion)) {
            // If it doesn't match the version pattern, add the "v" prefix
            latestVersion = "v" + latestVersion;
        }

        if (!isValidVersion(latestVersion)) {
            console.error('Invalid version found:' + latestVersion);
            process.exit(1);
        }

        if (!isValidDate(latestReleaseDate)) {
            console.error('Invalid release data found:' + latestReleaseDate);
            process.exit(1);
        }

        // Iterate through release assets and collect their file names
        // assets.forEach((asset) => {
        //     assetFileNames.push(asset.name);
        // });
        //console.log('Release Notes:\n', body);
        //console.log('Asset File Names:', assetFileNames.join());
        checkRelease(itemId, latestVersion, latestReleaseDate);
    } else {
        console.log("Ignoring version")
        console.log("releaseVersion=")
        console.log("releaseDate=")
    }
  })
  .catch((error) => {
    console.error('Error fetching release information:', error.message);
    process.exit(1);
  });

function isValidVersion(str) {
    const regex = /^v\d+(\.\d+)*$/;
    return regex.test(str);
}

function isValidDate(str) {
    const regex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [1-9]|[1-2][0-9]|3[01], \d{4}$/;
    return regex.test(str);
}

function getDate(publishedAt) {
    if (publishedAt != "") {
        return new Date(publishedAt).toLocaleDateString(undefined, dateOptions);
    } else {
        return today()
    }
}

function ignoreVersion(itemId, latestVersion) {

    // Ignore if it ends with "-pre1", "-pre2", etc.
    var pattern = /-pre\d+$/;
    if (pattern.test(latestVersion)) {
        return true
    }

    // Stack Wallet v2.1.0 BETA
    if (latestVersion.toLowerCase().includes("beta")) {
        return true
    }

    // Ignore if it ends with "-rc", "-rc1", "-rc2", etc.
    pattern = /-rc\d*$/;
    if (pattern.test(latestVersion)) {
        return true
    }
    return false
}

function today() {
    return new Date().toLocaleDateString(undefined, dateOptions);
}

function checkRelease(itemId, latestVersion, latestReleaseDate) {
    // Define the path to your JSON file.
    const filePath = `../items/${itemId}.json`;

    // Read the JSON file.
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            process.exit(1);
        }

        try {
            const item = JSON.parse(data);

            // TODO For Bluewallet, some versions are not for all the platforms. Inspect the assets to see which platform to update

            platforms.split(',').forEach(platform => {
                console.log(platform + ":")
                var currentVersion = item[`${platform}-support`][`${platform}-latest-version`].value
                console.log("Current version found: " + currentVersion)
                console.log("Latest version found: " + latestVersion)

                var currentReleaseDate = item[`${platform}-support`][`${platform}-latest-release-date`].value
                console.log("Current Release date found: " + currentReleaseDate)
                console.log("Latest Release date found: " + latestReleaseDate)

                if (latestVersion !== currentVersion) {
                    console.log("releaseVersion=" + latestVersion)
                    console.log("releaseDate=" + latestReleaseDate)
                } else {
                    console.log("releaseVersion=")
                    console.log("releaseDate=")
                }
            });
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            process.exit(1);
        }
    });
}

// Input format: March 14, 2024
function formatMonthDDYYYY(inputDate) {
    // Split the input date string into parts
    const parts = inputDate.match(/^(\w+)\s(\d{1,2}),\s(\d{4})$/);

    if (parts && parts.length === 4) {
        const year = parseInt(parts[3]);
        const monthIndex = longMonths.indexOf(parts[1]);
        const day = parseInt(parts[2]);

        // Create a JavaScript Date object
        const date = new Date(year, monthIndex, day);

        // Format the date in the desired output format (e.g., "Dec 22, 2023")
        return `${shortMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    // Return the original input if parsing fails
    return inputDate;
}

// Input format: 2023-12-22
function formatYYYYMMDD(inputDate) {
    // Split the input date string into parts
    const parts = inputDate.match(/(\d{4})-(\d{2})-(\d{2})/);

    if (parts && parts.length === 4) {
        const year = parseInt(parts[1]);
        const monthIndex = parseInt(parts[2]) - 1; // JavaScript Date months are 0-based
        const day = parseInt(parts[3]);

        // Create a JavaScript Date object
        const date = new Date(year, monthIndex, day);

        // Format the date in the desired output format (e.g., "Dec 22, 2023")
        return `${shortMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    // Return the original input if parsing fails
    return inputDate;
}
