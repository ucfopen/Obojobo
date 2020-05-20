import React from 'react'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import Common from 'obojobo-document-engine/src/scripts/common'
import withSlateWrapper from 'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper'

import './editor-component.scss'

const { Button, Switch } = Common.components
const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'
const MCANSWER_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCAnswer'
const TEXT_NODE = 'ObojoboDraft.Chunks.Text'
const TEXT_LINE_NODE = 'ObojoboDraft.Chunks.Text.TextLine'

class MCAssessment extends React.Component {
	changeResponseType(event) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, responseType: event.target.value } },
			{ at: path }
		)
	}

	changeShuffle(shuffle) {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.setNodes(
			this.props.editor,
			{ content: { ...this.props.element.content, shuffle } },
			{ at: path }
		)
	}

	addChoice() {
		const path = ReactEditor.findPath(this.props.editor, this.props.element)
		return Transforms.insertNodes(
			this.props.editor,
			{
				type: MCCHOICE_NODE,
				content: { score: 0 },
				children: [
					{
						type: MCANSWER_NODE,
						content: {},
						children: [
							{
								type: TEXT_NODE,
								content: {},
								children: [
									{
										type: TEXT_NODE,
										subtype: TEXT_LINE_NODE,
										content: { indent: 0 },
										children: [{ text: '' }]
									}
								]
							}
						]
					}
				]
			},
			{ at: path.concat(this.props.element.children.length) }
		)
	}

	render() {
		const questionType = this.props.element.questionType || 'default'
		const content = this.props.element.content

		console.log(this.props.element)

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

export default withSlateWrapper(MCAssessment)
