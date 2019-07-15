import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Text = props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<TextChunk className="obojobo-draft--chunks--single-text pad">
			{props.model.modelState.textGroup.items.map((textItem, index) => (
				<TextGroupEl textItem={textItem} groupIndex={index} key={index} parentModel={props.model} />
			))}
		</TextChunk>
	</OboComponent>
)

export default Text
