import ObojoboDraft from 'ObojoboDraft'

import './MCChoice/viewer';
import './MCAnswer/viewer';
import './MCFeedback/viewer';

import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = ObojoboDraft.chunk.textChunk.TextGroupSelectionHandler

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.MCAssessment', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
});