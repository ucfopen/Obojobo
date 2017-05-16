import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'
let { OboComponent } = ObojoboDraft.components;
let { TextGroupEl } = ObojoboDraft.chunk.textChunk;
let { TextChunk } = ObojoboDraft.chunk;

let Heading = React.createClass({
	render() {
		let data = this.props.model.modelState;

		let inner = React.createElement(`h${data.headingLevel}`, null,
			<TextGroupEl parentModel={this.props.model} textItem={data.textGroup.first} groupIndex="0" />
		);

		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<TextChunk className='obojobo-draft--chunks--heading pad'>
				{inner}
			</TextChunk>
		</OboComponent>;
	}
});


export default Heading;