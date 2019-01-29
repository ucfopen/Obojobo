import adapter from './adapter'
import Common from 'obojobo-document-engine/src/scripts/common/index'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.Figure', {
	adapter: adapter,
	componentClass: ViewerComponent,
	type: 'chunk'
})
