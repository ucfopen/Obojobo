import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { Button } = Common.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

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
					tabIndex="0"
				>
					<TextGroupEl textItem={textItem} groupIndex="0" parentModel={model} />
				</Button>
			</TextChunk>
		</OboComponent>
	)
}

export default ActionButton
