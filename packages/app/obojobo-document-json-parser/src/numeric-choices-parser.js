const processAttrs = require('./process-attrs')

const numericChoicesParser = (numericChoices, childrenParser) => {
	if (!numericChoices) return ''

	const numericChoicesBodyXML = numericChoices
		.map(rule => {
			const attrs = { score: rule.score, requirement: rule.requirement }

			switch (rule.requirement) {
				case 'range':
					attrs.start = rule.start
					attrs.end = rule.end
					break

				case 'margin':
					attrs.answer = rule.answer
					attrs.margin = rule.margin
					attrs.type = rule.type
					break

				case 'precise':
					attrs.type = rule.type
					attrs.precision = rule.precision
					attrs.answer = rule.answer
					break

				case 'exact':
				default:
					attrs.requirement = 'exact'
					attrs.answer = rule.answer
					break
			}

			const attrsXML = processAttrs(attrs, [])

			if (rule.feedback) {
				return `<rule${attrsXML}>${childrenParser([rule.feedback])}</rule>`
			} else {
				return `<rule${attrsXML} />`
			}
		})
		.join('')

	return `<numericChoices>` + numericChoicesBodyXML + `</numericChoices>`
}

module.exports = numericChoicesParser
