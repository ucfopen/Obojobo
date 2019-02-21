import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboComponent } = Viewer.components
const { NonEditableChunk } = Common.chunk

const Break = props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<NonEditableChunk
			className={`obojobo-draft--chunks--break viewer width-${props.model.modelState.width}`}
		>
			<hr />
		</NonEditableChunk>
	</OboComponent>
)

export default Break
