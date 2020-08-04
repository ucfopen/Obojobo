// importing styles here because there is now actual component
import './viewer-component.scss'

const MODULE_NODE = 'ObojoboDraft.Modules.Module'

const Module = {
	name: MODULE_NODE,
	menuLabel: 'Module',
	ignore: true,
	isInsertable: false,
	getNavItem(model) {
		return {
			type: 'heading',
			label: model.title,
			showChildren: true
		}
	}
}

export default Module
