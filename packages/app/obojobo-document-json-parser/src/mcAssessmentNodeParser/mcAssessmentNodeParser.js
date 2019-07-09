const xmlEncode = require('../xmlEncode')

const mcAssessmentNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''

    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `<MCAssessment${attrs}${id}>` +
        childrenParser(node.children) +
        `</MCAssessment>`
    )
}

module.exports = mcAssessmentNodeParser
