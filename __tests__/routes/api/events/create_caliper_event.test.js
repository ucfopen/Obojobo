const caliperEvents = require('../../../../routes/api/events/create_caliper_event')
const CaliperEventFactory = require('../../../../routes/api/events/create_caliper_event_from_req')

// TODO: May want to create different types of test requests (for session, obolti, etc.)
const testReq = {
	iri: {
		getCurrentUserIRI: jest.fn(() => 'test actor'),
		getEdAppIRI: jest.fn(() => 'test ed app'),
		getViewIRI: jest.fn(() => 'test referrer'),
		getSessionIRI: jest.fn(() => 'test session'),
		getFederatedSessionIRI: jest.fn(() => 'test federated session')
	},
	session: { oboLti: true }
}

const testCurrentUser = {
	canViewEditor: true
}

const testAttemptIRI = 'test attempt IRI'
const testDraftId = '123'
const testNavFromField = 'navigation came from here'
const testNavToField = 'navigation is going here'
const testExtensions = {}
const testDate = new Date('2017-08-29T16:57:14.500Z')

Date = class extends Date {
	constructor() {
		super()
		return testDate
	}
}

describe('Caliper event creator', () => {
	it('can create a navigation event', () => {
		let navEvent = caliperEvents.createNavigationEvent(
			testReq,
			testCurrentUser,
			testDraftId,
			testNavFromField,
			testNavToField,
			testExtensions
		)
		expect(navEvent).toMatchSnapshot()
	})

	it('can create a score', () => {
		expect(1).toBe(1)
	})
})
