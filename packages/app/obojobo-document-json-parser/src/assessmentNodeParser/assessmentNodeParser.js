const xmlEncode = require('../xmlEncode')

const assessmentNodeParser = (node, childrenParser) => {
    const id = node.id ? ` id="${node.id}"` : ''

    let attrs = ''
    for (const attr in node.content) {
        if ([attr] == "triggers" || [attr] == "scoreActions" || [attr] == "rubric") continue;
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    const scoreActionsXML = scoreActionsParser(node.content.scoreActions, childrenParser)
    const rubricXML = rubricParser(node.content.rubric)

    return (
        `<Assessment${attrs}${id}>` +
        childrenParser(node.children) +
        scoreActionsXML +
        rubricXML +
        `</Assessment>`
    )
}

const scoreActionsParser = (scoreActions, childrenParser) => {
    if (!scoreActions) return ''

    let scoreActionsBodyXML = ''
    scoreActions.forEach(scoreAction => {
        let attrs = ''
        for (const attr in scoreAction) {
            if ([attr] == 'page') continue
            attrs += ` ${[attr]}="${xmlEncode(scoreAction[attr])}"`
        }

        scoreActionsBodyXML += (
            `<scoreAction${attrs}>` +
            childrenParser([scoreAction.page]) +
            `</scoreAction>`
        )
    })

    return (
        `<scoreActions>` +
        scoreActionsBodyXML +
        `</scoreActions>`
    )
}

const rubricParser = (rubric) => {
    if (!rubric) return ''

    let modsXML = ''
    if (rubric.mods) {
        let modsBodyXML = ''
        rubric.mods.forEach(mod => {
            let attrs = ''
            for (const attr in mod) {
                attrs += ` ${[attr]}="${xmlEncode(mod[attr])}"`
            }
            modsBodyXML += `<mod${attrs} />`
        })

        modsXML = (
            `<mods>` +
            modsBodyXML +
            `</mods>`
        )
    }

    let attrs = ''
    for (const attr in rubric) {
        if ([attr] == 'mods') continue
        attrs += ` ${[attr]}="${xmlEncode(rubric[attr])}"`
    }

    return (
        `<rubric${attrs}>` +
        modsXML +
        `</rubric>`
    )
}

module.exports = assessmentNodeParser
