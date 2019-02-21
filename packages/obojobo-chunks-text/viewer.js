import Common from 'obojobo-document-engine/src/scripts/common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.Text', {
	adapter: Common.chunk.textChunk.TextGroupAdapter,
	componentClass: ViewerComponent,
	default: true,
	type: 'chunk'
})
