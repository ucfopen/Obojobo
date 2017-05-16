import './viewer-component.scss';

import ObojoboDraft from 'ObojoboDraft'

let { OboComponent } = ObojoboDraft.components;
let { TextGroupEl } = ObojoboDraft.chunk.textChunk;
let { TextChunk } = ObojoboDraft.chunk;

let Code = React.createClass({
	render() {
		let texts = this.props.model.modelState.textGroup.items.map(((textItem, index) => {
			return <TextGroupEl parentModel={this.props.model} textItem={textItem} groupIndex={index} key={index} />;
		})
		);

		return <OboComponent model={this.props.model} moduleData={this.props.moduleData}>
			<TextChunk className="obojobo-draft--chunks--single-text pad">
				<pre><code>{texts}</code></pre>
			</TextChunk>
		</OboComponent>;
	}
});

export default Code;