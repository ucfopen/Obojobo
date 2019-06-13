const xmlEncode = require('../xmlEncode')

const mathEquationNodeParser = (node, id, tabs) => {
    let contentXML = ''
    for (const c in node.content) {
        contentXML += ` ${[c]}="${xmlEncode(node.content[c])}"`
    }

    return `${tabs}<MathEquation${contentXML}${id} />\n`
}

module.exports = mathEquationNodeParser