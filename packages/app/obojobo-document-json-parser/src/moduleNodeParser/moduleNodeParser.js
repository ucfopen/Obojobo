const moduleNodeParser = (node, id, tabs, childrenParser) => {
    let contentXML = '';
    for (const c in node.content) {
        contentXML += (
            node.content[c] != null ?
            ` ${[c]}="${node.content[c]}"` :
            ''
        )
    }

    return (
        `${tabs}<Module${contentXML}${id}>\n` +
            childrenParser(node["children"], tabs + '\t') +
        `${tabs}</Module>\n`
    )
}

module.exports = moduleNodeParser