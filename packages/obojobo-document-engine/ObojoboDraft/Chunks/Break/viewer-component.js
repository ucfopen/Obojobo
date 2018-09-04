import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components
let { NonEditableChunk } = Common.chunk

export default props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<NonEditableChunk
			className={`obojobo-draft--chunks--break viewer width-${props.model.modelState.width}`}
		>
			<hr />
		</NonEditableChunk>
	</OboComponent>
)
