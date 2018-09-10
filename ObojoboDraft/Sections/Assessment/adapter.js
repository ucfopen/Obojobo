import ScoreActions from './post-assessment/score-actions'
// @TODO: Importing from the server code, we shouldn't do this:
import AssessmentRubric from '../../../server/assessment-rubric'

const Adapter = {
	construct(model, attrs) {
		if (attrs && attrs.content && attrs.content.scoreActions) {
			model.modelState.scoreActions = new ScoreActions(attrs.content.scoreActions)
		} else {
			model.modelState.scoreActions = new ScoreActions()
		}

		if (attrs && attrs.content && attrs.content.rubric) {
			model.modelState.rubric = new AssessmentRubric(attrs.content.rubric)
		} else {
			model.modelState.rubric = new AssessmentRubric()
		}

		model.setStateProp(
			'attempts',
			Infinity,
			p => (('' + p).toLowerCase() === 'unlimited' ? Infinity : parseInt(p, 10))
		)
		model.setStateProp('review', 'never', p => p.toLowerCase(), [
			'never',
			'always',
			'no-attempts-remaining'
		])
	},

	clone(model, clone) {
		clone.modelState.attempts = model.modelState.attempts
		clone.modelState.scoreActions = model.modelState.scoreActions.clone()
		clone.modelState.rubric = model.modelState.rubric.clone()
	},

	toJSON(model, json) {
		json.content.attempts = model.modelState.attempts
		json.content.scoreActions = model.modelState.scoreActions.toObject()
		json.content.rubric = model.modelState.rubric.toObject()
	}
}

export default Adapter
