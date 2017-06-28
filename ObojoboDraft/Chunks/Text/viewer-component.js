import './viewer-component.scss'

import Common from 'Common'

let { OboComponent } = Common.components
let { TextGroupEl } = Common.chunk.textChunk
let { TextChunk } = Common.chunk
let { Dispatcher } = Common.flux

export default class Text extends React.Component {
	render() {
		let texts = this.props.model.modelState.textGroup.items.map(
			((textItem, index) => {
				return (
					<TextGroupEl
						textItem={textItem}
						groupIndex={index}
						key={index}
						parentModel={this.props.model}
					/>
				)
			}).bind(this)
		)

		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<TextChunk className="obojobo-draft--chunks--single-text pad">
					{texts}
				</TextChunk>
			</OboComponent>
		)
	}
}
