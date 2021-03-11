module.exports = numericChoices => {
	return numericChoices.map(choice => {
		const score = parseFloat(choice.content.score)
		const answer = choice.children[0].content
		const feedback = choice.children[1] ? choice.children[1] : null

		switch (answer.requirement) {
			case 'range':
				return {
					value: `[${answer.start},${answer.end}]`,
					feedback,
					score
				}

			case 'margin':
				switch (answer.type) {
					case 'percent':
						return {
							value: '' + answer.answer,
							percentError: answer.margin,
							feedback,
							score
						}

					case 'absolute':
						return {
							value: '' + answer.answer,
							absoluteError: answer.margin,
							feedback,
							score
						}
				}
				break

			case 'exact':
			default:
				return {
					value: '' + answer.answer,
					feedback,
					score
				}
		}

		return null
	})
}
