const parseScoreActions = el => {
	return el.elements.map(child => {
		return child.value
	})
}

const parseScoreAction = el => {
	return {
		from: el.attributes.from,
		to: el.attributes.to,
		for: el.attributes.for,
		page: el.elements[0]
	}
}

module.exports = {
	parseScoreActions: parseScoreActions,
	parseScoreAction: parseScoreAction
}
