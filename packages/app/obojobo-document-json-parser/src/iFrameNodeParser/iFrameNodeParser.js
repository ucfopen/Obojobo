const xmlEncode = require('../xmlEncode')

const iFrameNodeParser = (node, id, tabs) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return `${tabs}<IFrame${attrs}${id} />\n`
}

module.exports = iFrameNodeParser