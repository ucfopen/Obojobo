import APIUtil from './util/api-util'
import AssessmentScoreReportView from './assessment/assessment-score-report-view'
import AssessmentScoreReporter from './assessment/assessment-score-reporter'
import AssessmentStore from './stores/assessment-store'
import AssessmentUtil from './util/assessment-util'
import CurrentAssessmentStates from './util/current-assessment-states'
import FocusStore from './stores/focus-store'
import FocusUtil from './util/focus-util'
import Header from './components/header'
import LTINetworkStates from './stores/assessment-store/lti-network-states'
import LTIResyncStates from './stores/assessment-store/lti-resync-states'
import AssessmentNetworkStates from './stores/assessment-store/assessment-network-states'
import AssessmentStateActions from './stores/assessment-store/assessment-state-actions'
import Logo from './components/logo'
import MediaStore from './stores/media-store'
import MediaUtil from './util/media-util'
import NavStore from './stores/nav-store'
import NavUtil from './util/nav-util'
import OboComponent from './components/obo-component'
import OboQuestionComponent from './components/obo-question-component'
import OboQuestionAssessmentComponent from './components/obo-question-assessment-component'
import Flag from './components/flag'
import QuestionStore from './stores/question-store'
import QuestionResponseSendStates from './stores/question-store/question-response-send-states'
import QuestionUtil from './util/question-util'
import ViewerApp from './components/viewer-app'
import getLTIOutcomeServiceHostname from './util/get-lti-outcome-service-hostname'

export default {
	components: {
		ViewerApp,
		Logo,
		Header,
		OboComponent,
		OboQuestionComponent,
		OboQuestionAssessmentComponent,
		Flag
	},

	stores: {
		AssessmentStore,
		assessmentStore: {
			LTINetworkStates,
			LTIResyncStates,
			AssessmentNetworkStates,
			AssessmentStateActions
		},
		NavStore,
		MediaStore,
		QuestionStore,
		questionStore: {
			QuestionResponseSendStates
		},
		FocusStore
	},

	util: {
		AssessmentUtil,
		CurrentAssessmentStates,
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
