import Common from 'Common'

let getParsedRange = Common.util.RangeParsing.getParsedRange
let isValueInRange = Common.util.RangeParsing.isValueInRange

let replaceDict = {
	'no-score': null
}

class ScoreActions {
	constructor(actions) {
		this.originalActions = actions

		this.actions = (actions == null ? [] : actions).map(action => {
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
		for (let action of this.actions) {
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
