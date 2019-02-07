import ViewerApp from './components/viewer-app'
import Logo from './components/logo'
import Header from './components/header'
import OboComponent from './components/obo-component'
import AssessmentStore from './stores/assessment-store'
import LTINetworkStates from './stores/assessment-store/lti-network-states'
import LTIResyncStates from './stores/assessment-store/lti-resync-states'
import NavStore from './stores/nav-store'
import MediaStore from './stores/media-store'
import QuestionStore from './stores/question-store'
import FocusStore from './stores/focus-store'
import AssessmentUtil from './util/assessment-util'
import NavUtil from './util/nav-util'
import FocusUtil from './util/focus-util'
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
		Header,
		OboComponent
	},

	stores: {
		AssessmentStore,
		assessmentStore: {
			LTINetworkStates,
			LTIResyncStates
		},
		NavStore,
		MediaStore,
		QuestionStore,
		FocusStore
	},

	util: {
		AssessmentUtil,
		NavUtil,
		APIUtil,
		MediaUtil,
		QuestionUtil,
		FocusUtil,
		getLTIOutcomeServiceHostname
	},

	assessment: {
		AssessmentScoreReporter,
		AssessmentScoreReportView
	}
}
