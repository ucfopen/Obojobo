import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { TextChunk } = Common.chunk

export default props => (
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
