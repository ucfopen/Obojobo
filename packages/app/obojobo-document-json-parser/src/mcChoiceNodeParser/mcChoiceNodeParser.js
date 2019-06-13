const mcChoiceNodeParser = (node, id, tabs, childrenParser) => {
    let contentXML = ''
    for (const c in node.content) {
        contentXML += ` ${[c]}="${node.content[c]}"`
    }

    return (
        `${tabs}<MCChoice${contentXML}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</MCChoice>\n`
    )
}

module.exports = mcChoiceNodeParser