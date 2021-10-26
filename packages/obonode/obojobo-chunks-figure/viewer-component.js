import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import Image from './image'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { NonEditableChunk } = Common.chunk
const { TextGroupEl } = Common.chunk.textChunk
const { OboComponent } = Viewer.components

const Figure = props => {
	const content = props.model.modelState
	const customStyle = {}
	if (content.size === 'custom') {
		if (content.width) {
			customStyle.width = content.width + 'px'
		}

		if (content.height) {
			customStyle.height = content.height + 'px'
		}

		customStyle['maxWidth'] = '100%'
	}

	return (
		<OboComponent model={props.model} moduleData={props.moduleData}>
			<NonEditableChunk
				className={`obojobo-draft--chunks--figure viewer ${props.model.modelState.size}`}
			>
				<div className="container">
					<figure unselectable="on" style={customStyle}>
						<Image chunk={props.model} />
						{props.model.modelState.textGroup.first.text.length > 0 ? (
							<figcaption>
								<TextGroupEl
									parentModel={props.model}
									textItem={props.model.modelState.textGroup.first}
									groupIndex="0"
								/>
							</figcaption>
						) : null}
					</figure>
				</div>
			</NonEditableChunk>
		</OboComponent>
	)
}

export default Figure
