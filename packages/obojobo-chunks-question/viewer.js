import adapter from './adapter'
import Common from 'obojobo-document-engine/src/scripts/common/index'
import ViewerComponent from './viewer-component'

Common.Registry.registerModel('ObojoboDraft.Chunks.Question', {
	adapter: adapter,
	componentClass: ViewerComponent,
	type: 'chunk',
	getNavItem(model) {
		let label
		const questions = model.parent.children.models.filter(
			child => child.get('type') === 'ObojoboDraft.Chunks.Question'
		)

		if (model.title) {
			label = model.title
		} else if (model.modelState.mode === 'practice') {
			label = `Practice Question ${questions.indexOf(model) + 1}`
		} else {
			label = `Question ${questions.indexOf(model) + 1}`
		}

		return {
			type: 'sub-link',
			label,
			path: [`#obo-${model.get('id')}`]
		}
	}
})
