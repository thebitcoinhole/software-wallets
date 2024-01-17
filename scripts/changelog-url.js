const fs = require('fs');

const itemId = process.argv[2];
const platforms = process.argv[3];
const platform = platforms.split(',')[0]
var jsonFile = fs.readFileSync(`../items/${itemId}.json`, 'utf8')
const jsonData = JSON.parse(jsonFile);

console.log(jsonData[`${platform}-support`][`${platform}-release-notes`]["links"][0]["url"]);
