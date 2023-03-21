import React from 'react'
import { CSSTransition } from 'react-transition-group'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

import QuestionFooter from './question-footer'
import QuestionExplanation from './question-explanation'
import QuestionOutcome from './question-outcome'
import QuestionContent from './Content/viewer-component'
import QuestionResponseStatus from './question-response-status'

const { Button } = Common.components
const { OboComponent } = Viewer.components
const { QuestionResponseSendStates } = Viewer.stores.questionStore

const ANIMATION_TRANSITION_TIME_MS = 800

const QuestionComponent = ({
	questionModel,
	questionAssessmentModel,
	questionIndex,
	moduleData,
	resultsRef,
	assessmentComponentRef,
	updateExplanationRef,
	startQuestionAriaLabel,
	type,
	mode,
	isFlipping,
	viewState,
	response,
	shouldShowRevealAnswerButton,
	isAnswerRevealed,
	isShowingExplanation,
	isShowingExplanationButton,
	instructions,
	score,
	scoreClass,
	feedbackText,
	detailedText,
	responseSendState,
	onFormChange,
	onFormSubmit,
	onClickReset,
	onClickReveal,
	onClickShowExplanation,
	onClickHideExplanation,
	onClickBlocker
}) => {
	const isAnswerScored = score !== null
	const hasResponse = response !== null
	const isAssessmentQuestion = mode === 'assessment'
	const isResponseSending = responseSendState === QuestionResponseSendStates.SENDING
	const isFormDisabled = isResponseSending && isAssessmentQuestion
	const QuestionAssessmentComponent = questionAssessmentModel.getComponentClass()

	const classNames =
		'obojobo-draft--chunks--question' +
		` ${scoreClass}` +
		` is-${viewState}` +
		` is-type-${type}` +
		` is-mode-${mode}` +
		isOrNot(isFormDisabled, 'form-disabled') +
		isOrNot(hasResponse, 'responded-to') +
		isOrNot(isFlipping, 'flipping')

	return (
		<OboComponent
			model={questionModel}
			moduleData={moduleData}
			className={classNames}
			role="region"
			aria-label="Question"
			tag="form"
			onChange={onFormChange}
			onSubmit={onFormSubmit}
		>
			<div className="flipper">
				<div className="content-back">
					<QuestionContent model={questionModel} moduleData={moduleData} />
					{isAnswerScored ? (
						<div className="for-screen-reader-only" ref={resultsRef} tabIndex="-1">
							<QuestionOutcome
								score={score}
								type={type}
								feedbackText={feedbackText}
								detailedText={detailedText}
								isForScreenReader
							/>
						</div>
					) : null}
					<fieldset disabled={isFormDisabled}>
						<legend className="instructions">{instructions}</legend>
						<div className="assessment-component">
							<QuestionAssessmentComponent
								ref={assessmentComponentRef}
								key={questionAssessmentModel.get('id')}
								model={questionAssessmentModel}
								moduleData={moduleData}
								mode={mode}
								type={type}
								hasResponse={hasResponse}
								score={score}
								scoreClass={scoreClass}
								feedbackText={feedbackText}
								detailedText={detailedText}
								questionModel={questionModel}
								response={response}
								disabled={isFormDisabled}
							/>
						</div>
					</fieldset>
					{!isAssessmentQuestion ? (
						<QuestionFooter
							score={score}
							hasResponse={hasResponse}
							shouldShowRevealAnswerButton={shouldShowRevealAnswerButton}
							isAnswerRevealed={isAnswerRevealed}
							mode={mode}
							type={type}
							feedbackText={feedbackText}
							detailedText={detailedText}
							onClickReset={onClickReset}
							onClickReveal={onClickReveal}
						/>
					) : null}
					<CSSTransition
						in={isShowingExplanationButton}
						classNames="explanation"
						timeout={ANIMATION_TRANSITION_TIME_MS}
					>
						{isShowingExplanationButton ? (
							<QuestionExplanation
								ref={updateExplanationRef}
								isShowingExplanation={isShowingExplanation}
								solutionModel={questionModel.modelState.solution}
								moduleData={moduleData}
								animationTransitionTime={ANIMATION_TRANSITION_TIME_MS}
								onClickShowExplanation={onClickShowExplanation}
								onClickHideExplanation={onClickHideExplanation}
							/>
						) : (
							<span />
						)}
					</CSSTransition>
				</div>
				<div className="blocker-front" key="blocker" onClick={onClickBlocker}>
					<Button
						value={mode === 'practice' ? 'Try Question' : 'Start Question'}
						ariaLabel={startQuestionAriaLabel}
						disabled={viewState !== 'hidden'}
					/>
				</div>
			</div>
			{isAssessmentQuestion ? (
				<QuestionResponseStatus
					responseSendState={responseSendState}
					timeout={ANIMATION_TRANSITION_TIME_MS}
					questionIndex={questionIndex}
				/>
			) : null}
		</OboComponent>
	)
}

export default QuestionComponent
