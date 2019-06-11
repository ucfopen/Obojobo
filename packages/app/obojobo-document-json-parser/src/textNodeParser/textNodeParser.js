const textGroupParser = require('../textGroupParser')

const textNodeParser = (node, id, tabs) => {

    const textGroupXML = textGroupParser(node.content.textGroup, tabs+'\t')

    return (
        `${tabs}<Text${id}>\n` +
            textGroupXML +
        `${tabs}</Text>\n`
    )
}

module.exports = textNodeParser