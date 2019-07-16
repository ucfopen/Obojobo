const processAttrs = require('../processAttrs')

const mathEquationNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''
    const attrs = processAttrs(node.content, [])

    return `<MathEquation${attrs}${id} />`
}

module.exports = mathEquationNodeParser
