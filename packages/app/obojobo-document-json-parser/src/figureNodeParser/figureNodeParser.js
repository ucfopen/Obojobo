const textGroupParser = require('../textGroupParser')
const xmlEncode = require('../xmlEncode')

const figureNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''

    const textGroupXML = textGroupParser(node.content.textGroup)

    // Parser content
    let attrs = ''
    for (const attr in node.content) {
        if (node.content[attr] == null || [attr] == 'textGroup') continue
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `<Figure${attrs}${id}>` +
        textGroupXML +
        `</Figure>`
    )
}

module.exports = figureNodeParser