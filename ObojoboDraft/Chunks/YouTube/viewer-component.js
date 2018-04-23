import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components

export default props => (
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
