import './viewer-component.scss'

import React from 'react'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboComponent } = Viewer.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Heading = props => {
	// creates an h1, h2, h3, etc to use in jsx below
	const HTag = `h${props.model.modelState.headingLevel}`

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

export default Heading
