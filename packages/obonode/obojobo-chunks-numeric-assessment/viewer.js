import Common from 'obojobo-document-engine/src/scripts/common'
import ViewerComponent from './viewer-component'

import { NUMERIC_ASSESSMENT_NODE } from './constants'

import adapter from './adapter'

Common.Registry.registerModel(NUMERIC_ASSESSMENT_NODE, {
	adapter,
	componentClass: ViewerComponent,
	type: 'chunk'
})
