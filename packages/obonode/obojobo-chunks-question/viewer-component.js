import './viewer-component.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { OboComponent } = Viewer.components
const { FocusUtil, QuestionUtil } = Viewer.util
const { Button } = Common.components
const { focus } = Common.page

import QuestionContent from './Content/viewer-component'

// 0.4s Card "flip" time plus an extra 50ms to handle delay
const DURATION_FLIP_TIME_MS = 450

export default class Question extends React.Component {
	constructor() {
		super()

		this.state = {
			isFlipping: false
		}
	}

	static focusOnContent(model) {
		const el = model.getDomEl()
		const isHidden = el.classList.contains('is-hidden')
		let focusableEl = null

		// If question is hidden then we focus on the button to "flip" the question over.
		// Otherwise, focus on the first thing inside the question:
		if (isHidden) {
			focusableEl = el.querySelector('.blocker-front button')
		} else {
			const firstModel = model.children.at(0)
			if (firstModel) focusableEl = firstModel.getDomEl()
		}

		if (!focusableEl) return false

		focus(focusableEl)
		return true
	}

	onClickBlocker() {
		QuestionUtil.viewQuestion(this.props.model.get('id'))
		const mode = this.props.model.modelState.mode

		FocusUtil.focusComponent(this.props.model.get('id'), { fade: mode === 'practice' })

		this.applyFlipCSS()
	}

	// Temporarily set the state to 'isFlipping', causing the card to play the flip animation.
	// The flipping state is removed after the flip is completed to be able to remove CSS
	// transforms, which can cause rendering issues.
	applyFlipCSS() {
		this.setState({ isFlipping: true })
		setTimeout(() => this.setState({ isFlipping: false }), DURATION_FLIP_TIME_MS)
	}

	isInAssessment() {
		console.log('---------->', this.props.model.getParentOfType('ObojoboDraft.Sections.Assessment'))
		return this.props.model.getParentOfType('ObojoboDraft.Sections.Assessment') !== null
	}

	render() {
		if (this.props.showContentOnly) {
			return this.renderContentOnly()
		}

		const score = QuestionUtil.getScoreForModel(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
		const viewState = this.props.isReview
			? 'active'
			: QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model)

		const assessment = this.props.model.children.models[this.props.model.children.models.length - 1]

		const AssessmentComponent = assessment.getComponentClass()

		const mode = this.props.model.modelState.mode

		let scoreClassName
		switch (score) {
			case null:
				scoreClassName = ''
				break

			case 100:
				scoreClassName = ' is-correct'
				break

			default:
				scoreClassName = ' is-not-correct'
				break
		}

		let startQuestionAriaLabel
		if (mode === 'practice') {
			startQuestionAriaLabel = 'Try Question'
		} else {
			startQuestionAriaLabel =
				'Start Question ' + (this.props.questionIndex + 1) + ' of ' + this.props.numQuestionsInBank
		}

		const classNames =
			'obojobo-draft--chunks--question' +
			scoreClassName +
			` is-${viewState}` +
			` is-mode-${mode}` +
			isOrNot(this.props.isReview, 'review') +
			isOrNot(this.state.isFlipping, 'flipping')

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={classNames}
				role="region"
				aria-label="Question"
			>
				{/* <h1>{this.props.model.modelState.mode}</h1> */}
				<div className="flipper">
					<div className="content-back">
						<QuestionContent model={this.props.model} moduleData={this.props.moduleData} />
						<AssessmentComponent
							key={assessment.get('id')}
							model={assessment}
							moduleData={this.props.moduleData}
							mode={mode}
							isReview={this.props.isReview}
							isInAssessment={this.isInAssessment()}
						/>
					</div>
					<div className="blocker-front" key="blocker" onClick={this.onClickBlocker.bind(this)}>
						<Button
							value={mode === 'practice' ? 'Try Question' : 'Start Question'}
							ariaLabel={startQuestionAriaLabel}
							disabled={viewState !== 'hidden'}
						/>
					</div>
				</div>
			</OboComponent>
		)
	}

	renderContentOnly() {
		const score = QuestionUtil.getScoreForModel(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)

		const mode = this.props.model.modelState.mode

		const className =
			'obojobo-draft--chunks--question' +
			isOrNot(score === 100, 'correct') +
			' is-active' +
			` is-mode-${mode}`

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={className}
				tabIndex="-1"
				role="region"
				aria-label="Question"
			>
				<div className="flipper">
					<div className="content-back">
						<QuestionContent model={this.props.model} moduleData={this.props.moduleData} />
						<div className="pad responses-hidden">(Responses Hidden)</div>
					</div>
				</div>
			</OboComponent>
		)
	}
}
