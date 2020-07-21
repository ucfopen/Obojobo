import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Excerpt = props => {
	const modelState = props.model.modelState

	return (
		<OboComponent model={props.model} moduleData={props.moduleData}>
			<TextChunk
				className={`obojobo-draft--chunks--excerpt pad is-body-style-type-${modelState.bodyStyle} is-top-edge-type-${modelState.topEdge} is-bottom-edge-type-${modelState.bottomEdge} is-width-${modelState.width} is-font-${modelState.font}`}
			>
				<blockquote cite="test">
					<p>
						{modelState.excerpt.items.map((textItem, index) => (
							<TextGroupEl
								parentModel={props.model}
								textItem={textItem}
								groupIndex={index}
								key={index}
							/>
						))}
					</p>
					{!modelState.citation.isBlank ? (
						<cite>
							{modelState.citation.items.map((textItem, index) => (
								<TextGroupEl
									parentModel={props.model}
									textItem={textItem}
									groupIndex={index}
									key={index}
								/>
							))}
						</cite>
					) : null}
				</blockquote>
			</TextChunk>
		</OboComponent>
	)
}

export default Excerpt