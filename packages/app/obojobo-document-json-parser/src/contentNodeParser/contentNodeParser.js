const contentNodeParser = (node, id, tabs, childrenParser) => {
    return (
        `${tabs}<Content${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</Content>\n`
    )
}

module.exports = contentNodeParser