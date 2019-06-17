const textGroupParser = require('../textGroupParser')
const xmlEncode = require('../xmlEncode')

const listNodeParser = (node, id, tabs) => {
    const listStyles = listStylesParser(node.content.listStyles, tabs + '\t')
    const textGroupXML = textGroupParser(node.content.textGroup, tabs + '\t')

    return (
        `${tabs}<List${id}>\n` +
            listStyles +
            textGroupXML +
        `${tabs}</List>\n`
    )
}

const listStylesParser = (listStyles, tabs) => {
    if (!listStyles) return ''

    const typeXML = `${tabs+'\t'}<type>${listStyles.type}</type>\n`
    let intentsXML = '';
    if (Array.isArray(listStyles.indents)) {
        listStyles.indents.forEach(indent => {
            let attrs = ''
            for (const attr in indent) {
                attrs += ` ${[attr]}="${xmlEncode(indent[attr])}"`
            }
            intentsXML += `${tabs+'\t\t'}<indent${attrs} />\n`
        })
    } else {
        for (const intent in listStyles.indents) {
            let attrs = ''
            attrs += ` level="${[intent]}"`
            for (const attr in listStyles.indents[intent]) {
                attrs += ` ${[attr]}="${xmlEncode(listStyles.indents[intent][attr])}"`
            }
            intentsXML += `${tabs+'\t\t'}<indent${attrs} />\n`
        }
    }

    intentsXML = (
        `${tabs+'\t'}<indents>\n` +
            intentsXML +
        `${tabs+'\t'}</indents>\n`
    )

    return (
        `${tabs}<listStyles>\n` +
            typeXML +
            intentsXML +
        `${tabs}</listStyles>\n`
    )

}

module.exports = listNodeParser