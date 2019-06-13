const xmlEncode = require('../xmlEncode')

const breakNodeParser = (node, id, tabs) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return `${tabs}<hr${attrs} />\n`
}

module.exports = breakNodeParser