import Common from 'obojobo-document-engine/src/scripts/common'
import ViewerComponent from './viewer-component'

import { NUMERIC_ASSESSMENT_NODE } from './constants'

Common.Registry.registerModel(NUMERIC_ASSESSMENT_NODE, {
	adapter: null,
	componentClass: ViewerComponent,
	type: 'chunk'
})
