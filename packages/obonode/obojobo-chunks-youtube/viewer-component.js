import './viewer-component.scss'

import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components

const YouTube = props => {
	console.log('YouTube', props)
	return (
		<OboComponent
			model={props.model}
			moduleData={props.moduleData}
			aria-label="YouTube Video"
			role="region"
		>
			<div className="obojobo-draft--chunks--you-tube viewer">
				<iframe
					src={`https://www.youtube.com/embed/${props.node.content.videoId}`}
					frameBorder="0"
					allowFullScreen={true}
				/>
			</div>
		</OboComponent>
	)
}
export default YouTube
