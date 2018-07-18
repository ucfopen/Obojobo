let parseChartConfiguration = el => {
	let json = null

	if (!(el.elements && el.elements[0] && el.elements[0].cdata)) return null
	try {
		json = JSON.parse(el.elements[0].cdata)
	} catch (e) {
		json = null
	}

	return json
}

module.exports = parseChartConfiguration
