import Common from 'Common'
import Viewer from 'Viewer'

let { AssessmentUtil } = Viewer.util

import adapter from './adapter'
import ViewerComponent from './viewer-component'

Common.Store.registerModel('ObojoboDraft.Sections.Assessment', {
	type: 'section',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: null,
	getNavItem(model) {
		let title = model.title || 'Assessment'

		return {
			type: 'link',
			label: title,
			path: [title.toLowerCase().replace(/ /g, '-')],
			showChildren: false,
			showChildrenOnNavigation: false
		}
	},
	variables: {
		'assessment:attemptsRemaining'(textModel, viewerProps) {
			let assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment')
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited'
			}

			return (
				assessmentModel.modelState.attempts -
				AssessmentUtil.getNumberOfAttemptsCompletedForModel(viewerProps.assessmentState, textModel)
			)
		},
		'assessment:attemptsAmount'(textModel, viewerProps) {
			let assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment')
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited'
			}

			return assessmentModel.modelState.attempts
		}
	}

	// generateNav: (model) ->
	// 	[
	// 		{
	// 			type: 'link',
	// 			label: model.title ||= 'Assessment',
	// 			id: model.get('id')
	// 		},
	// 		{
	// 			type: 'seperator'
	// 		}
	// 	]
})
