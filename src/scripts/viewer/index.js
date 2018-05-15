import ViewerApp from './components/viewer-app'
import AssessmentStore from './stores/assessment-store'
import ViewerStore from './redux/viewer-store'
import * as NavActions from './redux/nav-actions'
import LTINetworkStates from './stores/assessment-store/lti-network-states'
import QuestionStore from './stores/question-store'
import AssessmentUtil from './util/assessment-util'
import NavUtil from './util/nav-util'
import APIUtil from './util/api-util'
import QuestionUtil from './util/question-util'
import getLTIOutcomeServiceHostname from './util/get-lti-outcome-service-hostname'
import AssessmentScoreReporter from './assessment/assessment-score-reporter'
import AssessmentScoreReportView from './assessment/assessment-score-report-view'
import { connect } from 'react-redux'

// execute the redux dispatch listeners
require('./redux/nav-dispatch-listener')

export default {
	components: {
		ViewerApp
	},

	stores: {
		AssessmentStore,
		assessmentStore: {
			LTINetworkStates
		},
		QuestionStore,
		ViewerStore
	},

	redux: {
		connect,
		NavActions
	},

	util: {
		AssessmentUtil,
		NavUtil,
		APIUtil,
		QuestionUtil,
		getLTIOutcomeServiceHostname,
	},

	assessment: {
		AssessmentScoreReporter,
		AssessmentScoreReportView
	}
}
