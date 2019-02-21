import './viewer-component.scss'

import React from 'react'

import Image from './image'

import Common from 'Common'
import Viewer from 'Viewer'

const { OboComponent } = Viewer.components
const { TextGroupEl } = Common.chunk.textChunk
const { NonEditableChunk } = Common.chunk

const Figure = props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<NonEditableChunk
			className={`obojobo-draft--chunks--figure viewer ${props.model.modelState.size}`}
		>
			<div className="container">
				<figure unselectable="on">
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

export default Figure
