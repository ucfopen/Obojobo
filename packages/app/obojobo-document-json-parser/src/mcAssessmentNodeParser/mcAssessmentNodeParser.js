const xmlEncode = require('../xmlEncode')

const mcAssessmentNodeParser = (node, id, tabs, childrenParser) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `${tabs}<MCAssessment${attrs}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</MCAssessment>\n`
    )
}

module.exports = mcAssessmentNodeParser