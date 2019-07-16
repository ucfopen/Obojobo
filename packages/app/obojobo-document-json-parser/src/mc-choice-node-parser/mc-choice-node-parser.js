const processAttrs = require('../process-attrs')

const mcChoiceNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''
    const attrs = processAttrs(node.content, [])

    return (
        `<MCChoice${attrs}${id}>` +
        childrenParser(node.children) +
        `</MCChoice>`
    )
}

module.exports = mcChoiceNodeParser
