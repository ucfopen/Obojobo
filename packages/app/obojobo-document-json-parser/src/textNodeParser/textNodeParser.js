const textGroupParser = require('../textGroupParser')

const textNodeParser = (node, id) => {
    const textGroupXML = textGroupParser(node.content.textGroup)

    return (
        `<Text${id}>` +
        textGroupXML +
        `</Text>`
    )
}

module.exports = textNodeParser