import Common from 'Common'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = Common.chunk.focusableChunk.FocusableSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.IFrame', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler(),
	getFullScreenElement: el => {
		let iframeEls = el.getElementsByTagName('iframe')

		return iframeEls && iframeEls[0] ? iframeEls[0] : null
	}
})
