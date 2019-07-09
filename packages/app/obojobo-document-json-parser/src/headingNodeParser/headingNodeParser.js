const textGroupParser = require('../textGroupParser')

const headingNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''

    const headingLevel = node.content.headingLevel
    const textGroupXML = textGroupParser(node.content.textGroup)

    return (
        `<Heading headingLevel="${headingLevel}"${id}>` +
        textGroupXML +
        `</Heading>`
    )
}

module.exports = headingNodeParser