import Common from 'Common'

import ViewerComponent from './viewer-component'

const SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.MCAssessment.MCFeedback', {
	type: 'chunk',
	adapter: null,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
