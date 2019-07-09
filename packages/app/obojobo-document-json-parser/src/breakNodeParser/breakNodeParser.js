const xmlEncode = require('../xmlEncode')

const breakNodeParser = node => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return `<hr${attrs} />`
}

module.exports = breakNodeParser