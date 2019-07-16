const processAttrs = require('../processAttrs')

const htmlNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''
    const attrs = processAttrs(node.content, [])

    return `<HTML${attrs}${id} />`
}

module.exports = htmlNodeParser
