const textGroupParser = require('../textGroupParser')
const xmlEncode = require('../xmlEncode')

const actionButtonNodeParser = (node, id, tabs) => {

    let contentXML = ''
    for (const c in node.content) {
        if ([c] == "triggers" || [c] == "textGroup") continue;
        contentXML += ` ${[c]}="${xmlEncode(node.content[c])}"`
    }

    const textGroupXML = textGroupParser(node.content.textGroup, tabs + '\t')
    const triggersXML = triggersParser(node.content.triggers, tabs + '\t')

    return (
        `${tabs}<ActionButton${contentXML}${id}>\n` +
            textGroupXML +
            triggersXML +
        `${tabs}</ActionButton>\n`
    )
}

const triggersParser = (triggers, tabs) => {
    if (!triggers) return ''

    let triggersBodyXML = ''
    triggers.forEach(trigger => {
        let triggerXML = ''
        let actionsBodyXML = ''

        // Parser actions in each trigger
        trigger.actions.forEach(action => {
            let attrs = ''
            for (const attr in action.value) {
                attrs += ` ${[attr]}="${xmlEncode(action.value[attr])}"`
            }
            actionsBodyXML += (
                `${tabs+'\t\t\t'}<action type="${action.type}">\n` +
                    `${tabs+'\t\t\t\t'}<value${attrs} />\n` +
                `${tabs+'\t\t\t'}</action>\n`
            )
        })

        let actionsXML = ''
        if (actionsBodyXML !== '') {
            actionsXML = (
                `${tabs+'\t\t'}<actions>\n` +
                    actionsBodyXML +
                `${tabs+'\t\t'}</actions>\n`
            )
            triggerXML = (
                `${tabs+'\t'}<trigger type="${xmlEncode(trigger.type)}">\n` +
                    actionsXML +
                `${tabs+'\t'}</trigger>\n`
            )
        }

        triggersBodyXML += triggerXML
    })

    const triggersXML =
        triggersBodyXML !== '' ?
        `${tabs}<triggers>\n` + triggersBodyXML + `${tabs+'\t'}</triggers>\n` :
        ''

    return triggersXML
}

module.exports = actionButtonNodeParser