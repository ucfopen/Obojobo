import Common from 'Common'

import ViewerComponent from './viewer-component'

let SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler
let adapter = Common.chunk.textChunk.TextGroupAdapter

Common.Store.registerModel('ObojoboDraft.Chunks.Code', {
	type: 'chunk',
	default: true,
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
