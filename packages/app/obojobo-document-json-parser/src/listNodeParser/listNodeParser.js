const textGroupParser = require('../textGroupParser')
const xmlEncode = require('../xmlEncode')

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
            let attrs = ''
            for (const attr in indent) {
                attrs += ` ${[attr]}="${xmlEncode(indent[attr])}"`
            }
            intentsXML += `<indent${attrs} />`
        })
    } else {
        for (const intent in listStyles.indents) {
            let attrs = ''
            attrs += ` level="${[intent]}"`
            for (const attr in listStyles.indents[intent]) {
                attrs += ` ${[attr]}="${xmlEncode(listStyles.indents[intent][attr])}"`
            }
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