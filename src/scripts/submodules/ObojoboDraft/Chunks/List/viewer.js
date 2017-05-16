import ObojoboDraft from 'ObojoboDraft'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.List', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
});