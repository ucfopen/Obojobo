let parseScoreActions = (el) => {
	return (
		el.elements.map( (child) => { return child.value } )
	)
}

let parseScoreAction = (el) => {
	let attrs = el.attributes

	// Transform legacy "from" and "to" properties to new "for" property:
	if(
		typeof attrs.from !== 'undefined'
		&& typeof attrs.to !== 'undefined'
		&& typeof attrs.for === 'undefined'
	) {
		attrs.for = "[" + attrs.from + "," + attrs.to + "]"
	}

	delete attrs.from
	delete attrs.to

	return {
		for: el.attributes.for,
		page: el.elements[0]
	}
}

module.exports = {
	parseScoreActions: parseScoreActions,
	parseScoreAction: parseScoreAction
}