const CONTENT_NODE = 'ObojoboDraft.Sections.Content'

const Content = {
	name: CONTENT_NODE,
	ignore: true,
	isInsertable: false,
	plugins: null,
	helpers: {
		slateToObo: () => {},
		oboToSlate: () => {}
	},
	getNavItem: () => ({
		type: 'hidden',
		showChildren: true
	})
}

export default Content
