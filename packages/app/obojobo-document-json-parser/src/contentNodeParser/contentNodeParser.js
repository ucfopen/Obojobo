const contentNodeParser = (node, id, childrenParser) => {
    return (
        `<Content${id}>` +
        childrenParser(node.children) +
        `</Content>`
    )
}

module.exports = contentNodeParser