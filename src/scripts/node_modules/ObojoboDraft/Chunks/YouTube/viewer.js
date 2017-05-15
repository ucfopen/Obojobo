import ObojoboDraft from 'ObojoboDraft'
import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.YouTube', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
});