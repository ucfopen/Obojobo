import ObojoboDraft from 'ObojoboDraft'

import ViewerComponent from './viewer-component'

ObojoboDraft.Store.registerModel('ObojoboDraft.Pages.Page', {
	type: 'page',
	default: true,
	componentClass: ViewerComponent,
	selectionHandler: null,
	getNavItem(model) {
		let title = '';
		if (model.title != null) {
			({ title } = model);
		}

		return {
			type: 'link',
			label: model.title,
			// path: ['page-' + (model.getIndex() + 1) + '-' + model.get('id')],
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false
		};
	}
	// init: ->
	// 	Dispatcher.on 'nav:willGotoPath', (oldNavItem, newNavItem) ->
	// 		alert('yeah')
});