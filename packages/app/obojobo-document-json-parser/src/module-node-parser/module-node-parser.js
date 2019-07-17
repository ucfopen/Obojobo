const xmlEncode = require('../xml-encode')
const processAttrs = require('../process-attrs')

const moduleNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''

    const attrs = processAttrs(node.content, [])

    return (
        `<Module${attrs}${id}>` +
        childrenParser(node.children) +
        `</Module>`
    )
}

module.exports = moduleNodeParser
