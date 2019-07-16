const contentNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''

    return (
        `<Content${id}>` +
        childrenParser(node.children) +
        `</Content>`
    )
}

module.exports = contentNodeParser
