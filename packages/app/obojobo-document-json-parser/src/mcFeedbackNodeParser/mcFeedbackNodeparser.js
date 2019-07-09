const mcFeedbackNodeParser = (node, id, childrenParser) => {
    return (
        `<MCFeedback${id}>` +
        childrenParser(node.children) +
        `</MCFeedback>`
    )
}

module.exports = mcFeedbackNodeParser