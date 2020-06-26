const { ROUND_TYPE_ROUND_DECIMAL_DIGITS, ROUND_TYPE_ROUND_SIG_FIGS } = require('./rule/round-types')

module.exports = numericChoices => {
	return numericChoices.map(choice => {
		const score = parseFloat(choice.content.score)
		const answer = choice.children[0].content

		switch (answer.requirement) {
			case 'range':
				return {
					value: `[${answer.start},${answer.end}]`,
					feedback: answer.feedback || null,
					score
				}

			case 'margin':
				switch (answer.type) {
					case 'percent':
						return {
							value: '' + answer.answer,
							percentError: answer.margin,
							feedback: answer.feedback || null,
							score
						}

					case 'absolute':
						return {
							value: '' + answer.answer,
							absoluteError: answer.margin,
							feedback: answer.feedback || null,
							score
						}
				}
				break

			case 'exact':
			default:
				return {
					value: '' + answer.answer,
					feedback: answer.feedback || null,
					score
				}
		}
	})
}
