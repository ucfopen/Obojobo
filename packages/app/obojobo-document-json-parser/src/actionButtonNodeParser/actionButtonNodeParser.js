const textGroupParser = require('../textGroupParser')

const actionButtonNodeParser = (node, id, tabs) => {

    const textGroupXML = textGroupParser(node.content.textGroup, tabs + '\t')

    // Parse triggers
    let triggersBodyXML = ''
    node.content.triggers.forEach(trigger => {
        let triggerXML = ''
        let actionsXML = ''

        // Parser actions in each trigger
        trigger.actions.forEach(action => {
            let attrs = ''
            for (const attr in action.value) {
                attrs += ` ${[attr]}="${action.value[attr]}"`
            }
            actionsXML += (
                `${tabs+'\t\t\t\t'}<action type="${action.type}">\n` +
                    `${tabs+'\t\t\t\t\t'}<value${attrs} />\n` +
                `${tabs+'\t\t\t\t'}</action>\n`
            )
        })
        if (actionsXML !== '') {
            actionsXML = (
                `${tabs+'\t\t\t'}<actions>\n` +
                    actionsXML +
                `${tabs+'\t\t\t'}</actions>\n`
            )
            triggerXML = (
                `${tabs+'\t\t'}<trigger type="${trigger.type}">\n` +
                    actionsXML +
                `${tabs+'\t\t'}</trigger>\n`
            )
        }

        triggersBodyXML += triggerXML
    })

    const triggersXML =
        triggersBodyXML !== '' ?
        `${tabs+'\t'}<triggers>\n` + triggersBodyXML + `${tabs+'\t'}</triggers>\n` :
        ''

    return (
        `${tabs}<ActionButton${id}>\n` +
            textGroupXML +
            triggersXML +
        `${tabs}</ActionButton>\n`
    )
}

module.exports = actionButtonNodeParser