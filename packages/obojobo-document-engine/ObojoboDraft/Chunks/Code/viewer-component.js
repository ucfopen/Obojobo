import './viewer-component.scss'

import React from 'react'

import Common from 'Common'

const { OboComponent } = Common.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Code = props => (
	<OboComponent model={props.model} moduleData={props.moduleData}>
		<TextChunk className="obojobo-draft--chunks--single-text pad">
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
