import adapter from './adapter'
import ViewerComponent from './viewer-component'
import ObojoboDraft from 'ObojoboDraft'

let SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.ActionButton', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler() //@TODO
});