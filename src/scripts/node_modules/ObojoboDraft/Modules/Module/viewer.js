import ObojoboDraft from 'ObojoboDraft'

import adapter from './adapter'
import ViewerComponent from './viewer-component'

ObojoboDraft.Store.registerModel('ObojoboDraft.Modules.Module', {
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
		};
	},

	generateNav(model) {
		return [{
			type: 'heading',
			label: model.title
		}];
	}
});