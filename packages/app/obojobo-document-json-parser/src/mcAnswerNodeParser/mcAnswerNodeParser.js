const mcAnswerNodeParser = (node, id, childrenParser) => {

    return (
        `<MCAnswer${id}>` +
        childrenParser(node.children) +
        `</MCAnswer>`
    )
}

module.exports = mcAnswerNodeParser