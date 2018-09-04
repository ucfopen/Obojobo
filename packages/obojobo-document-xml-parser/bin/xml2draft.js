let fs = require('fs');
let argv = require('minimist')(process.argv.slice(2));

let xmlToDraftObject = require('../xml-to-draft-object')

if(process.argv.length <= 2 || argv._.length === 0) {
	console.error('Usage: xml2draft.js xml-file.xml [--spaces=N] [--generate-ids]');
	return process.exit(1);
}

fs.readFile(argv._[0], (err, data) => {
	let o = xmlToDraftObject(data, argv['generate-ids'] === true);
	console.log(JSON.stringify(o, null, argv['spaces']));
})