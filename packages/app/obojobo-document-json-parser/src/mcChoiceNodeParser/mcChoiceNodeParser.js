const xmlEncode = require('../xmlEncode')

const mcChoiceNodeParser = (node, id, tabs, childrenParser) => {
    let contentXML = ''
    for (const c in node.content) {
        contentXML += ` ${[c]}="${xmlEncode(node.content[c])}"`
    }

    return (
        `${tabs}<MCChoice${contentXML}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</MCChoice>\n`
    )
}

module.exports = mcChoiceNodeParser