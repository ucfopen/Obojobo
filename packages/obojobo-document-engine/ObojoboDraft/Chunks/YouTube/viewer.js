import Common from 'Common'
import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = Common.chunk.focusableChunk.FocusableSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.YouTube', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
