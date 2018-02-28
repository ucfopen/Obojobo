import ViewerApp from './components/viewer-app'
import AssessmentStore from './stores/assessment-store'
import LTINetworkStates from './stores/assessment-store/lti-network-states'
import NavStore from './stores/nav-store'
import QuestionStore from './stores/question-store'
import AssessmentUtil from './util/assessment-util'
import NavUtil from './util/nav-util'
import APIUtil from './util/api-util'
import QuestionUtil from './util/question-util'

export default {
	components: {
		ViewerApp: ViewerApp
	},

	stores: {
		AssessmentStore: AssessmentStore,
		assessmentStore: {
			LTINetworkStates
		},
		NavStore: NavStore,
		QuestionStore: QuestionStore
	},

	util: {
		AssessmentUtil: AssessmentUtil,
		NavUtil: NavUtil,
		APIUtil: APIUtil,
		QuestionUtil: QuestionUtil
	}
}
