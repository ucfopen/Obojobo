module.exports = numericChoices => {
	return numericChoices.map(choice => {
		const score = parseFloat(choice.content.score)
		const answer = choice.children[0].content
		const feedback = choice.children[1] ? choice.children[1] : null

		switch (answer.requirement) {
			case 'range':
				return {
					updated: `[${answer.start},${answer.end}]`,
					feedback,
					score
				}

			case 'margin':
				switch (answer.type) {
					case 'percent':
						return {
							updated: '' + answer.answer,
							percentError: answer.margin,
							feedback,
							score
						}

					case 'absolute':
						return {
							updated: '' + answer.answer,
							absoluteError: answer.margin,
							feedback,
							score
						}

					default:
						return null
				}

			case 'exact':
			default:
				return {
					updated: '' + answer.answer,
					feedback,
					score
				}
		}
	})
}
