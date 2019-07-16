const textGroupParser = require('../textGroupParser')
const processAttrs = require('../processAttrs')

const listNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''

    const listStyles = listStylesParser(node.content.listStyles)
    const textGroupXML = textGroupParser(node.content.textGroup)

    return (
        `<List${id}>` +
        listStyles +
        textGroupXML +
        `</List>`
    )
}

const listStylesParser = listStyles => {
    if (!listStyles) return ''

    const typeXML = `<type>${listStyles.type}</type>`
    let intentsXML = '';
    if (Array.isArray(listStyles.indents)) {
        listStyles.indents.forEach(indent => {
            const attrs = processAttrs(indent, [])
            intentsXML += `<indent${attrs} />`
        })
    } else {
        for (const intent in listStyles.indents) {
            let attrs = ` level="${intent}"`
            attrs += processAttrs(listStyles.indents[intent], [])
            intentsXML += `<indent${attrs} />`
        }
    }

    intentsXML = (
        `<indents>` +
        intentsXML +
        `</indents>`
    )

    return (
        `<listStyles>` +
        typeXML +
        intentsXML +
        `</listStyles>`
    )

}

module.exports = listNodeParser
