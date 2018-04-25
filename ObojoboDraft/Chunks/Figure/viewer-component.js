import './viewer-component.scss'

import Image from './image'

import Common from 'Common'
let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { NonEditableChunk } = Common.chunk

export default props => (
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
