const iFrameNodeParser = (node, id, tabs) => {
    let contentXML = ''
    for (const c in node.content) {
        contentXML += ` ${[c]}="${node.content[c]}"`
    }

    return `${tabs}<IFrame${contentXML} />\n`
}

module.exports = iFrameNodeParser