const nodeParser = require('./src/nodeParser');

const jsonToXMLParser = node => {
    return (
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<ObojoboDraftDoc>\n' +
            nodeParser(node) +
        '</ObojoboDraftDoc>'
    )
}

module.exports = jsonToXMLParser