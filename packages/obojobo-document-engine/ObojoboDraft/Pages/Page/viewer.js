import Common from 'Common'

import ViewerComponent from './viewer-component'

Common.Store.registerModel('ObojoboDraft.Pages.Page', {
	type: 'page',
	default: true,
	componentClass: ViewerComponent,
	selectionHandler: null,
	getNavItem(model) {
		let label

		if (model.title) {
			label = model.title
		} else {
			const pages = model.parent.children.models.filter(
				child => child.get('type') === 'ObojoboDraft.Pages.Page'
			)
			label = `Page ${pages.indexOf(model) + 1}`
		}

		return {
			type: 'link',
			label,
			path: [label.toLowerCase().replace(/ /g, '-')],
			showChildren: false
		}
	}
})
