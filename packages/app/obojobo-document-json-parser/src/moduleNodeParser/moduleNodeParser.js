const xmlEncode = require('../xmlEncode')

const moduleNodeParser = (node, id, tabs, childrenParser) => {
    let attrs = '';
    for (const attr in node.content) {
        attrs += (
            node.content[attr] != null ?
            ` ${[attr]}="${xmlEncode(node.content[attr])}"` :
            ''
        )
    }

    return (
        `${tabs}<Module${attrs}${id}>\n` +
            childrenParser(node["children"], tabs + '\t') +
        `${tabs}</Module>\n`
    )
}

module.exports = moduleNodeParser