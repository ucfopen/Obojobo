import AssessmentStateMachine from 'obojobo-document-engine/src/scripts/viewer/stores/assessment-state-machine'

describe('AssessmentStateMachine', () => {
	// beforeEach(() => {
	// 	// Remove any added dispatcher events and create a brand new FocusStore instance
	// 	// since the imported FocusStore is actually a class instance!
	// 	Dispatcher.off()
	// 	FocusStoreClass = FocusStore.constructor
	// })

	test('State machine defaults to NOT_IN_ATTEMPT when there is no attempt to resume', () => {
		const assessmentStoreState = {}
		const m = new AssessmentStateMachine('mockAssessmentId', assessmentStoreState)

		expect(m)
	})
})
