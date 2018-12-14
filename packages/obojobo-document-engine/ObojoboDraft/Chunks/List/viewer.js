import adapter from './adapter'
import Common from 'Common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.List', {
	adapter: adapter,
	componentClass: ViewerComponent,
	type: 'chunk'
})
