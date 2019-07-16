const textGroupParser = require('../textGroupParser')
const processAttrs = require('../processAttrs')

const figureNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''
    const textGroupXML = textGroupParser(node.content.textGroup)
    const attrs = processAttrs(node.content, ['textGroup'])

    return (
        `<Figure${attrs}${id}>` +
        textGroupXML +
        `</Figure>`
    )
}

module.exports = figureNodeParser
