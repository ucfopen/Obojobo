import ScoreActions from './score-actions';

let Adapter = {
	construct(model, attrs) {
		if (__guard__(attrs != null ? attrs.content : undefined, x => x.attempts) != null) {
			if (attrs.content.attempts === 'unlimited') {
				model.modelState.attempts = Infinity;
			} else {
				model.modelState.attempts = parseInt(attrs.content.attempts, 10);
			}
		} else {
			model.modelState.attempts = Infinity;
		}

		if (__guard__(attrs != null ? attrs.content : undefined, x1 => x1.scoreActions) != null) {
			return model.modelState.scoreActions = new ScoreActions(attrs.content.scoreActions);
		} else {
			return model.modelState.scoreActions = new ScoreActions();
		}
	},

		// model.modelState.assessmentState =
		// 	inTest: false
		// 	scores: []
		// 	currentScore: 0


	clone(model, clone) {
		clone.modelState.attempts = model.modelState.attempts;
		clone.modelState.hideNav = model.modelState.hideNav;
		return clone.modelState.scoreActions = model.modelState.scoreActions.clone();
	},

		//@TODO - necessary?
		// clone.modelState.assessmentState =
		// 	inTest: model.modelState.assessmentState.inTest
		// 	currentScore: model.modelState.assessmentState.currentScore
		// 	scores: Object.assign [], model.modelState.assessmentState.scores

	toJSON(model, json) {
		json.content.attempts = model.modelState.attempts;
		json.content.hideNav = model.modelState.hideNav;
		return json.content.scoreActions = model.modelState.scoreActions.toObject();
	}
};


export default Adapter;
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}