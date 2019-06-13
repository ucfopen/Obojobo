const xmlEncode = require('../xmlEncode')

const assessmentNodeParser = (node, id, tabs, childrenParser) => {

    const scoreActionsXML = scoreActionsParser(node.content.scoreActions, tabs + '\t', childrenParser)
    const rubricXML = rubricParser(node.content.rubric, tabs + '\t')

    return (
        `${tabs}<Assessment${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
            scoreActionsXML +
            rubricXML +
        `${tabs}</Assessment>\n`
    )
}

const scoreActionsParser = (scoreActions, tabs, childrenParser) => {
    if (!scoreActions) return ''

    let scoreActionsBodyXML = ''
    scoreActions.forEach(scoreAction => {
        let attrs = ''
        for (const attr in scoreAction) {
            if ([attr] == 'page') continue
            attrs += ` ${[attr]}="${xmlEncode(scoreAction[attr])}"`
        }

        scoreActionsBodyXML += (
            `${tabs+'\t'}<scoreAction${attrs}>\n` +
                childrenParser([scoreAction.page], tabs + '\t\t\t') +
            `${tabs+'\t'}</scoreAction>\n`
        )
    })
    
    return (
        `${tabs}<scoreActions>\n` +
            scoreActionsBodyXML +
        `${tabs}</scoreActions>\n`
    )
}

const rubricParser = (rubric, tabs) => {
    if(!rubric) return ''

    let modsXML = ''
    if (rubric.mods) {
        let modsBodyXML = ''
        rubric.mods.forEach(mod => {
            let attrs = ''
            for (const attr in mod) {
                attrs += ` ${[attr]}="${xmlEncode(mod[attr])}"`
            }
            modsBodyXML += `${tabs+'\t\t\t'}<mod${attrs} />\n`
        })

        modsXML = (
            `${tabs+'\t'}<mods>\n` +
                modsBodyXML +
            `${tabs+'\t'}</mods>\n`
        )
    }

    let attrs = ''
    for (const attr in rubric) {
        if ([attr] == 'mods') continue
        attrs += ` ${[attr]}="${xmlEncode(rubric[attr])}"`
    }

    return (
        `${tabs}<rubric${attrs}>\n` +
            modsXML +
        `${tabs}</rubric>\n`
    )
}

module.exports = assessmentNodeParser