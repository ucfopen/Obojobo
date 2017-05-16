import ObojoboDraft from 'ObojoboDraft'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = ObojoboDraft.chunk.focusableChunk.FocusableSelectionHandler

ObojoboDraft.Store.registerModel('ObojoboDraft.Chunks.MathEquation', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler(),
	// dependencies: ['https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css']
});