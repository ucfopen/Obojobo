import Common from 'obojobo-document-engine/src/scripts/common'

const getParsedRange = Common.util.RangeParsing.getParsedRange
const isValueInRange = Common.util.RangeParsing.isValueInRange

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

	getAllMatchingActionsForScore(assessmentScore) {
		switch (assessmentScore) {
			case null:
				// If the assessment score is null try to find a score action matching "no-score".
				// In case none exists, include any score action pages for a 0% as well.
				return this.actions
					.filter(action => action.range.min === 'no-score' && action.range.max === 'no-score')
					.concat(this.getAllMatchingActionsForScore(0))

			//0-100
			default:
				// ...else, find any actions where the range is numeric and the numeric assessmentScore value
				// is inside that score action's range
				return this.actions.filter(
					action =>
						action.range.min !== 'no-score' &&
						action.range.max !== 'no-score' &&
						isValueInRange(assessmentScore, action.range)
				)
		}
	}

	getActionForScore(assessmentScore) {
		return this.getAllMatchingActionsForScore(assessmentScore)[0] || null
	}

	toObject() {
		return Object.assign([], this.originalActions)
	}

	clone() {
		return new ScoreActions(this.toObject())
	}
}

export default ScoreActions
