import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { NonEditableChunk } = Common.chunk

const Break = props => {
	console.log('Break', props)
	return (
		<OboComponent>
			<NonEditableChunk
				className={`obojobo-draft--chunks--break viewer width-${props.node.content.width}`}
			>
				<hr />
			</NonEditableChunk>
		</OboComponent>
	)
}

export default Break
