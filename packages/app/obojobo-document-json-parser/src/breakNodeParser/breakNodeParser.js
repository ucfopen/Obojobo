const processAttrs = require('../processAttrs')

const breakNodeParser = node => {
    const attrs = processAttrs(node.content, [])

    return `<hr${attrs} />`
}

module.exports = breakNodeParser
