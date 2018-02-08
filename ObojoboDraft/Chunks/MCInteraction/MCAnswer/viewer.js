import Common from 'Common'

import ViewerComponent from './viewer-component'

let SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.MCInteraction.MCAnswer', {
	type: 'chunk',
	adapter: null,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
