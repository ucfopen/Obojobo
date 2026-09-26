const parseObjectives = el => {
	const obj = el.elements.map(objectivesEl => {
		if (objectivesEl.updated === null) {
			return { objectiveId: objectivesEl.attributes.id }
		}

		return {
			objectiveId: objectivesEl.attributes.id,
			objectiveLabel: objectivesEl.attributes.label,
			description: objectivesEl.updated[0].text
		}
	})

	return obj
}

module.exports = parseObjectives
