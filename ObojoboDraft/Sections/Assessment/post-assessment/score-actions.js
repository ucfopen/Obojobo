import Common from 'Common'

const getParsedRange = Common.util.RangeParsing.getParsedRange
const isValueInRange = Common.util.RangeParsing.isValueInRange

const replaceDict = {
	'no-score': null
}

class ScoreActions {
	constructor(actions = null) {
		this.originalActions = actions

		if (!actions) actions = []

		this.actions = actions.map(action => {
			let forAttr = action.for

			// Transform legacy to/from to newer "for"
			if (
				typeof action.from !== 'undefined' &&
				typeof action.to !== 'undefined' &&
				typeof action.for === 'undefined'
			) {
				forAttr = '[' + action.from + ',' + action.to + ']'
			}

			return {
				page: action.page,
				range: getParsedRange(forAttr)
			}
		})
	}

	getActionForScore(score) {
		for (const action of this.actions) {
			if (isValueInRange(score, action.range, replaceDict)) return action
		}

		return null
	}

	toObject() {
		return Object.assign([], this.originalActions)
	}

	clone() {
		return new ScoreActions(this.toObject())
	}
}

export default ScoreActions
