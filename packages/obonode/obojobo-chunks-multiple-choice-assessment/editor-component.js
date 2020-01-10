import React from 'react'
import { Block } from 'slate'
import Common from 'obojobo-document-engine/src/scripts/common'

import './editor-component.scss'

const { Button, Switch } = Common.components
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

class MCAssessment extends React.Component {
	changeResponseType(event) {
		event.stopPropagation()
		const editor = this.props.editor

		return editor.setNodeByKey(this.props.node.key, {
			data: {
				content: {
					...this.props.node.data.get('content'),
					responseType: event.target.value
				}
			}
		})
	}

	changeShuffle(shuffle) {
		return this.props.editor.setNodeByKey(this.props.node.key, {
			data: {
				...this.props.node.data.toJSON(),
				content: {
					...this.props.node.data.get('content'),
					shuffle
				}
			}
		})
	}

	addChoice() {
		const editor = this.props.editor

		const newChoice = Block.create({
			type: MCCHOICE_NODE,
			data: { content: { score: 0 } }
		})
		return editor.insertNodeByKey(this.props.node.key, this.props.node.nodes.size, newChoice)
	}

	render() {
		const questionType = this.props.node.data.get('questionType') || 'default'
		const content = this.props.node.data.get('content')

		return (
			<div
				className={`component obojobo-draft--chunks--mc-assessment editor--mc-assessment is-type-${questionType}`}
			>
				<div className="mc-settings" contentEditable={false}>
					<label>
						Response Type
						<select value={content.responseType} onChange={this.changeResponseType.bind(this)}>
							<option value="pick-one">Pick one correct answer</option>
							<option value="pick-all">Pick all correct answers</option>
						</select>
					</label>
					<Switch
						title="Shuffle Choices"
						initialChecked={content.shuffle}
						handleCheckChange={this.changeShuffle.bind(this)}
					/>
				</div>
				<div>
					{this.props.children}
					<Button className={'choice-button pad'} onClick={this.addChoice.bind(this)}>
						{'+ Add Choice'}
					</Button>
				</div>
			</div>
		)
	}
}

export default MCAssessment
