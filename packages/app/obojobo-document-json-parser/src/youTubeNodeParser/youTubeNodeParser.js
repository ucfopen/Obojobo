const xmlEncode = require('../xmlEncode')

const youTubeNodeParser = (node, id) => {
    const videoId = xmlEncode(node.content.videoId)

    return `<YouTube videoId="${videoId}"${id}/>`
}

module.exports = youTubeNodeParser