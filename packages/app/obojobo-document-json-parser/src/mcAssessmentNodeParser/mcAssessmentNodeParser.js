const xmlEncode = require('../xmlEncode')

const mcAssessmentNodeParser = (node, id, childrenParser) => {
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