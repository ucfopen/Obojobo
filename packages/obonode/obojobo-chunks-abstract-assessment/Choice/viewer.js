import adapter from './adapter'
import Common from 'obojobo-document-engine/src/scripts/common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.AbstractAssessment.Choice', {
	adapter: adapter,
	componentClass: ViewerComponent,
	type: 'chunk'
})
