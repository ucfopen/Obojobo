const xmlEncode = require('../xmlEncode')

const iFrameNodeParser = (node, id) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return `<IFrame${attrs}${id} />`
}

module.exports = iFrameNodeParser