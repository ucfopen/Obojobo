const mathEquationNodeParser = (node, id, tabs) => {
    const content = node.content
    let attrs = ''
    for (const attr in content) {
        attrs += ` ${[attr]}="${content[attr]}"`
    }

    return `${tabs}<MathEquation${attrs}${id} />\n`
}

module.exports = mathEquationNodeParser