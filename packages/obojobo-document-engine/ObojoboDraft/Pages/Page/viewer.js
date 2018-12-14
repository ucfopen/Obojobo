import Common from 'Common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Pages.Page', {
	componentClass: ViewerComponent,
	default: true,
	type: 'page',
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
