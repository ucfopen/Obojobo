const xmlEncode = require('./xml-encode')
const processAttrs = require('./process-attrs')

const triggersParser = triggers => {
	if (!triggers) return ''

	let triggersBodyXML = ''
	triggers.forEach(trigger => {
		if (!trigger.actions) return

		let triggerXML = ''
		let actionsBodyXML = ''

		// Parser actions in each trigger
		trigger.actions.forEach(action => {
			const attrs = processAttrs(action.value, [])
			actionsBodyXML += `<action type="${action.type}">` + `<value${attrs} />` + `</action>`
		})

		let actionsXML = ''
		if (actionsBodyXML !== '') {
			actionsXML = `<actions>` + actionsBodyXML + `</actions>`
			triggerXML = `<trigger type="${xmlEncode(trigger.type)}">` + actionsXML + `</trigger>`
		}

		triggersBodyXML += triggerXML
	})

	const triggersXML = triggersBodyXML !== '' ? `<triggers>` + triggersBodyXML + `</triggers>` : ''

	return triggersXML
}

module.exports = triggersParser
