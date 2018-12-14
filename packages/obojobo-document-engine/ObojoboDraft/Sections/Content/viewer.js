import Common from 'Common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Sections.Content', {
	adapter: null,
	componentClass: ViewerComponent,
	default: true,
	type: 'section',
	getNavItem: () => ({
		type: 'hidden',
		showChildren: true
	})
})
