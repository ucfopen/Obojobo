import './viewer-component.scss'

import React from 'react'

import Common from 'obojobo-document-engine/src/scripts/common/index'

const { OboComponent } = Common.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Code = props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<TextChunk className="obojobo-draft--chunks--code pad">
			<pre>
				<code>
					{props.model.modelState.textGroup.items.map((textItem, index) => (
						<TextGroupEl
							parentModel={props.model}
							textItem={textItem}
							groupIndex={index}
							key={index}
						/>
					))}
				</code>
			</pre>
		</TextChunk>
	</OboComponent>
)

export default Code
