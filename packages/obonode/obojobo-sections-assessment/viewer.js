import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import ViewerComponent from './viewer-component'
import adapter from './adapter'

const { AssessmentUtil } = Viewer.util

Common.Registry.registerModel('ObojoboDraft.Sections.Assessment', {
	adapter: adapter,
	componentClass: ViewerComponent,
	type: 'section',
	getNavItem(model) {
		const title = (model.title || 'Assessment').toString()

		return {
			type: 'link',
			label: title,
			contentType: 'Assessment Section',
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
})
