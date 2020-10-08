import Common from 'obojobo-document-engine/src/scripts/common'
import Viewer from 'obojobo-document-engine/src/scripts/viewer'
import ViewerComponent from './viewer-component'
import adapter from './adapter'
import AssessmentDialog from './components/assessment-dialog'

const { AssessmentUtil } = Viewer.util

const AD = props => {
	return <div>{props.dog}</div>
}

Common.Registry.registerModel('ObojoboDraft.Sections.Assessment', {
	adapter: adapter,
	componentClass: ViewerComponent,
	// modalClass: AD,
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
			if (!assessmentModel) {
				return null
			}
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited'
			}

			return AssessmentUtil.getAttemptsRemaining(viewerProps.assessmentState, assessmentModel)
		},
		'assessment:attemptsTaken'(textModel, viewerProps) {
			const assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment')
			if (!assessmentModel) {
				return null
			}

			return AssessmentUtil.getNumberOfAttemptsCompletedForModel(
				viewerProps.assessmentState,
				assessmentModel
			)
		},
		'assessment:attemptsAmount'(textModel) {
			const assessmentModel = textModel.getParentOfType('ObojoboDraft.Sections.Assessment')
			if (!assessmentModel) {
				return null
			}
			if (assessmentModel.modelState.attempts === Infinity) {
				return 'unlimited'
			}

			return assessmentModel.modelState.attempts
		}
	}
})
