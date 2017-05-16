import ObojoboDraft from 'ObojoboDraft'
import adapter from 'ObojoboDraft/Common/chunk/text-chunk/text-group-adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.Text', {
	type: 'chunk',
	default: true,
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
});