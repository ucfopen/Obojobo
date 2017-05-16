import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'

let OboComponent = ObojoboDraft.components.OboComponent
let Button = ObojoboDraft.components.Button
let TextGroupEl = ObojoboDraft.chunk.textChunk.TextGroupEl
let TextChunk = ObojoboDraft.chunk.TextChunk

let ActionButton = React.createClass({
	onClick() {
		return this.props.model.processTrigger('onClick');
	},

	render() {
		let textItem = this.props.model.modelState.textGroup.first;

		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--action-button pad">
				<Button onClick={this.onClick} value={this.props.model.modelState.label} align={this.props.model.modelState.align}>
					<TextGroupEl textItem={textItem} groupIndex="0" parentModel={this.props.model} />
				</Button>
			</TextChunk>
		</OboComponent>;
	}
});

export default ActionButton;