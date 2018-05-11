import Common from 'Common'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

Common.Store.registerModel('ObojoboDraft.Modules.Module', {
	type: 'module',
	default: true,
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: null,
	getNavItem(model) {
		return {
			type: 'heading',
			label: model.title,
			showChildren: true
		}
	}
})
