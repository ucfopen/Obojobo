import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Heading = props => {
	console.log(props)
	// creates an h1, h2, h3, etc to use in jsx below
	// const HTag = `h${props.model.modelState.headingLevel}`
	const HTag = `h${props.node.content.headingLevel}`

	return (
		<OboComponent model={props.model} moduleData={props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--heading pad">
				<HTag>
					<TextGroupEl
						textItem={props.node.content.textGroup[0].text}
						// parentModel={props.model}
						// textItem={props.model.modelState.textGroup.first}
						groupIndex="0"
					/>
				</HTag>
			</TextChunk>
		</OboComponent>
	)
}

export default Heading
