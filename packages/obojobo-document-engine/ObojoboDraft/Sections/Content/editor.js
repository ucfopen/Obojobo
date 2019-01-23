import Common from 'Common'

Common.Registry.registerModel('ObojoboDraft.Sections.Content', {
	name: 'Section Content',
	ignore: true,
	isInsertable: false,
	slateToObo: () => {},
	oboToSlate: () => {},
	plugins: null,
	getNavItem: () => ({
		type: 'hidden',
		showChildren: true
	})
})
