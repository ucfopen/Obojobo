const mcAnswerNodeParser = (node, id, tabs, childrenParser) => {

    return (
        `${tabs}<MCAnswer${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</MCAnswer>\n`
    )
}

module.exports = mcAnswerNodeParser