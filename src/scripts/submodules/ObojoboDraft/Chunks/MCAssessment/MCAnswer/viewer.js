import ObojoboDraft from 'ObojoboDraft'

import ViewerComponent from './viewer-component'

let SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCAnswer', {
	type: 'chunk',
	adapter: null,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
});