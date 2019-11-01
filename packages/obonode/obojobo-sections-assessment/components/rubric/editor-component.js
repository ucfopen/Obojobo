import './editor-component.scss'

import React from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'
import ModProperties from './mod-properties'
import emptyMod from './empty-mod.json'

const { Button } = Common.components
const { ModalUtil } = Common.util
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

class Rubric extends React.Component {
	changeRubricType(event) {
		const type = event.target.value
		return this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...this.props.node.data.get('content'),
					type
				}
			}
		})
	}

	changeScoreType(typeName, event) {
		const content = {}
		content[typeName] = event.target.value
		return this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...this.props.node.data.get('content'),
					...content
				}
			}
		})
	}

	showModModal() {
		ModalUtil.show(
			<ModProperties
				mods={this.props.node.data.get('content').mods || []}
				onConfirm={this.changeMods.bind(this)}/>
		)
	}

	changeMods(content) {
		return this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...this.props.node.data.get('content'),
					mods: [...content.rewards, ...content.penalties]
				}
			}
		})
	}

	render() {
		console.log(this.props.node.toJSON())
		const content = this.props.node.data.get('content')
		const className = 'rubric pad ' + 'is-type-' + content.type

		return (
			<div className={className}>
				<h2 contentEditable={false}>Assessment Scoring</h2>
				<p>The assessment score is the final counted score for this module, and will be sent to any connected gradebook</p>
				<fieldset className="assessment-score">
					<legend>How do you want to determine the assessment score?</legend>
					<label>
						<input 
							type="radio" 
							name="score-type" 
							value="highest" 
							checked={content.type === 'highest'}
							onChange={this.changeRubricType.bind(this)}
							onClick={event => event.stopPropagation()}/>
						Use the highest attempt score
					</label>
					<label>
						<input 
							type="radio" 
							name="score-type" 
							value="pass-fail" 
							checked={content.type === 'pass-fail'}
							onChange={this.changeRubricType.bind(this)}
							onClick={event => event.stopPropagation()}/>
						Calculate based on a threshold (pass/fail)
					</label>
				</fieldset>
				<fieldset className="pass-fail">
					<legend>Pass & Fail Rules</legend>
					<p>In this mode, students must achieve a certian threshold on an attempt to pass.  The assessment scores will be set based on whether the student passes or fails</p>
					<div>
						<label>
							To <b>pass</b>, students must achieve an attempt score of at least
							<input 
								type="number" 
								value={content.passingAttemptScore}
								onClick={event => event.stopPropagation()}/>
							%
						</label>
					</div>
					<div>
						<label>
							When <b>passing</b>, set the recorded score to
							<select
								value={content.passedType}
								onChange={this.changeScoreType.bind(this, "passedType")}
								onClick={event => event.stopPropagation()}>
								<option value="$attempt-score">The highest attempt score</option>
								<option value="set-value">Specified value</option>
							</select>
						</label>
						<label className={isOrNot(content.passedType === 'set-value', 'enabled')}>
							<input 
								type="number" 
								value={content.passedResult}
								onClick={event => event.stopPropagation()}
								disabled={content.passedType !== 'set-value'}/>
							%
						</label>
					</div>
					<div>
						<label>
							When <b>failing</b>,
							<select
								value={content.failedType}
								onChange={this.changeScoreType.bind(this, "failedType")}
								onClick={event => event.stopPropagation()}>
								<option value="$attempt-score">Set the score to the highest attempt score</option>
								<option value="no-score">Dont set the score (no score will be sent to the gradebook)</option>
								<option value="set-value">Set the assessment score to specified value</option>
							</select>
						</label>
						<label className={isOrNot(content.failedType === 'set-value', 'enabled')}>
							<input 
								type="number"
								value={content.failedResult}
								onClick={event => event.stopPropagation()}
								disabled={content.passedType !== 'set-value'}/>
							%
						</label>
					</div>
					<div>
						<label>
							And if the student is <b>out of attempts and still did not pass</b>,
							<select
								value={content.unableToPassType}
								onChange={this.changeScoreType.bind(this, "unableToPassType")}
								onClick={event => event.stopPropagation()}>
								<option value="no-value">Dont do anything, the failing rule will still apply</option>
								<option value="$attempt-score">Set the score to the highest attempt score</option>
								<option value="no-score">Dont set the score (no score will be sent to the gradebook)</option>
								<option value="set-value">Set the assessment score to specified value</option>
							</select>
						</label>
						<label className={isOrNot(content.unableToPassType === 'set-value', 'enabled')}>
							<input 
								type="number" 
								value={content.unableToPassResult}
								onClick={event => event.stopPropagation()}
								disabled={content.unableToPassType !== 'set-value'}/>
							%
						</label>
					</div>
				</fieldset>
				<div className="mods">
					<div className="title">Extra Credit & Penalties</div>
					<Button onClick={this.showModModal.bind(this)}>Edit...</Button>
					<ul>
						<li><b><span className="reward">Add</span> 5%</b> If a student passes on attempts 1 to 2</li>
						<li><b><span className="deduct">Deduct</span> 5%</b> If a student passes on the last attempt</li>
					</ul>
				</div>
			</div>
		)
	}
}

export default Rubric
