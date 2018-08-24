import Common from 'Common'
import adapter from './adapter'
import ViewerComponent from './viewer-component'

const SelectionHandler = Common.chunk.focusableChunk.FocusableSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.HTML', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
