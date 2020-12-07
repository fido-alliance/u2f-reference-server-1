const config = require('./config.json');
const fs     = require('fs');

if(process.env['APPID_AND_FACETS_APPURL'])
    config.appURL = process.env['APPID_AND_FACETS_APPURL'];

if(process.env['APPID_AND_FACETS_BAD_APP_REDIRECT_URL'])
    config.badAppRedirectURL = process.env['APPID_AND_FACETS_BAD_APP_REDIRECT_URL'];

if(process.env['APPID_AND_FACETS_EVIL_ETLD'])
    config.evilETLD = process.env['APPID_AND_FACETS_EVIL_ETLD'];

if(process.env['APPID_AND_FACETS_ADDITIONAL_FACETS'])
    config.additionalFacets = JSON.parse(process.env['APPID_AND_FACETS_ADDITIONAL_FACETS']);

let jsonContent = JSON.stringify(config, null, 4);
console.log('Injecting environment variables to the config... ', jsonContent)
fs.writeFileSync('config.json', jsonContent);