import Common from 'Common'
import Viewer from 'Viewer'

const { AssessmentUtil } = Viewer.util

import adapter from './adapter'
import ViewerComponent from './viewer-component'

Common.Store.registerModel('ObojoboDraft.Sections.Assessment', {
	type: 'section',
	adapter: adapter,
	componentClass: ViewerComponent,
	selectionHandler: null,
	getNavItem(model) {
		const title = model.title || 'Assessment'

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
			const assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment')
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited'
			}

			return AssessmentUtil.getAttemptsRemaining(viewerProps.assessmentState, assessmentModel)
		},
		'assessment:attemptsAmount'(textModel) {
			const assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment')
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
