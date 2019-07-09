const xmlEncode = require('../xmlEncode')

const mcChoiceNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''

    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `<MCChoice${attrs}${id}>` +
        childrenParser(node.children) +
        `</MCChoice>`
    )
}

module.exports = mcChoiceNodeParser
