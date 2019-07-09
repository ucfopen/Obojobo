const xmlEncode = require('../xmlEncode')

const mcChoiceNodeParser = (node, id, childrenParser) => {
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