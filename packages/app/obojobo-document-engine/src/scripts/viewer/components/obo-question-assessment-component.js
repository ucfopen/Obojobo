import React from 'react'

export default class OboQuestionAssessmentComponent extends React.Component {
	// Determines what the default option for this question assessment should be for
	// revealAnswer, which should be one of 'never', 'always' or 'when-incorrect'.
	static getRevealAnswerDefault(/*questionModel, questionAssessmentModel*/) {
		return 'never'
	}

	// This text is displayed at the bottom of the question when submitted.
	// This can be used to give the user more feedback as to why a question was scored
	// the way it was.
	static getDetails(/*questionModel, questionAssessmentModel, score*/) {
		return null
	}

	// This text is displayed right above the question assessment, and is used
	// to inform the user how to interact with this question
	static getInstructions(/*questionModel, questionAssessmentModel*/) {
		return null
	}

	// Used to determine what an empty response is from a user, which each question
	// assessment can structure its responses in any format
	static isResponseEmpty(/*response*/) {
		return true
	}

	// Used to determine if the users' response is "valid" - this is called when submitting
	// a response but before it is graded and the response saved in the QuestionStore.
	// If false is returned execution is halted and the response is not graded. You can
	// optionally perform other tasks here, such as displaying error messages or updating
	// form input validity
	checkIfResponseIsValid() {
		return true
	}

	// Called when a non-survey question is submitted and the score needs to be calculated.
	// Should output an object of the form { score, details }, where score is
	// the 0-100 score of a students response, and details are any arbitrary additional
	// data to be included with the response in QuestionStore (if this is not needed,
	// set details to null).
	calculateScore() {
		return null
	}

	// Called when the user submits a question, and should return an object with three values,
	// state - the data structure of the response, targetId - any related obo node id for the
	// response, and sendResponseImmediately. If sendResponseImmediately is true Obojobo will
	// send the response to the server as soon as the question is submitted. If false, it is up
	// to the question assessment to call QuestionUtil.sendResponse manually.
	handleFormChange(/*event, prevResponse*/) {
		return {
			state: null,
			targetId: null,
			sendResponseImmediately: false
		}
	}

	getRevealAnswerDefault() {
		return this.constructor.getRevealAnswerDefault(this.props.questionModel, this.props.model)
	}

	getDetails(newScore) {
		return this.constructor.getDetails(this.props.questionModel, this.props.model, newScore)
	}

	getInstructions() {
		return this.constructor.getInstructions(this.props.questionModel, this.props.model)
	}

	render() {
		return null
	}
}
