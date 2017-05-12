import ObojoboDraft from 'ObojoboDraft';

import AssessmentUtil from 'Viewer/util/assessment-util';
import ScoreUtil from 'Viewer/util/score-util';
import QuestionUtil from 'Viewer/util/question-util';
import APIUtil from 'Viewer/util/api-util';
import NavUtil from 'Viewer/util/nav-util';

let { Store } = ObojoboDraft.flux;
let { Dispatcher } = ObojoboDraft.flux;
let { OboModel } = ObojoboDraft.models;
let { ErrorUtil } = ObojoboDraft.util;
let { SimpleDialog } = ObojoboDraft.components.modal;
let { ModalUtil } = ObojoboDraft.util;

let getNewAssessmentObject = () =>
	({
		current: null,
		currentResponses: [],
		attempts: []
	})
;

let startAssessmentAttempt = function(state, attemptObject) {
	let id = attemptObject.assessmentId;
	let model = OboModel.models[id];

	model.children.at(1).children.reset();
	for (let child of Array.from(attemptObject.state.questions)) {
		let c = OboModel.create(child);
		model.children.at(1).children.add(c);
	}

	if (!state.assessments[id]) {
		state.assessments[id] = getNewAssessmentObject();
	}

	state.assessments[id].current = attemptObject;

	NavUtil.rebuildMenu(model.getRoot());
	NavUtil.goto(id);

	return model.processTrigger('onStartAttempt');
};


class AssessmentStore extends Store {
	constructor() {
		let assessment, id, model;
		super('assessmentstore');

		Dispatcher.on('assessment:startAttempt', payload => {
			({ id } = payload.value);
			model = OboModel.models[id];

			return APIUtil.startAttempt(model.getRoot(), model, {})
			.then(res => {
				if (res.status === 'error') {
					switch (res.value.message.toLowerCase()) {
						case 'attempt limit reached':
							return ErrorUtil.show('No attempts left', "You have attempted this assessment the maximum number of times available.");
							break;
						default:
							return ErrorUtil.errorResponse(res);
					}
				}

				startAssessmentAttempt(this.state, res.value);
				return this.triggerChange();
			});
		});

		Dispatcher.on('assessment:endAttempt', payload => {
			({ id } = payload.value);
			model = OboModel.models[id];

			assessment = this.state.assessments[id];

			return APIUtil.endAttempt(assessment.current)
			.then(res => {
				if (res.status === 'error') { return ErrorUtil.errorResponse(res); }

				assessment.current.state.questions.forEach(question => QuestionUtil.hideQuestion(question.id));

				assessment.currentResponses.forEach(responderId => QuestionUtil.resetResponse(responderId));

				assessment.attempts.push(res.value);
				assessment.current = null;

				model.processTrigger('onEndAttempt');
				return this.triggerChange();
			});
		});

		Dispatcher.on('question:recordResponse', payload => {
			({ id } = payload.value);
			model = OboModel.models[id];

			assessment = AssessmentUtil.getAssessmentForModel(this.state, model);
			// if typeof assessment?.current?.responses[id] isnt "undefined"
			// debugger

			if ((assessment != null ? assessment.currentResponses : undefined) != null) {
				assessment.currentResponses.push(id);
			}

			if ((assessment != null ? assessment.current : undefined) != null) {
				let questionModel = model.getParentOfType('ObojoboDraft.Chunks.Question');

				return APIUtil.postEvent(model.getRoot(), 'assessment:recordResponse', {
					attemptId: assessment.current.attemptId,
					questionId: questionModel.get('id'),
					responderId: id,
					response: payload.value.response
				})
				.then(res => {
					// APIUtil.recordQuestionResponse assessment.current, questionModel, payload.value.response

					// @triggerChange()
					if (res.status === 'error') { return ErrorUtil.errorResponse(res); }
					return this.triggerChange();
				});
			}
		});
	}

	init(history) {
		let question;
		if (history == null) { history = []; }
		this.state = {
			assessments: {}
		};

		history.sort((a, b) => (new Date(a.startTime)).getTime() > (new Date(b.startTime)).getTime());

		let unfinishedAttempt = null;
		let nonExistantQuestions = [];

		for (let attempt of Array.from(history)) {
			if (!this.state.assessments[attempt.assessmentId]) {
				this.state.assessments[attempt.assessmentId] = getNewAssessmentObject();
			}

			if (!attempt.endTime) {
				// @state.assessments[attempt.assessmentId].current = attempt
				unfinishedAttempt = attempt;
			} else {
				this.state.assessments[attempt.assessmentId].attempts.push(attempt);
			}

			for (question of Array.from(attempt.state.questions)) {
				if (!OboModel.models[question.id]) {
					nonExistantQuestions.push(question);
				}
			}
		}

		for (question of Array.from(nonExistantQuestions)) {
			OboModel.create(question);
		}

		if (unfinishedAttempt) {
			return ModalUtil.show(<SimpleDialog ok title='Resume Attempt' onConfirm={this.onResumeAttemptConfirm.bind(this, unfinishedAttempt)}><p>It looks like you were in the middle of an attempt. We'll resume you where you left off.</p></SimpleDialog>);
		}
	}
			//startAssessmentAttempt(attempt)

	onResumeAttemptConfirm(unfinishedAttempt) {
		ModalUtil.hide();

		startAssessmentAttempt(this.state, unfinishedAttempt);
		return this.triggerChange();
	}

	getState() { return this.state; }

	setState(newState) { return this.state = newState; }
}


let assessmentStore = new AssessmentStore();
export default assessmentStore;
