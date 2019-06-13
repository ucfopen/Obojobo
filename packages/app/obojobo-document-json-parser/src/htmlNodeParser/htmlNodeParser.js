const xmlEncode = require('../xmlEncode')

const htmlNodeParser = (node, id, tabs) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return `${tabs}<HTML${attrs}${id} />\n`
}

module.exports = htmlNodeParser