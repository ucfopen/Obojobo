const questionNodeParser = (node, id, tabs, childrenParser) => {
    let solution = node.content.solution,
        solutionXML = ''
    if (solution) {
        solutionXML = (
            `${tabs+'\t'}<solution>\n` +
                childrenParser(solution.children, tabs + '\t\t') +
            `${tabs+'\t'}</solution>\n`
        )
    }

    return (
        `${tabs}<Question${id}>\n` +
            solutionXML +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</Question>\n`
    )
}

module.exports = questionNodeParser