import './viewer-component.scss'

import Common from 'obojobo-document-engine/src/scripts/common'
import React from 'react'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'

const { OboComponent } = Viewer.components
const { TextGroupEl } = Common.chunk.textChunk
const { TextChunk } = Common.chunk

const Code = props => (
	<OboComponent>
		<TextChunk className="obojobo-draft--chunks--code pad">
			<pre>
				<code>
					{props.node.content.textGroup.map((group, index) => (
						<TextGroupEl
							// parentModel={props.model}
							textItem={group.text}
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
