const textGroupParser = require('../textGroupParser')
const xmlEncode = require('../xmlEncode')

const actionButtonNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''

    let attrs = ''
    for (const attr in node.content) {
        if ([attr] == "triggers" || [attr] == "textGroup" || [attr] == "actions") continue;
        attrs += ` ${[attr]}="${xmlEncode(node.content[attr])}"`
    }

    const textGroupXML = textGroupParser(node.content.textGroup)
    const triggersXML = triggersParser(node.content.triggers)

    return (
        `<ActionButton${attrs}${id}>` +
        textGroupXML +
        triggersXML +
        `</ActionButton>`
    )
}

const triggersParser = triggers => {
    if (!triggers) return ''

    let triggersBodyXML = ''
    triggers.forEach(trigger => {
        if (!trigger.actions) return

        let triggerXML = ''
        let actionsBodyXML = ''

        // Parser actions in each trigger
        trigger.actions.forEach(action => {
            let attrs = ''
            for (const attr in action.value) {
                attrs += ` ${[attr]}="${xmlEncode(action.value[attr])}"`
            }
            actionsBodyXML += (
                `<action type="${action.type}">` +
                `<value${attrs} />` +
                `</action>`
            )
        })

        let actionsXML = ''
        if (actionsBodyXML !== '') {
            actionsXML = (
                `<actions>` +
                actionsBodyXML +
                `</actions>`
            )
            triggerXML = (
                `<trigger type="${xmlEncode(trigger.type)}">` +
                actionsXML +
                `</trigger>`
            )
        }

        triggersBodyXML += triggerXML
    })

    const triggersXML =
        triggersBodyXML !== '' ?
        `<triggers>` + triggersBodyXML + `</triggers>` :
        ''

    return triggersXML
}

module.exports = actionButtonNodeParser
