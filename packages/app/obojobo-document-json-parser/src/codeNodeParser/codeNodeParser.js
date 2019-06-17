const textGroupParser = require('../textGroupParser')

const codeNodeParser = (node, id, tabs) => {

    const textGroupXML = textGroupParser(node.content.textGroup, tabs + '\t')

    return (
        `${tabs}<Code${id}>\n` +
            textGroupXML +
        `${tabs}</Code>\n`
    )
}

module.exports = codeNodeParser