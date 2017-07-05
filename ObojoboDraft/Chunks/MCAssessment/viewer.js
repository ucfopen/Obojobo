import Common from 'Common'

import './MCChoice/viewer'
import './MCAnswer/viewer'
import './MCFeedback/viewer'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
