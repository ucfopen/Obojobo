const xmlEncode = require('../xmlEncode')

const youTubeNodeParser = (node, id, tabs) => {
    const videoId = xmlEncode(node.content.videoId)
    
    return `${tabs}<YouTube videoId="${videoId}"${id}/>\n`
}

module.exports = youTubeNodeParser