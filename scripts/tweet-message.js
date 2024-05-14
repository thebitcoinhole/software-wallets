const fs = require('fs');

const itemId = process.argv[2];
const platforms = process.argv[3];
const releaseVersion = process.argv[4];

if (releaseVersion == undefined || releaseVersion == "") {
    console.error('Missing releaseVersion');
    process.exit(1);
}

var jsonFile = fs.readFileSync(`../items/${itemId}.json`, 'utf8')
const jsonData = JSON.parse(jsonFile);

var fullName = ""

if (jsonData["full-name"] != undefined) {
    fullName = jsonData["full-name"]
} else {
    fullName = jsonData.name
}

console.log(`${fullName} (${platforms}) ${releaseVersion} released.\n\nVisit our website for more information.\nhttps://thebitcoinhole.com/software-wallets/${itemId}`)