const questionNodeParser = (node, id, childrenParser) => {
    let solution = node.content.solution,
        solutionXML = ''

    if (solution) {
        solutionXML = (
            `<solution>` +
            childrenParser([solution]) +
            `</solution>`
        )
    }

    return (
        `<Question${id}>` +
        solutionXML +
        childrenParser(node.children) +
        `</Question>`
    )
}

module.exports = questionNodeParser