const textGroupParser = require('../textGroupParser')

const figureNodeParser = (node, id, tabs) => {

    const textGroupXML = textGroupParser(node.content.textGroup, tabs + '\t')

    // Parser content
    let contentXML = ''
    for(const c in node.content){
        if(node.content[c] == null || [c] == 'textGroup') continue
        contentXML += ` ${[c]}="${node.content[c]}"`
    }

    return (
        `${tabs}<Figure${contentXML}>\n` +
            textGroupXML +
        `${tabs}</Figure>\n`
    )
}

module.exports = figureNodeParser