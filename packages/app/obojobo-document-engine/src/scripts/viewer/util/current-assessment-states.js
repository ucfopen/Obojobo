const CurrentAssessmentStates = {
	NO_ATTEMPT: 'noAttempt',
	NO_QUESTIONS: 'noQuestions',
	HAS_RESPONSES_WITH_ERROR_SEND_STATES: 'hasResponsesWithErrorSendStates',
	HAS_RESPONSES_WITH_UNKNOWN_SEND_STATES: 'hasResponsesWithUnknownSendStates',
	HAS_QUESTIONS_UNANSWERED: 'hasQuestionsUnanswered',
	HAS_QUESTIONS_EMPTY: 'hasQuestionsEmpty',
	HAS_RESPONSES_UNSENT: 'hasResponsesUnsent',
	HAS_RESPONSES_SENDING: 'hasResponsesSending',
	READY_TO_SUBMIT: 'readyToSubmit',
	UNKNOWN: 'unknown'
}

export default CurrentAssessmentStates
