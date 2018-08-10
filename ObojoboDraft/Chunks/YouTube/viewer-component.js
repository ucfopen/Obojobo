import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
const { OboComponent } = Common.components

const YouTube = props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<div className="obojobo-draft--chunks--you-tube viewer">
			<iframe
				src={`https://www.youtube.com/embed/${props.model.modelState.videoId}`}
				frameBorder="0"
				allowFullScreen="true"
			/>
		</div>
	</OboComponent>
)

export default YouTube
