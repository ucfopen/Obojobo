import './viewer-component.scss'

import React from 'react'

import Common from 'Common'

const OboComponent = Common.components.OboComponent
const Button = Common.components.Button
const TextGroupEl = Common.chunk.textChunk.TextGroupEl
const TextChunk = Common.chunk.TextChunk

const ActionButton = props => {
	const model = props.model
	const textItem = model.modelState.textGroup ? model.modelState.textGroup.first : ''

	return (
		<OboComponent model={model} moduleData={props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--action-button pad">
				<Button
					onClick={model.processTrigger.bind(model, 'onClick')}
					value={model.modelState.label}
					align={model.modelState.align}
				>
					<TextGroupEl textItem={textItem} groupIndex="0" parentModel={model} />
				</Button>
			</TextChunk>
		</OboComponent>
	)
}

export default ActionButton
