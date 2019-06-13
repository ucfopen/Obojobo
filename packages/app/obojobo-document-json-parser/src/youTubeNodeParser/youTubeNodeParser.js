const youTubeNodeParser = (node, id, tabs) => {
    const videoId = node.content.videoId
    return `${tabs}<YouTube videoId="${videoId}"${id}/>\n`
}

module.exports = youTubeNodeParser