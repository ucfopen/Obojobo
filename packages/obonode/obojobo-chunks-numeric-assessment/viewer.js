import Common from 'obojobo-document-engine/src/scripts/common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.NumericAssessment', {
	adapter: null,
	componentClass: ViewerComponent,
	type: 'chunk'
})
