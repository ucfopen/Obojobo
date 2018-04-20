import Common from 'Common'
import adapter from './adapter'
import ViewerComponent from './viewer-component'

let SelectionHandler = Common.chunk.textChunk.TextGroupSelectionHandler

Common.Store.registerModel('ObojoboDraft.Chunks.Question', {
	type: 'chunk',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: new SelectionHandler(),
	getNavItem(model) {
		let label
		let questions = model.parent.children.models.filter(
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
