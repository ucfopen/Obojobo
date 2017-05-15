import './viewer.scss';

import { OBO } from 'obo'

let { Editor } = window;
import ObojoboDraft from 'ObojoboDraft'


let { FocusableSelectionHandler } = ObojoboDraft.chunk.focusableChunk;

let selectionHandler = new FocusableSelectionHandler();

var Error = React.createClass({
	statics: {
		type: 'ObojoboDraft.Chunks.Error',
		register() { return ObojoboDraft.Store.registerChunk(Error, { error:true }); },
		getSelectionHandler() { return selectionHandler; },

		createNewNodeData() {
			return {};
		},

		cloneNodeData(data) {
			return {};
		},

		createNodeDataFromDescriptor(descriptor) {
			return {};
		},

		getDataDescriptor(chunk) {
			return {};
		}
	},

	render() {
		return null;
	}
});


Error.register();

export default Error;