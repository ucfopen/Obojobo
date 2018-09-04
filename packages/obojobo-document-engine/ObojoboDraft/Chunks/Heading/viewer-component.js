import './viewer-component.scss'

import Common from 'Common'
let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { TextChunk } = Common.chunk

export default props => {
	// creates an h1, h2, h3, etc to use in jsx below
	let HTag = `h${props.model.modelState.headingLevel}`

	return (
		<OboComponent model={props.model} moduleData={props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--heading pad">
				<HTag>
					<TextGroupEl
						parentModel={props.model}
						textItem={props.model.modelState.textGroup.first}
						groupIndex="0"
					/>
				</HTag>
			</TextChunk>
		</OboComponent>
	)
}
