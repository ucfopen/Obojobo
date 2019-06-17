const xmlEncode = require('../xmlEncode')

const mcChoiceNodeParser = (node, id, tabs, childrenParser) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `${tabs}<MCChoice${attrs}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</MCChoice>\n`
    )
}

module.exports = mcChoiceNodeParser