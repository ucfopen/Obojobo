import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'
import isOrNot from '../../../src/scripts/common/isornot'

const { OboComponent } = Common.components
const { FocusUtil } = Common.util
const { Button } = Common.components

const { QuestionUtil } = Viewer.util

import QuestionContent from './Content/viewer-component'

export default class Question extends React.Component {
	onClickBlocker() {
		QuestionUtil.viewQuestion(this.props.model.get('id'))
		const mode = this.props.mode ? this.props.mode : this.props.model.modelState.mode

		FocusUtil.focusComponent(this.props.model.get('id'), mode === 'practice')
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
		const viewState = QuestionUtil.getViewState(
			this.props.moduleData.questionState,
			this.props.model
		)

		const assessment = this.props.model.children.models[this.props.model.children.models.length - 1]
		const AssessmentComponent = assessment.getComponentClass()

		const mode = this.props.mode ? this.props.mode : this.props.model.modelState.mode

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

		const classNames =
			'obojobo-draft--chunks--question' +
			scoreClassName +
			(mode === 'review' ? ' is-active' : ` is-${viewState}`) +
			` is-mode-${mode}`

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={classNames}
				tabIndex="-1"
			>
				<div className="flipper">
					<div className="content-back">
						<QuestionContent model={this.props.model} moduleData={this.props.moduleData} />
						<AssessmentComponent
							key={assessment.get('id')}
							model={assessment}
							moduleData={this.props.moduleData}
							mode={mode}
						/>
					</div>
					<div className="blocker-front" key="blocker" onClick={this.onClickBlocker.bind(this)}>
						<Button value={mode === 'practice' ? 'Try Question' : 'View Question'} />
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

		const mode = this.props.mode ? this.props.mode : this.props.model.modelState.mode

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
			>
				<div className="flipper">
					<div className="content back">
						<QuestionContent model={this.props.model} moduleData={this.props.moduleData} />
						<div className="pad responses-hidden">(Responses Hidden)</div>
					</div>
				</div>
			</OboComponent>
		)
	}
}
