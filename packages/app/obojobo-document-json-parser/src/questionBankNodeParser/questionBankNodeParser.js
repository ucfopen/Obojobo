const xmlEncode = require('../xmlEncode')

const questionBankNodeParser = (node, id, tabs, childrenParser) => {
    let contentXML = ''
    for (const c in node.content) {
        contentXML += ` ${[c]}="${xmlEncode(node.content[c])}"`
    }

    return (
        `${tabs}<QuestionBank${contentXML}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</QuestionBank>\n`
    )
}

module.exports = questionBankNodeParser