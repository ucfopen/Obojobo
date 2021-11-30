const parseObjectives = el => {
	const obj = el.elements.map(objectivesEl => {
		if (objectivesEl.value === null) {
			return { objectiveId: objectivesEl.attributes.id }
		}
		return {
			objectiveId: objectivesEl.attributes.id,
			objectiveLabel: objectivesEl.attributes.label,
			description: objectivesEl.value[0].text
		}
	})
	return obj
}
module.exports = parseObjectives
