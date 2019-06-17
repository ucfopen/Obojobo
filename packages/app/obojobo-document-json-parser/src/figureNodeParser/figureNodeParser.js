const textGroupParser = require('../textGroupParser')
const xmlEncode = require('../xmlEncode')

const figureNodeParser = (node, id, tabs) => {

    const textGroupXML = textGroupParser(node.content.textGroup, tabs + '\t')

    // Parser content
    let attrs = ''
    for (const attr in node.content) {
        if (node.content[attr] == null || [attr] == 'textGroup') continue
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `${tabs}<Figure${attrs}${id}>\n` +
            textGroupXML +
        `${tabs}</Figure>\n`
    )
}

module.exports = figureNodeParser