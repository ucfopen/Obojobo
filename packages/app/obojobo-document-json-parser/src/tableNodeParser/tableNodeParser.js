const textGroupParser = require('../textGroupParser')

const tableNodeParser = (node, id, tabs) => {
    const header = node.content.header
    const numRows = node.content.textGroup.numRows
    const numCols = node.content.textGroup.numCols

    const textGroupXML = textGroupParser(node.content.textGroup.textGroup, tabs + '\t');

    return (
        `${tabs}<Table numRows="${numRows}" numCols="${numCols}" header="${header}"${id}>\n` +
            textGroupXML +
        `${tabs}</Table>\n`
    )
}

module.exports = tableNodeParser