const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))

const xmlToDraftObject = require('../xml-to-draft-object')

if (process.argv.length <= 2 || argv._.length === 0) {
	//eslint-disable-next-line no-console
	console.error('Usage: xml2draft.js xml-file.xml [--spaces=N] [--generate-ids]')
	return process.exit(1)
}

fs.readFile(argv._[0], (err, data) => {
	const o = xmlToDraftObject(data, argv['generate-ids'] === true)

	//eslint-disable-next-line no-console
	console.log(JSON.stringify(o, null, argv['spaces']))
})
