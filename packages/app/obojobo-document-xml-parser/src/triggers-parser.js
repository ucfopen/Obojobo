const parseTriggers = el => {
	const t = el.elements.map(triggerEl => {
		return {
			type: triggerEl.attributes.type,
			actions: parseActions(triggerEl.value[0].value)
		}
	})

	return t
}

const parseActions = actionsArray => {
	return actionsArray.map(actionEl => {
		const values = parseValues(actionEl)
		const rtn = {
			type: actionEl.attributes.type
		}
		if (values) rtn.value = values
		return rtn
	})
}

const parseValues = actionEl => {
	if (actionEl.attributes && actionEl.attributes.value) return actionEl.attributes.value
	if (!actionEl.value || actionEl.value.length === 0) return null
	const value = {}
	for (const attrName in actionEl.value[0].attributes) {
		value[attrName] = actionEl.value[0].attributes[attrName]
	}

	return value
}

module.exports = parseTriggers
