const mcAssessmentNodeParser = (node, id, tabs, childrenParser) => {
    let contentXML = ''
    for(const c in node.content){
        contentXML += ` ${[c]}="${node.content[c]}"`
    }

    return (
        `${tabs}<MCAssessment${contentXML}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</MCAssessment>\n`
    )
}

module.exports = mcAssessmentNodeParser