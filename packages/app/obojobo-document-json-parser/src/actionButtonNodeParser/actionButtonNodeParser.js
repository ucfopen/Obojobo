const textGroupParser = require('../textGroupParser')
const xmlEncode = require('../xmlEncode')

const actionButtonNodeParser = node => {
    const id = node.id ? ` id="${node.id}"` : ''

    let contentXML = ''
    for (const c in node.content) {
        if ([c] == "triggers" || [c] == "textGroup") continue;
        contentXML += ` ${[c]}="${xmlEncode(node.content[c])}"`
    }

    const textGroupXML = textGroupParser(node.content.textGroup)
    const triggersXML = triggersParser(node.content.triggers)

    return (
        `<ActionButton${contentXML}${id}>` +
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