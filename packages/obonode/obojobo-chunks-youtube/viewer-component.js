import './viewer-component.scss'

import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components

const YouTube = props => (
	<OboComponent
		model={props.model}
		moduleData={props.moduleData}
		aria-label="YouTube Video"
		role="region"
	>
		<div className="obojobo-draft--chunks--you-tube viewer">
			<iframe
				src={`https://www.youtube.com/embed/${props.model.modelState.videoId}`}
				frameBorder="0"
				allowFullScreen={true}
				loading="lazy"
			/>
		</div>
	</OboComponent>
)

export default YouTube
