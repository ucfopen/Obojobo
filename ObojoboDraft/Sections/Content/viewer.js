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
})
