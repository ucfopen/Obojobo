const xmlEncode = require('../xmlEncode')

const pageNodeParser = (node, childrenParser) => {
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
        `<Page${attrs}${id}>` +
        childrenParser(node.children) +
        `</Page>`
    )
}

module.exports = pageNodeParser