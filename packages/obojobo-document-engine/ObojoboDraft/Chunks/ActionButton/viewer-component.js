import './viewer-component.scss'

import Common from 'Common'

let OboComponent = Common.components.OboComponent
let Button = Common.components.Button
let TextGroupEl = Common.chunk.textChunk.TextGroupEl
let TextChunk = Common.chunk.TextChunk

export default props => {
	let model = props.model
	let textItem = model.modelState.textGroup ? model.modelState.textGroup.first : ''

	return (
		<OboComponent model={model} moduleData={props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--action-button pad">
				<Button
					onClick={model.processTrigger.bind(model, 'onClick')}
					value={model.modelState.label}
					align={model.modelState.align}
				>
					<TextGroupEl textItem={textItem} groupIndex="0" parentModel={model} />
				</Button>
			</TextChunk>
		</OboComponent>
	)
}
