import './viewer.scss';

import { OBO } from 'obo'
import ObojoboDraft from 'ObojoboDraft'

let { TextGroup } = ObojoboDraft.textGroup;
let { TextGroupEl } = ObojoboDraft.chunk.textChunk;
let { TextChunk } = ObojoboDraft.chunk;
let SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler;

let selectionHandler = new SelectionHandler();

var Blockquote = React.createClass({
	statics: {
		type: 'ObojoboDraft.Chunks.Blockquote',
		register() { return ObojoboDraft.Store.registerChunk(Blockquote); },
		getSelectionHandler(chunk) { return selectionHandler; },

		createNewNodeData() {
			return {textGroup: TextGroup.create(2, { indent:0 }, 2)};
		},
			// citation: TextGroup.create(1, { indent:0 }, 1)

		cloneNodeData(data) {
			return {
				textGroup: data.textGroup.clone(),
				// citation: data.citation.clone()
				type: data.type
			};
		},

		createNodeDataFromDescriptor(descriptor) {
			return {
				textGroup: TextGroup.fromDescriptor(descriptor.content.textGroup, 2, { indent:0 }),
				// citation: TextGroup.fromDescriptor descriptor.content.citation, 1, { indent:0 }
				type: descriptor.content.type
			};
		},

		getDataDescriptor(chunk) {
			let data = chunk.modelState;

			return {
				textGroup: data.textGroup.toDescriptor(),
				// citation: data.citation.toDescriptor()
				type: data.type
			};
		}
	},

	render() {
		let data = this.props.chunk.modelState;

		// while data.textGroup.length isnt 2
		// 	data.textGroup.add()

		return <TextChunk className="obojobo-draft--chunks--blockquote">
			<blockquote><TextGroupEl parentModel={this.props.model} text={data.textGroup.first.text} groupIndex={data.textGroup.first.index} indent={data.textGroup.first.data.indent} /></blockquote>
			<cite><TextGroupEl parentModel={this.props.model} text={data.textGroup.last.text} groupIndex={data.textGroup.last.index} indent={data.textGroup.last.data.indent} /></cite>
		</TextChunk>;
	}
});


Blockquote.register();

export default Blockquote;