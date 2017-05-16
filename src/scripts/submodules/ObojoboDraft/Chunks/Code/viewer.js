import ObojoboDraft from 'ObojoboDraft'

import ViewerComponent from './viewer-component'

let SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler
let adapter = ObojoboDraft.chunk.textChunk.textGroupAdapter

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.Code', {
	type: 'chunk',
	default: true,
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
});