const xmlEncode = require('../xml-encode')

const youTubeNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''
    const videoId = xmlEncode(node.content.videoId)

    return `<YouTube videoId="${videoId}"${id}/>`
}

module.exports = youTubeNodeParser
