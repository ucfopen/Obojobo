const xmlEncode = require('../xmlEncode')

const pageNodeParser = (node, id, tabs, childrenParser) => {
    let attrs = '';
    for (const attr in node.content) {
        attrs += (
            node.content[attr] != null ?
            ` ${[attr]}="${xmlEncode(node.content[attr])}"` :
            ''
        )
    }

    return (
        `${tabs}<Page${attrs}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</Page>\n`
    )
}

module.exports = pageNodeParser