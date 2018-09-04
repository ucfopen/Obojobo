import Common from 'Common'
import ViewerComponent from './viewer-component'

const SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler
const Adapter = Common.chunk.textChunk.TextGroupAdapter

Common.Store.registerModel('ObojoboDraft.Chunks.Text', {
	type: 'chunk',
	default: true,
	adapter: Adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
