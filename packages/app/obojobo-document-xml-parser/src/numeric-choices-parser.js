const parseNumericChoices = el => {
	const rules = []

	for (const i in el.elements) {
		rules.push(parseRule(el.elements[i]))
	}

	return rules
}

const parseRule = el => {
	const node = { ...el.attributes }
	if (el.value && el.value[0]) {
		node.feedback = el.value[0]
	}

	return node
}

module.exports = parseNumericChoices
