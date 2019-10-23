import NumericRule from './rule/numeric-rule'

const Adapter = {
	construct(model, attrs) {
		const content = attrs && attrs.content ? attrs.content : {}

		const scoreRules = content.numericChoices.map(choice => {
			console.log('choice', choice)

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
								feedback: choice.feedback || null,
								score
							}

						case 'sig-figs':
							return {
								value: choice.answer,
								sigFigs: choice.precision,
								feedback: choice.feedback || null,
								score
							}
					}
			}
		})

		model.modelState.scoreRules = scoreRules

		console.log('sr', scoreRules)
	},

	clone(model, clone) {},

	toJSON(model, json) {}
}

export default Adapter
