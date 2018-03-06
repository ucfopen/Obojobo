import './viewer-component.scss'

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

import Common from 'Common'
import Viewer from 'Viewer'

let { OboComponent } = Common.components
let { Dispatcher } = Common.flux
let { FocusUtil } = Common.util
let { Button } = Common.components

let { QuestionUtil } = Viewer.util

import QuestionContent from './Content/viewer-component'

export default class Question extends React.Component {
	onClickBlocker() {
		QuestionUtil.viewQuestion(this.props.model.get('id'))

		if (this.props.model.modelState.mode === 'practice') {
			return FocusUtil.focusComponent(this.props.model.get('id'))
		}
	}

	render() {
		if (this.props.showContentOnly) {
			return this.renderContentOnly()
		}

		let score = QuestionUtil.getScoreForModel(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
		let viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model)

		let assessment = this.props.model.children.models[this.props.model.children.models.length - 1]
		let AssessmentComponent = assessment.getComponentClass()

		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={`flip-container obojobo-draft--chunks--question${score === null
					? ''
					: score === 100 ? ' is-correct' : ' is-incorrect'} ${this.props.mode === 'review'
					? 'is-active'
					: `is-${viewState}`}`}
			>
				<div className="flipper">
					<div className="content back">
						<QuestionContent model={this.props.model} moduleData={this.props.moduleData} />
						<AssessmentComponent
							key={assessment.get('id')}
							model={assessment}
							moduleData={this.props.moduleData}
							mode={this.props.mode ? this.props.mode : this.props.model.modelState.mode}
						/>
					</div>
					<div className="blocker front" key="blocker" onClick={this.onClickBlocker.bind(this)}>
						<Button
							value={
								this.props.model.modelState.mode === 'practice' ? 'Try Question' : 'View Question'
							}
						/>
					</div>
				</div>
			</OboComponent>
		)
	}

	renderContentOnly(context) {
		let score = QuestionUtil.getScoreForModel(
			this.props.moduleData.questionState,
			this.props.model,
			this.props.moduleData.navState.context
		)
		let viewState = QuestionUtil.getViewState(this.props.moduleData.questionState, this.props.model)
		return (
			<OboComponent
				model={this.props.model}
				moduleData={this.props.moduleData}
				className={`flip-container obojobo-draft--chunks--question${score === null
					? ''
					: score === 100 ? ' is-correct' : ' is-incorrect'} is-active is-mode${this.props.model
					.modelState.mode}`}
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
