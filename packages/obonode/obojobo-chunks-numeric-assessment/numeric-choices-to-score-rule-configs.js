const { ROUND_TYPE_ROUND_DECIMAL_DIGITS, ROUND_TYPE_ROUND_SIG_FIGS } = require('./rule/round-types')

module.exports = numericChoices => {
	return numericChoices.map(choice => {
		const score = parseFloat(choice.score)

		switch (choice.requirement) {
			case 'range':
				return {
					value: `[${choice.start},${choice.end}]`,
					feedback: choice.feedback || null,
					score
				}

			case 'margin':
				switch (choice.type) {
					case 'percent':
						return {
							value: choice.answer,
							percentError: choice.margin,
							feedback: choice.feedback || null,
							score
						}

					case 'absolute':
						return {
							value: choice.answer,
							absoluteError: choice.margin,
							feedback: choice.feedback || null,
							score
						}
				}
				break

			case 'exact':
			default:
				return {
					value: choice.answer,
					feedback: choice.feedback || null,
					score
				}
		}
	})
}
