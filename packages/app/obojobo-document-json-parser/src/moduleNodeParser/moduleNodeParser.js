const xmlEncode = require('../xmlEncode')

const moduleNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''

    let attrs = '';
    for (const attr in node.content) {
        attrs += (
            node.content[attr] != null ?
            ` ${[attr]}="${xmlEncode(node.content[attr])}"` :
            ''
        )
    }

    return (
        `<Module${attrs}${id}>` +
        childrenParser(node.children) +
        `</Module>`
    )
}

module.exports = moduleNodeParser