const pageNodeParser = (node, id, tabs, childrenParser) => {
    let contentXML = '';
    for (const c in node.content) {
        contentXML += (
            node.content[c] != null ?
            ` ${[c]}="${node.content[c]}"` :
            ''
        )
    }

    return (
        `${tabs}<Page${contentXML}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</Page>\n`
    )
}

module.exports = pageNodeParser