import ViewerApp from './components/viewer-app'
import ScoreStore from './stores/score-store'
import AssessmentStore from './stores/assessment-store'
import LTINetworkStates from './stores/assessment-store/lti-network-states'
import NavStore from './stores/nav-store'
import QuestionStore from './stores/question-store'
import AssessmentUtil from './util/assessment-util'
import NavUtil from './util/nav-util'
import ScoreUtil from './util/score-util'
import APIUtil from './util/api-util'
import QuestionUtil from './util/question-util'
import getLTIOutcomeServiceHostname from './util/get-lti-outcome-service-hostname'

export default {
	components: {
		ViewerApp
	},

	stores: {
		ScoreStore,
		AssessmentStore,
		assessmentStore: {
			LTINetworkStates
		},
		NavStore,
		QuestionStore
	},

	util: {
		AssessmentUtil,
		NavUtil,
		ScoreUtil,
		APIUtil,
		QuestionUtil,
		getLTIOutcomeServiceHostname
	}
}
