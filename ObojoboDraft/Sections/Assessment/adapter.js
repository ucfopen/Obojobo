import ScoreActions from './score-actions'

let Adapter = {
	construct(model, attrs) {
		// Default state.
		model.modelState.attempts = Infinity
		model.modelState.review = 'never'
		model.modelState.scoreActions = new ScoreActions()

		// Set state if XML has the attributes.
		if (attrs && attrs.content) {
			model.modelState.attempts =
				attrs.content.attempts === 'unlimited' ? Infinity : parseInt(attrs.content.attempts, 10)
			model.modelState.review = attrs.content.review || 'never'
			model.modelState.scoreActions = new ScoreActions(attrs.content.scoreActions || null)
		}
	},

	// model.modelState.assessmentState =
	// 	inTest: false
	// 	scores: []
	// 	currentScore: 0

	clone(model, clone) {
		clone.modelState.attempts = model.modelState.attempts
		clone.modelState.hideNav = model.modelState.hideNav
		return (clone.modelState.scoreActions = model.modelState.scoreActions.clone())
	},

	//@TODO - necessary?
	// clone.modelState.assessmentState =
	// 	inTest: model.modelState.assessmentState.inTest
	// 	currentScore: model.modelState.assessmentState.currentScore
	// 	scores: Object.assign [], model.modelState.assessmentState.scores

	toJSON(model, json) {
		json.content.attempts = model.modelState.attempts
		json.content.hideNav = model.modelState.hideNav
		return (json.content.scoreActions = model.modelState.scoreActions.toObject())
	}
}

export default Adapter
function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined
}
