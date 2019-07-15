import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Text = props => {
	console.log('text', props)
	return(
		<OboComponent >
			<TextChunk className="obojobo-draft--chunks--single-text pad">
				{props.node.content.textGroup.map((group, index) => (
					<TextGroupEl textItem={group.text} groupIndex={index} key={index} />
				))}
			</TextChunk>
		</OboComponent>
	)
}

export default Text
