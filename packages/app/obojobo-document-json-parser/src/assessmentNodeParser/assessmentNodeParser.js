const assessmentNodeParser = (node, id, tabs, childrenParser) => {
    const content = node.content

    // Parse scoreAction
    let scoreActionsBodyXML = ''
    content.scoreActions.forEach(scoreAction => {
        let attrs = ''
        for (const attr in scoreAction) {
            if ([attr] == 'page') continue
            attrs += ` ${[attr]}="${scoreAction[attr]}"`
        }
        scoreActionsBodyXML += (
            `${tabs+'\t\t'}<scoreAction${attrs}>\n` +
                childrenParser([scoreAction.page], tabs + '\t\t\t') +
            `${tabs+'\t\t'}</scoreAction>\n`
        )
    })
    const scoreActionsXML = (
        `${tabs+'\t'}<scoreActions>\n` +
            scoreActionsBodyXML +
        `${tabs+'\t'}</scoreActions>\n`
    )

    // Parser rubric
    let modsBodyXML = ''
    content.rubric.mods.forEach(mod => {
        let attrs = ''
        for (const attr in mod) {
            attrs += ` ${[attr]}="${mod[attr]}"`
        }
        modsBodyXML += `${tabs+'\t\t\t'}<mod${attrs} />\n`
    })
    const modsXML = (
        `${tabs+'\t\t'}<mods>\n` +
            modsBodyXML +
        `${tabs+'\t\t'}</mods>\n`
    )
    let attrs = ''
    for (const attr in content.rubric) {
        if ([attr] == 'mods') continue;
        attrs += ` ${[attr]}="${content.rubric[attr]}"`
    }
    const rubricXML = (
        `${tabs+'\t'}<rubric${attrs}>\n` +
            modsXML +
        `${tabs+'\t'}</rubric>\n`
    )

    return (
        `${tabs}<Assessment${id}>\n` +
            childrenParser(node.children, tabs + '\t') +
            scoreActionsXML +
            rubricXML +
        `${tabs}</Assessment>\n`
    )
}

module.exports = assessmentNodeParser