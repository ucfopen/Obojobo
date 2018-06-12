import ViewerApp from './components/viewer-app'
import Logo from './components/logo'
import Header from './components/header'
import AssessmentStore from './stores/assessment-store'
import LTINetworkStates from './stores/assessment-store/lti-network-states'
import NavStore from './stores/nav-store'
import MediaStore from './stores/media-store'
import QuestionStore from './stores/question-store'
import AssessmentUtil from './util/assessment-util'
import NavUtil from './util/nav-util'
import APIUtil from './util/api-util'
import MediaUtil from './util/media-util'
import QuestionUtil from './util/question-util'
import getLTIOutcomeServiceHostname from './util/get-lti-outcome-service-hostname'
import AssessmentScoreReporter from './assessment/assessment-score-reporter'
import AssessmentScoreReportView from './assessment/assessment-score-report-view'

export default {
	components: {
		ViewerApp,
		Logo,
		Header
	},

	stores: {
		AssessmentStore,
		assessmentStore: {
			LTINetworkStates
		},
		NavStore,
		MediaStore,
		QuestionStore
	},

	util: {
		AssessmentUtil,
		NavUtil,
		APIUtil,
		MediaUtil,
		QuestionUtil,
		getLTIOutcomeServiceHostname
	},

	assessment: {
		AssessmentScoreReporter,
		AssessmentScoreReportView
	}
}
