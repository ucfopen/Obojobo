Common.Registry.registerModel('ObojoboDraft.Modules.Module', {
	name: 'Module',
	ignore: true,
	isInsertable: false,
	slateToObo: () => {},
	oboToSlate: () => {},
	plugins: null,
	getNavItem(model) {
		return {
			type: 'heading',
			label: model.title,
			showChildren: true
		}
	}
})
