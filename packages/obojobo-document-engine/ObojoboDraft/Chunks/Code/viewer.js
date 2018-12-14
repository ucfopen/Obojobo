import Common from 'Common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.Code', {
	adapter: Common.chunk.textChunk.TextGroupAdapter,
	componentClass: ViewerComponent,
	default: true,
	type: 'chunk'
})
