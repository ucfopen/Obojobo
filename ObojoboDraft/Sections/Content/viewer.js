import Common from 'Common'

import ViewerComponent from './viewer-component'

Common.Store.registerModel('ObojoboDraft.Sections.Content', {
	type: 'section',
	default: true,
	adapter: null,
	componentClass: ViewerComponent,
	selectionHandler: null,
	getNavItem(model) {
		return {
			type: 'hidden',
			showChildren: true
		}
	},

	generateNav(model) {
		let nav = []

		for (let index = 0; index < model.children.models.length; index++) {
			let child = model.children.models[index]
			nav.push({
				type: 'link',
				label: child.title,
				id: child.get('id')
			})
		}

		nav.push({
			type: 'seperator'
		})

		return nav
	}
})
