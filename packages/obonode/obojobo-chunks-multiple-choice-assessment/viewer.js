import adapter from './adapter'
import Common from 'Common'
import ViewerComponent from './viewer-component'

import './MCAnswer/viewer'
import './MCChoice/viewer'
import './MCFeedback/viewer'

Common.Registry.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	adapter: adapter,
	componentClass: ViewerComponent,
	type: 'chunk'
})
