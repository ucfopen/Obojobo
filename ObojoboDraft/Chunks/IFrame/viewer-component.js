import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components

export default props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<div className="obojobo-draft--chunks--iframe viewer">
			<iframe
				is
				src={props.model.modelState.src}
				frameBorder="0"
				allowFullScreen="true"
				allow={props.model.modelState.allow}
			/>
		</div>
	</OboComponent>
)
