import adapter from 'obojobo-chunks-materia/adapter'
import Common from 'obojobo-document-engine/src/scripts/common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.MateriaAssessment', {
	adapter: adapter,
	componentClass: ViewerComponent,
	type: 'chunk'
})
