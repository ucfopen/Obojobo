const mcFeedbackNodeParser = (node, id, tabs, childrenParser) => {

    return (
        `${tabs}<MCFeedback${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</MCFeedback>\n`
    )
}

module.exports = mcFeedbackNodeParser