import Common from 'Common'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

const SelectionHandler = Common.chunk.focusableChunk.FocusableSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.MathEquation', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler()
	// dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css']
})
