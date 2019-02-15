import React from 'react'
import { Block } from 'slate'
import Common from 'Common'

const { Button } = Common.components

const MCCHOICE_NODE = 'ObojoboDraft.Chunks.MCAssessment.MCChoice'

const ChoiceList = props => {
	const addChoice = () => {
		const editor = props.editor

		const newChoice = Block.create({
			type: MCCHOICE_NODE,
			data: { content: { score: 0 } }
		})
		return editor.insertNodeByKey(props.node.key, props.node.nodes.size, newChoice)
	}

	return (
		<div>
			<span className={'instructions'}>{'Pick all of the correct answers'} </span>
			{props.children}
			<Button className={'choice-button pad'} onClick={() => addChoice()}>
				{'+ Add Choice'}
			</Button>
		</div>
	)
}

export default ChoiceList
