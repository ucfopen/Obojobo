import adapter from './adapter'
import Common from 'Common'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Modules.Module', {
	adapter: adapter,
	componentClass: ViewerComponent,
	default: true,
	type: 'module',
	getNavItem(model) {
		return {
			type: 'heading',
			label: model.title,
			showChildren: true
		}
	}
})
