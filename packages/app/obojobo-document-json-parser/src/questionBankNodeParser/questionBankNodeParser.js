const xmlEncode = require('../xmlEncode')

const questionBankNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''

    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return (
        `<QuestionBank${attrs}${id}>` +
        childrenParser(node.children) +
        `</QuestionBank>`
    )
}

module.exports = questionBankNodeParser
