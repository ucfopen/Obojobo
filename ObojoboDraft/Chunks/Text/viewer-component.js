import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { TextChunk } = Common.chunk
let { Dispatcher } = Common.flux

export default props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<TextChunk className="obojobo-draft--chunks--single-text pad">
			{props.model.modelState.textGroup.items.map((textItem, index) => (
				<TextGroupEl textItem={textItem} groupIndex={index} key={index} parentModel={props.model} />
			))}
		</TextChunk>
	</OboComponent>
)
