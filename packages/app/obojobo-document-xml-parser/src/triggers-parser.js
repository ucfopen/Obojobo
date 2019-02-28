let parseTriggers = (el) => {
	let t = el.elements.map( (triggerEl) => {
		return ({
			type: triggerEl.attributes.type,
			actions: parseActions(triggerEl.value[0].value)
		})
	});
	
	return t;
}

let parseActions = (actionsArray) => {
	return actionsArray.map( (actionEl) => {
		let values = parseValues(actionEl)
		let rtn = {
			type: actionEl.attributes.type
		};
		if(values) rtn.value = values;
		return rtn
	})
}

let parseValues = (actionEl) => {
	if(actionEl.attributes && actionEl.attributes.value) return actionEl.attributes.value;
	if(!actionEl.value || actionEl.value.length === 0) return null;
	let value = {}
	for(let attrName in actionEl.value[0].attributes) {
		value[attrName] = actionEl.value[0].attributes[attrName]
	}

	return value
}

module.exports = parseTriggers



