import Common from 'obojobo-document-engine/src/scripts/common/index'

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
