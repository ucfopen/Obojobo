import './editor-component.scss'

import React from 'react'
import { ReactEditor } from 'slate-react'
import { Transforms, Editor } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'
import ModProperties from './mod-properties'

const getParsedRange = Common.util.RangeParsing.getParsedRange
const { Button } = Common.components
const { ModalUtil } = Common.util

class Rubric extends React.Component {
	constructor(props) {
		super(props)

		this.unfreezeEditor = this.unfreezeEditor.bind(this)
		this.freezeEditor = this.freezeEditor.bind(this)
		this.changeRubricType = this.changeRubricType.bind(this)
		this.showModModal = this.showModModal.bind(this)
		this.changeMods = this.changeMods.bind(this)

		this.passingAttemptScore = this.changeScoreType.bind(this, 'passingAttemptScore')
		this.passedType = this.changeScoreType.bind(this, 'passedType')
		this.passedResult = this.changeScoreType.bind(this, 'passedResult')
		this.failedType = this.changeScoreType.bind(this, 'failedType')
		this.failedResult = this.changeScoreType.bind(this, 'failedResult')
		this.unableToPassType = this.changeScoreType.bind(this, 'unableToPassType')
		this.unableToPassResult = this.changeScoreType.bind(this, 'unableToPassResult')
	}

	changeRubricType(event) {
		const type = event.target.value

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, type } },
			{ at: path }
		)
	}

	changeScoreType(typeName, event) {
		const content = {}
		content[typeName] = event.target.value

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, ...content } },
			{ at: path }
		)
	}

	showModModal() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		const [parent] = Editor.parent(this.props.editor, path)

		ModalUtil.show(
			<ModProperties
				mods={this.props.element.content.mods}
				attempts={parent.content.attempts}
				onConfirm={this.changeMods}
			/>
		)
	}

	changeMods(content) {
		ModalUtil.hide()

		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, mods: content.mods } },
			{ at: path }
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

	freezeEditor() {
		this.props.editor.toggleEditable(false)
	}

	unfreezeEditor() {
		this.props.editor.toggleEditable(true)
	}

	render() {
		const content = this.props.element.content
		const className = 'rubric pad ' + 'is-type-' + content.type
		const stopPropagation = event => event.stopPropagation()

		return (
			<div className={className} contentEditable={false}>
				<h2 contentEditable={false}>Assessment Scoring</h2>
				<p>
					The recorded score for this module is the highest assessment score, and will be sent to
					any connected gradebook.{' '}
				</p>
				<fieldset className="assessment-score">
					<legend>How do you want to determine the recorded score?</legend>
					<label>
						<input
							type="radio"
							name="score-type"
							value="highest"
							checked={content.type === 'highest'}
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
							checked={content.type === 'pass-fail'}
							onChange={this.changeRubricType}
							onClick={stopPropagation}
						/>
						Calculate based on a threshold (pass/fail)...
					</label>
				</fieldset>
				<fieldset className="pass-fail">
					<legend>Pass & Fail Rules</legend>
					<p>
						In this mode, students must achieve a certain threshold on an attempt to pass. The
						assessment score for each attempt will be set based on whether the student passes or
						fails, and the highest of these assessment scores will be used as the recorded score.
					</p>
					<div>
						<label>
							To <b>pass</b>, students must achieve an attempt score of at least
							<input
								type="number"
								min="0"
								max="100"
								value={content.passingAttemptScore}
								onChange={this.passingAttemptScore}
								onClick={stopPropagation}
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
							/>
							%
						</label>
					</div>
					<div>
						<label>
							When <b>passing</b>, set the assessment score to
							<select
								value={content.passedType}
								onChange={this.passedType}
								onClick={stopPropagation}
							>
								<option value="$attempt_score">The attempt score</option>
								<option value="set-value">Specified value</option>
							</select>
						</label>
						<label className={isOrNot(content.passedType === 'set-value', 'enabled')}>
							<input
								type="number"
								min="0"
								max="100"
								value={content.passedResult}
								onClick={stopPropagation}
								onChange={this.passedResult}
								disabled={content.passedType !== 'set-value'}
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
							/>
							%
						</label>
					</div>
					<div>
						<label>
							When <b>failing</b>,
							<select
								value={content.failedType}
								onChange={this.failedType}
								onClick={stopPropagation}
							>
								<option value="$attempt_score">
									Set the assessment score to the attempt score
								</option>
								<option value="no-score">
									Don&apos;t set the score (no score will be sent to the gradebook)
								</option>
								<option value="set-value">Set the assessment score to specified value</option>
							</select>
						</label>
						<label className={isOrNot(content.failedType === 'set-value', 'enabled')}>
							<input
								type="number"
								min="0"
								max="100"
								value={content.failedResult}
								onClick={stopPropagation}
								onChange={this.failedResult}
								disabled={content.failedType !== 'set-value'}
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
							/>
							%
						</label>
					</div>
					<div>
						<label>
							And if the student is <b>out of attempts and still did not pass</b>,
							<select
								value={content.unableToPassType}
								onChange={this.unableToPassType}
								onClick={stopPropagation}
							>
								<option value="no-value">
									Don&apos;t do anything, the failing rule will still apply
								</option>
								<option value="$highest_attempt_score">
									Set the assessment score to the highest attempt score
								</option>
								<option value="no-score">
									Don&apos;t set assessment the score (no score will be sent to the gradebook)
								</option>
								<option value="set-value">Set the assessment score to specified value</option>
							</select>
						</label>
						<label className={isOrNot(content.unableToPassType === 'set-value', 'enabled')}>
							<input
								type="number"
								min="0"
								max="100"
								value={content.unableToPassResult}
								onClick={stopPropagation}
								onChange={this.unableToPassResult}
								disabled={content.unableToPassType !== 'set-value'}
								onFocus={this.freezeEditor}
								onBlur={this.unfreezeEditor}
							/>
							%
						</label>
					</div>
				</fieldset>
				<div className="mods">
					<div className="title">Extra Credit & Penalties</div>
					<Button onClick={this.showModModal}>Edit...</Button>
					<ul>
						{content.mods.map((mod, index) => {
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
				<span className="invisibleText">{this.props.children}</span>
			</div>
		)
	}
}

export default withSlateWrapper(Rubric)
