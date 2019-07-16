const processAttrs = require('../process-attrs')

const breakNodeParser = node => {
    const attrs = processAttrs(node.content, [])

    return `<hr${attrs} />`
}

module.exports = breakNodeParser
