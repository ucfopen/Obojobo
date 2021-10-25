import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import Image from './image'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import ImageCaptionWidthTypes from './image-caption-width-types'
import isOrNot from 'obojobo-document-engine/src/scripts/common/util/isornot'

const { NonEditableChunk } = Common.chunk
const { TextGroupEl } = Common.chunk.textChunk
const { OboComponent } = Viewer.components

const Figure = props => {
	const content = props.model.modelState
	const customStyle = {}
	const captionStyle = {}
	if (content.size === 'custom') {
		if (content.width) {
			customStyle.width = content.width + 'px'

			if (content.captionWidth === ImageCaptionWidthTypes.IMAGE_WIDTH) {
				captionStyle.width = content.width + 'px'
			}
		}

		if (content.height) {
			customStyle.height = content.height + 'px'
		}

		customStyle['maxWidth'] = '100%'
	}

	let textChild = null
	if (props.model.modelState.textGroup.first.text.length > 0) {
		textChild = (
			<TextGroupEl
				parentModel={props.model}
				textItem={props.model.modelState.textGroup.first}
				groupIndex="0"
			/>
		)
	}

	const textWrapped = content.wrapText ?? false
	const captionText = textWrapped ? content.captionText : textChild

	const figureClasses = [isOrNot(textWrapped, 'wrapped-text'), `${content.float ?? 'left'}-float`]

	const wrapTextRender = textWrapped ? textChild : null

	return (
		<OboComponent model={props.model} moduleData={props.moduleData}>
			<NonEditableChunk
				className={`obojobo-draft--chunks--figure viewer ${props.model.modelState.size}`}
			>
				<div className="container">
					<div className="figure-parent">
						<figure unselectable="on" className={`${figureClasses.join(' ')}`}>
							<Image chunk={props.model} style={customStyle} />
							{captionText ? (
								<figcaption
									className={`is-caption-width-${content.captionWidth}`}
									style={captionStyle}
								>
									{captionText}
								</figcaption>
							) : null}
						</figure>
					</div>
					{wrapTextRender}
				</div>
			</NonEditableChunk>
		</OboComponent>
	)
}

export default Figure
