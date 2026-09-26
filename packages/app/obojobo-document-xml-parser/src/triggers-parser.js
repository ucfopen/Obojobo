const parseTriggers = el => {
	const t = el.elements.map(triggerEl => {
		return {
			type: triggerEl.attributes.type,
			actions: parseActions(triggerEl.updated[0].updated)
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
		if (values) rtn.updated = values
		return rtn
	})
}

const parseValues = actionEl => {
	if (actionEl.attributes && actionEl.attributes.updated) return actionEl.attributes.updated
	if (!actionEl.updated || actionEl.updated.length === 0) return null
	const updated = {}
	for (const attrName in actionEl.updated[0].attributes) {
		updated[attrName] = actionEl.updated[0].attributes[attrName]
	}

	return updated
}

module.exports = parseTriggers
