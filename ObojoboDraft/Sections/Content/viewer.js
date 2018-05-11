import Common from 'Common'

import ViewerComponent from './viewer-component'

Common.Store.registerModel('ObojoboDraft.Sections.Content', {
	type: 'section',
	default: true,
	adapter: null,
	componentClass: ViewerComponent,
	selectionHandler: null,
	getNavItem: model => ({
		type: 'hidden',
		showChildren: true
	})

	// generateNav: model => {
	// 	let nav = model.children.models.map(child => ({
	// 		type: 'link',
	// 		label: child.title,
	// 		id: child.get('id')
	// 	}))

	// 	nav.push({
	// 		type: 'seperator'
	// 	})

	// 	return nav
	// }
})
