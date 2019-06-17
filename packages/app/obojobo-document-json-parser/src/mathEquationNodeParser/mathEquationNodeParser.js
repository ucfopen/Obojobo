const xmlEncode = require('../xmlEncode')

const mathEquationNodeParser = (node, id, tabs) => {
    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return `${tabs}<MathEquation${attrs}${id} />\n`
}

module.exports = mathEquationNodeParser