const config = require('./config.json');
const fs     = require('fs');

if(process.env['COOKEY_KEY'])
    config.cookeyKey = process.env['COOKEY_KEY'];

if(process.env['PORT'])
    config.port = process.env['PORT'];

if(process.env['APPID'])
    config.appID = process.env['APPID'];

let jsonContent = JSON.stringify(config, null, 4);
console.log('Injecting environment variables to the config... ', jsonContent)
fs.writeFileSync('config.json', jsonContent);