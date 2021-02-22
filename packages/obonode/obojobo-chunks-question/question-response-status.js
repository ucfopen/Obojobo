import React from 'react'
import { CSSTransition } from 'react-transition-group'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { QuestionResponseSendStates } = Viewer.stores.questionStore
const { Throbber } = Common.components

const QuestionResponseStatus = ({ responseSendState, timeout }) => {
	return (
		<div className="response-status-container">
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
					<Throbber />
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
