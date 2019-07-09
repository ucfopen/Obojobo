const argv = process.argv.slice(2)

const jsonToXml = require('../json-to-xml-parser')

if (argv.length === 0) {
    console.error('Usage: json2xml.js json-file.json');
    return process.exit(1);
}

const json = require('../' + argv[0])
console.log(jsonToXml(json))
