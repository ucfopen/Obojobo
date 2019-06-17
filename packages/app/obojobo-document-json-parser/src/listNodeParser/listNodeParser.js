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

    const type = `${tabs+'\t'}<type>${listStyles.type}</type>\n`
    let intents = '';
    if (Array.isArray(listStyles.indents)) {
        listStyles.indents.forEach(indent => {
            let attrs = ''
            for (const attr in indent) {
                attrs += ` ${[attr]}="${xmlEncode(indent[attr])}"`
            }
            intents += `${tabs+'\t\t'}<indent${attrs} />\n`
        })
    }

    intents = (
        `${tabs+'\t'}<indents>\n` +
            intents +
        `${tabs+'\t'}</indents>\n`
    )

    return (
        `${tabs}<listStyles>\n` +
            type +
            intents +
        `${tabs}</listStyles>\n`
    )

}

module.exports = listNodeParser