import Common from 'Common'
import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.MCInteraction.MCChoice', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
