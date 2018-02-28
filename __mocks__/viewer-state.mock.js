import AssessmentStore from '../src/scripts/viewer/stores/assessment-store'
import NavStore from '../src/scripts/viewer/stores/nav-store'
import QuestionStore from '../src/scripts/viewer/stores/question-store'
import ModalStore from '../src/scripts/common/stores/modal-store'
import FocusStore from '../src/scripts/common/stores/focus-store'
import AssessmentUtil from '../src/scripts/viewer/util/assessment-util'
import NavUtil from '../src/scripts/viewer/util/nav-util'
import QuestionUtil from '../src/scripts/viewer/util/question-util'
import ModalUtil from '../src/scripts/common/util/modal-util'
import FocusUtil from '../src/scripts/common/util/focus-util'

let initModuleData = () => {
	QuestionStore.init()
	ModalStore.init()
	FocusStore.init()
	NavStore.init()
	AssessmentStore.init()

	moduleData.navState = NavStore.getState()
	moduleData.questionState = QuestionStore.getState()
	moduleData.assessmentState = AssessmentStore.getState()
	moduleData.modalState = ModalStore.getState()
	moduleData.focusState = FocusStore.getState()
}

let moduleData = {}

NavStore.onChange(() => {
	moduleData.navState = NavStore.getState()
})
QuestionStore.onChange(() => {
	moduleData.questionState = QuestionStore.getState()
})
AssessmentStore.onChange(() => {
	moduleData.assessmentState = AssessmentStore.getState()
})
ModalStore.onChange(() => {
	moduleData.modalState = ModalStore.getState()
})
FocusStore.onChange(() => {
	moduleData.focusState = FocusStore.getState()
})

export {
	moduleData,
	initModuleData,
	AssessmentStore,
	NavStore,
	QuestionStore,
	ModalStore,
	FocusStore,
	AssessmentUtil,
	NavUtil,
	QuestionUtil,
	ModalUtil,
	FocusUtil
}
