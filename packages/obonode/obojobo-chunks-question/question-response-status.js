import React from 'react'
import { CSSTransition } from 'react-transition-group'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { QuestionResponseSendStates } = Viewer.stores.questionStore
const { Spinner } = Common.components

const responseStatusCache = {}

const getResponseStatusUpdate = (questionIndex, responseSendState) => {
	if (questionIndex in responseStatusCache) {
		if (responseStatusCache[questionIndex] !== responseSendState && responseSendState !== null) {
			responseStatusCache[questionIndex] = responseSendState

			switch (responseSendState) {
				case QuestionResponseSendStates.RECORDED:
					return `Answer saved for question ${questionIndex + 1}`
				case QuestionResponseSendStates.ERROR:
					return `Error sending response for question ${questionIndex + 1}`
				default:
					return ''
			}
		}
	} else {
		responseStatusCache[questionIndex] = responseSendState
	}
}

const QuestionResponseStatus = ({ responseSendState, timeout, questionIndex }) => {
	const screenReaderText = getResponseStatusUpdate(questionIndex, responseSendState)

	return (
		<div className="response-status-container">
			<div aria-live="polite" className="sr-response-status">
				{screenReaderText}
			</div>
			<CSSTransition
				in={responseSendState === QuestionResponseSendStates.NOT_SENT}
				classNames="response-status"
				timeout={timeout}
			>
				<span className="is-response-state-not-sent">&nbsp;</span>
			</CSSTransition>

			<CSSTransition
				in={responseSendState === QuestionResponseSendStates.SENDING}
				classNames="response-status"
				timeout={timeout}
			>
				<span className="is-response-state-sending">
					<Spinner />
				</span>
			</CSSTransition>

			<CSSTransition
				in={responseSendState === QuestionResponseSendStates.RECORDED}
				classNames="response-status"
				timeout={timeout}
			>
				<span className="is-response-state-recorded">Answer Saved</span>
			</CSSTransition>

			<CSSTransition
				in={responseSendState === QuestionResponseSendStates.ERROR}
				classNames="response-status"
				timeout={timeout}
			>
				<span className="is-response-state-error">✖ Error sending response</span>
			</CSSTransition>

			<CSSTransition in={!responseSendState} classNames="response-status" timeout={timeout}>
				<span className="is-response-state-other">&nbsp;</span>
			</CSSTransition>
		</div>
	)
}

export default QuestionResponseStatus
