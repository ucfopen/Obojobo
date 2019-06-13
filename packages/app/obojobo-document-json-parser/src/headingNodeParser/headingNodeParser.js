const textGroupParser = require('../textGroupParser')

const headingNodeParser = (node, id, tabs) => {
    const headingLevel = node.content.headingLevel

    const textGroupXML = textGroupParser(node.content.textGroup, tabs + '\t')

    return (
        `${tabs}<Heading headingLevel="${headingLevel}"${id}>\n` +
            textGroupXML +
        `${tabs}</Heading>\n`
    )
}

module.exports = headingNodeParser