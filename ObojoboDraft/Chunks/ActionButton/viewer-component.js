import './viewer-component.scss'

import Common from 'Common'

let OboComponent = Common.components.OboComponent
let Button = Common.components.Button
let TextGroupEl = Common.chunk.textChunk.TextGroupEl
let TextChunk = Common.chunk.TextChunk

export default class ActionButton extends React.Component {
	onClick() {
		return this.props.model.processTrigger('onClick')
	}

	render() {
		let textItem = this.props.model.modelState.textGroup
			? this.props.model.modelState.textGroup.first
			: ''
		return (
			<OboComponent model={this.props.model} moduleData={this.props.moduleData}>
				<TextChunk className="obojobo-draft--chunks--action-button pad">
					<Button
						onClick={this.onClick.bind(this)}
						value={this.props.model.modelState.label}
						align={this.props.model.modelState.align}
					>
						<TextGroupEl textItem={textItem} groupIndex="0" parentModel={this.props.model} />
					</Button>
				</TextChunk>
			</OboComponent>
		)
	}
}
