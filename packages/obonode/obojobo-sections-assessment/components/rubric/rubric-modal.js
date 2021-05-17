import './rubric-modal.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import ModProperties from './mod-properties'
import Common from 'obojobo-document-engine/src/scripts/common'

const getParsedRange = Common.util.RangeParsing.getParsedRange
const { SimpleDialog } = Common.components.modal
const { Button } = Common.components

class RubricModal extends React.Component {
	constructor(props) {
		super(props)

		const content = Object.assign({}, this.props.element.content)

		// Formatting content from props to properly update the state here and send
		// it back to parent component.
		content['passingAttemptScore'] =
			typeof content.passingAttemptScore !== 'undefined' ? content.passingAttemptScore : 100
		content['passedResult'] =
			typeof content.passedResult !== 'undefined' ? content.passedResult : 100
		content['failedResult'] = typeof content.failedResult !== 'undefined' ? content.failedResult : 0
		content['unableToPassResult'] =
			typeof content.unableToPassResult !== 'undefined' ? content.unableToPassResult : null

		this.state = { ...content, showModProperties: false }

		this.selfRef = React.createRef()

		this.showModProperties = this.showModProperties.bind(this)
		this.onChangeState = this.onChangeState.bind(this)
		this.changeRubricType = this.changeRubricType.bind(this)
		this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this)
		this.updateNodeFromState = this.updateNodeFromState.bind(this)
		this.renderModProperties = this.renderModProperties.bind(this)

		this.passedType = this.changeScoreType.bind(this, 'passedType')
		this.failedType = this.changeScoreType.bind(this, 'failedType')
		this.unableToPassType = this.changeScoreType.bind(this, 'unableToPassType')
	}

	onDocumentMouseDown(event) {
		event.stopPropagation()
		if (!this.selfRef.current.contains(event.target)) {
			this.updateNodeFromState()
		}
	}

	updateNodeFromState() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, ...this.state } },
			{ at: path }
		)
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.onDocumentMouseDown)
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.onDocumentMouseDown)
	}

	onChangeState(event) {
		const { name, value } = event.target

		const content = { ...this.state.content }
		content[name] = value

		this.setState({ ...content })
	}

	changeScoreType(typeName, event) {
		const content = {}
		content[typeName] = event.target.value

		this.setState({ ...content })
	}

	changeRubricType(event) {
		const type = event.target.value
		this.setState({ ...this.state.content, type })
	}

	showModProperties() {
		this.setState({ showModProperties: !this.state.showModProperties })
	}

	renderModProperties() {
		const numAttempts = this.props.model.attributes.content.attempts

		return (
			<ModProperties
				mods={this.state.mods}
				attempts={numAttempts}
				updateModProperties={mods => this.setState({ mods })}
			/>
		)
	}

	printRange(range) {
		if (range.min === range.max) {
			const attempt = range.min === '$last_attempt' ? 'the last attempt' : 'attempt ' + range.min
			return <span> If a student passes on {attempt} </span>
		}

		if (range.min === '$last_attempt') range.min = 'the last attempt'
		if (range.max === '$last_attempt') range.max = 'the last attempt'
		return (
			<span>
				{' '}
				If a student passes on attempt {range.min} through {range.max}{' '}
			</span>
		)
	}

	render() {
		const stopPropagation = event => event.stopPropagation()

		let className = 'assessment-score '
		className += this.state.type === 'pass-fail' ? 'add-padding-bottom' : ''

		return (
			<SimpleDialog
				cancelOk
				title="Assessment Scoring"
				onConfirm={() => this.props.onConfirm(this.state)}
				onCancel={this.props.onCancel}
				focusOnFirstElement={null}
			>
				<div className="rubric-modal" ref={this.selfRef}>
					<p>
						The recorded score for this module is the highest assessment score, and will be sent to
						any connected gradebook.{' '}
					</p>
					<fieldset className={className}>
						<legend>How do you want to determine the recorded score?</legend>
						<label>
							<input
								type="radio"
								name="score-type"
								value="highest"
								checked={this.state.type === 'highest'}
								onChange={this.changeRubricType}
								onClick={stopPropagation}
							/>
							Use the highest attempt score.
						</label>
						<label>
							<input
								type="radio"
								name="score-type"
								value="pass-fail"
								checked={this.state.type === 'pass-fail'}
								onChange={this.changeRubricType}
								onClick={stopPropagation}
							/>
							Calculate based on a threshold (pass/fail)
						</label>
					</fieldset>
					{this.state.type === 'pass-fail' && (
						<div className="threshold-properties-section">
							<fieldset className="pass-fail">
								<legend>Pass & Fail Rules</legend>
								<p>
									In this mode, you can customize passing and failing scores, what do do when
									students are out of attempts, and set more complex penalty and extra credit rules.
								</p>
								<div className="to-pass">
									<p>
										To <b>pass</b>, students must achieve an attempt score of at least
									</p>
									<input
										type="number"
										min="0"
										max="100"
										name="passingAttemptScore"
										value={this.state.passingAttemptScore}
										onChange={this.onChangeState}
										onClick={stopPropagation}
										onFocus={this.freezeEditor}
										onBlur={this.unfreezeEditor}
									/>
									<span>%</span>
								</div>
								<div className="when-passing">
									<p>
										When <b>passing</b>, set the assessment score to
									</p>

									<div>
										<label htmlFor="attempt-score">
											<input
												type="radio"
												id="attempt-score"
												value="$attempt_score"
												checked={this.state.passedType === '$attempt_score'}
												onChange={this.passedType}
											/>
											The attempt score
										</label>
									</div>

									<div>
										<label htmlFor="specified-value">
											<input
												type="radio"
												id="specified-value"
												value="set-value"
												checked={this.state.passedType === 'set-value'}
												onChange={this.passedType}
											/>
											Specified value:
										</label>
										<input
											type="number"
											min="0"
											max="100"
											name="passedResult"
											value={this.state.passedResult}
											onClick={stopPropagation}
											onChange={this.onChangeState}
											disabled={this.state.passedType !== 'set-value'}
											onFocus={this.freezeEditor}
											onBlur={this.unfreezeEditor}
										/>
										<span>%</span>
									</div>
								</div>
								<div className="when-failing">
									<p>
										When <b>failing</b>,
									</p>
									<div>
										<label htmlFor="set-score-to-attempt-score">
											<input
												type="radio"
												id="set-score-to-attempt-score"
												value="$attempt_score"
												checked={this.state.failedType === '$attempt_score'}
												onChange={this.failedType}
											/>
											Set the assessment score to the attempt score
										</label>
									</div>

									<div>
										<label htmlFor="dont-set-score">
											<input
												type="radio"
												id="dont-set-score"
												value="no-score"
												checked={this.state.failedType === 'no-score'}
												onChange={this.failedType}
											/>
											Don&apos;t set the score (no score will be sent to the gradebook)
										</label>
									</div>

									<div>
										<label htmlFor="set-score-to-specific-value">
											<input
												type="radio"
												id="set-score-to-specific-value"
												value="set-value"
												checked={this.state.failedType === 'set-value'}
												onChange={this.failedType}
											/>
											Set the assessment score to specified value
										</label>
										<input
											type="number"
											min="0"
											max="100"
											name="failedResult"
											value={this.state.failedResult}
											onClick={stopPropagation}
											onChange={this.onChangeState}
											disabled={this.state.failedType !== 'set-value'}
											onFocus={this.freezeEditor}
											onBlur={this.unfreezeEditor}
										/>
										<span>%</span>
									</div>
								</div>
								<div className="out-of-attempts">
									<p>
										And if the student is <b>out of attempts and still did not pass</b>,
									</p>

									<div>
										<label htmlFor="out-of-attempts-no-value">
											<input
												type="radio"
												id="out-of-attempts-no-value"
												value="no-value"
												checked={this.state.unableToPassType === 'no-value'}
												onChange={this.unableToPassType}
											/>
											Don&apos;t do anything, the failing rule will still apply
										</label>
									</div>

									<div>
										<label htmlFor="out-of-attempts-highest-attempt-score">
											<input
												type="radio"
												id="out-of-attempts-highest-attempt-score"
												value="$highest_attempt_score"
												checked={this.state.unableToPassType === '$highest_attempt_score'}
												onChange={this.unableToPassType}
											/>
											Set the assessment score to the highest attempt score
										</label>
									</div>

									<div>
										<label htmlFor="out-of-attempts-no-score">
											<input
												type="radio"
												id="out-of-attempts-no-score"
												value="no-score"
												checked={this.state.unableToPassType === 'no-score'}
												onChange={this.unableToPassType}
											/>
											Don&apos;t set assessment the score (no score will be sent to the gradebook)
										</label>
									</div>

									<div>
										<label htmlFor="out-of-attempts-set-value">
											<input
												type="radio"
												id="out-of-attempts-set-value"
												value="set-value"
												checked={this.state.unableToPassType === 'set-value'}
												onChange={this.unableToPassType}
											/>
											Set the assessment score to specified value
										</label>
										<input
											type="number"
											min="0"
											max="100"
											name="unableToPassResult"
											value={this.state.unableToPassResult || 0}
											onClick={stopPropagation}
											onChange={this.onChangeState}
											disabled={this.state.unableToPassType !== 'set-value'}
											onFocus={this.freezeEditor}
											onBlur={this.unfreezeEditor}
										/>
										<span>%</span>
									</div>
								</div>
							</fieldset>
							<div className="mods">
								<header>
									<div className="title">Extra Credit & Penalties</div>
									<Button id="open-mods-btn" onClick={this.showModProperties}>
										{this.state.showModProperties ? <span>Close</span> : <span>Edit...</span>}
									</Button>
								</header>

								{this.state.showModProperties && this.renderModProperties()}

								<ul>
									{this.state.mods &&
										this.state.mods.map((mod, index) => {
											const range = getParsedRange(mod.attemptCondition + '')

											return (
												<li key={index}>
													{mod.reward < 0 ? (
														<b>
															<span className="deduct">Deduct</span> {Math.abs(mod.reward)}%
														</b>
													) : (
														<b>
															<span className="reward">Add</span> {mod.reward}%
														</b>
													)}
													{this.printRange(range)}
												</li>
											)
										})}
								</ul>
							</div>
						</div>
					)}
				</div>
			</SimpleDialog>
		)
	}
}

export default RubricModal
