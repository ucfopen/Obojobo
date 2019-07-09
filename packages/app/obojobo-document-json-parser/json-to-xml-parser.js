const nodeParser = require('./src/nodeParser');
const formatter = require('xml-formatter');

const jsonToXMLParser = node => {
    const xml = (
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<ObojoboDraftDoc>' +
        nodeParser(node) +
        '</ObojoboDraftDoc>'
    )

    const options = {
        indentation: '\t',
        stripComments: true,
        collapseContent: true
    }

    return formatter(xml, options)
}

module.exports = jsonToXMLParser