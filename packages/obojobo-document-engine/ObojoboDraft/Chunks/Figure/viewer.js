import Common from 'Common'

import SelectionHandler from './selection-handler'
import adapter from './adapter'
import ViewerComponent from './viewer-component'

Common.Store.registerModel('ObojoboDraft.Chunks.Figure', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
})
