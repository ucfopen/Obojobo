import Common from 'Common'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

const SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.List', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
