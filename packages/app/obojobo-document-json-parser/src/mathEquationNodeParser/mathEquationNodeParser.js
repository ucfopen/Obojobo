const xmlEncode = require('../xmlEncode')

const mathEquationNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''

    let attrs = ''
    for (const attr in node.content) {
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    return `<MathEquation${attrs}${id} />`
}

module.exports = mathEquationNodeParser
