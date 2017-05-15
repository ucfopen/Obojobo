import ViewerApp from 'Viewer/components/viewer-app'
import ScoreStore from 'Viewer/stores/score-store'
import AssessmentStore from 'Viewer/stores/assessment-store'
import NavStore from 'Viewer/stores/nav-store'
import QuestionStore from 'Viewer/stores/question-store'
import AssessmentUtil from 'Viewer/util/assessment-util'
import NavUtil from 'Viewer/util/nav-util'
import ScoreUtil from 'Viewer/util/score-util'
import APIUtil from 'Viewer/util/api-util'
import QuestionUtil from 'Viewer/util/question-util'

export default {
	components: {
		ViewerApp: ViewerApp
	},

	stores: {
		ScoreStore: ScoreStore,
		AssessmentStore: AssessmentStore,
		NavStore: NavStore,
		QuestionStore: QuestionStore
	},

	util: {
		AssessmentUtil: AssessmentUtil,
		NavUtil: NavUtil,
		ScoreUtil: ScoreUtil,
		APIUtil: APIUtil,
		QuestionUtil: QuestionUtil
	}
};