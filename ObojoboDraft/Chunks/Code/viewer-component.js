import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { TextChunk } = Common.chunk

export default class Code extends React.Component {
	render() {
		let texts = this.props.model.modelState.textGroup.items.map((textItem, index) => {
			return (
				<TextGroupEl
					parentModel={this.props.model}
					textItem={textItem}
					groupIndex={index}
					key={index}
				/>
			)
		})

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<TextChunk className="obojobo-draft--chunks--single-text pad">
					<pre>
						<code>
							{texts}
						</code>
					</pre>
				</TextChunk>
			</OboComponent>
		)
	}
}
