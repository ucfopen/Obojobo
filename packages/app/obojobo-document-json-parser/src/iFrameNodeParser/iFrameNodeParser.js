const xmlEncode = require('../xmlEncode')

const iFrameNodeParser = (node, id, tabs) => {
    let contentXML = ''
    for (const c in node.content) {
        contentXML += ` ${[c]}="${xmlEncode(node.content[c])}"`
    }

    return `${tabs}<IFrame${contentXML}${id} />\n`
}

module.exports = iFrameNodeParser