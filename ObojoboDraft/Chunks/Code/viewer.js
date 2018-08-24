import Common from 'Common'

import ViewerComponent from './viewer-component'

const SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler
const adapter = Common.chunk.textChunk.TextGroupAdapter

Common.Store.registerModel('ObojoboDraft.Chunks.Code', {
	type: 'chunk',
	default: true,
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
