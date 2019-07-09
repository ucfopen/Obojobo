const textGroupParser = require('../textGroupParser')

const codeNodeParser = (node, id) => {

    const textGroupXML = textGroupParser(node.content.textGroup)

    return (
        `<Code${id}>` +
        textGroupXML +
        `</Code>`
    )
}

module.exports = codeNodeParser