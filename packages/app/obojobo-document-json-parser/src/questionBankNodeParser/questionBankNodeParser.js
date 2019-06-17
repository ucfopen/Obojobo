const xmlEncode = require('../xmlEncode')

const questionBankNodeParser = (node, id, tabs, childrenParser) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `${tabs}<QuestionBank${attrs}${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
        `${tabs}</QuestionBank>\n`
    )
}

module.exports = questionBankNodeParser