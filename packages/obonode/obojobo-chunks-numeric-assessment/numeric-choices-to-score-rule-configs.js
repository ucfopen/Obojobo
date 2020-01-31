const { ROUND_TYPE_ROUND_DIGITS, ROUND_TYPE_ROUND_SIG_FIGS } = require('./rule/round-types')

module.exports = numericChoices => {
	return numericChoices.map(choice => {
		const score = parseFloat(choice.score)

		switch (choice.requirement) {
			case 'exact':
				return {
					value: choice.answer,
					feedback: choice.feedback || null,
					score
				}

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

			case 'precise':
				switch (choice.type) {
					case 'decimals':
						return {
							value: choice.answer,
							digits: choice.precision,
							round: ROUND_TYPE_ROUND_DIGITS,
							feedback: choice.feedback || null,
							score
						}

					case 'sig-figs':
						return {
							value: choice.answer,
							sigFigs: choice.precision,
							round: ROUND_TYPE_ROUND_SIG_FIGS,
							feedback: choice.feedback || null,
							score
						}
				}
		}
	})
}
