const iri = require('../iri_builder.js')

describe('IRI Builder', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	test('iri builder fails with no req or host', () => {
		expect(() => iri(null, null)).toThrowError(
			'Must provide a request object with hostname or provide a host'
		)
	})

	test('iri builder uses hostname when provided', () => {
		let path = iri(null, 'nameHost').getIRI('testPath')
		expect(path).toBe('https://nameHost/testPath')
	})

	test('iri builder uses req.hostname when not given hostname', () => {
		let path = iri({ hostname: 'reqHost' }, null).getIRI('testPath')
		expect(path).toBe('https://reqHost/testPath')
	})

	test('getIRI returns an IRI for any path', () => {
		let path = iri(null, 'testHost').getIRI('testPath')
		expect(path).toBe('https://testHost/testPath')
	})

	test('getEdAppIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getEdAppIRI()
		expect(path).toBe('https://testHost/api/system')
	})

	test('getViewerClientIRI returns with default path when not given params', () => {
		let path = iri(null, 'testHost').getViewerClientIRI()
		expect(path).toBe('https://testHost/api/viewer/client')
	})

	test('getViewerClientIRI returns with expected path when given draftId', () => {
		let path = iri(null, 'testHost').getViewerClientIRI('testDraft')
		expect(path).toBe('https://testHost/api/viewer/client%3FdraftId=testDraft')
	})

	test('getViewerClientIRI returns with expected path when given draftId and client', () => {
		let path = iri(null, 'testHost').getViewerClientIRI('testDraft', 'testClient')
		expect(path).toBe('https://testHost/api/viewer/client/testClient%3FdraftId=testDraft')
	})

	test('getAppServerIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getAppServerIRI()
		expect(path).toBe('https://testHost/api/server')
	})

	test('getSessionIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getSessionIRI('testSession')
		expect(path).toBe('https://testHost/api/session/testSession')
	})

	test('getFederatedSessionIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getFederatedSessionIRI('testLaunch')
		expect(path).toBe('https://testHost/api/launch/testLaunch')
	})

	test('getUserIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getUserIRI('testUser')
		expect(path).toBe('https://testHost/api/user/testUser')
	})

	test('getSessionIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getSessionIRI('testSession')
		expect(path).toBe('https://testHost/api/session/testSession')
	})

	test('getDraftIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getDraftIRI('testDraft')
		expect(path).toBe('https://testHost/api/draft/testDraft')
	})

	test('getDraftIRI returns with expected path given OboNode', () => {
		let path = iri(null, 'testHost').getDraftIRI('testDraft', 'testNode')
		expect(path).toBe('https://testHost/api/draft/testDraft#testNode')
	})

	test('getDraftIRI returns with expected path given OboNode and context', () => {
		let path = iri(null, 'testHost').getDraftIRI('testDraft', 'testNode', 'testContext')
		expect(path).toBe('https://testHost/api/draft/testDraft?context=testContext#testNode')
	})

	test('getPracticeQuestionAttemptIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getPracticeQuestionAttemptIRI('testDraft', 'testNode')
		expect(path).toBe('https://testHost/api/practice/testDraft/testNode')
	})

	test('getAssessmentIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getAssessmentIRI('testDraft', 'testAssessment')
		expect(path).toBe('https://testHost/api/assessment/testDraft/testAssessment')
	})

	test('getAssessmentAttemptIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getAssessmentAttemptIRI('testAttempt')
		expect(path).toBe('https://testHost/api/attempt/testAttempt')
	})

	test('getPickerIRI returns with expected path', () => {
		let path = iri(null, 'testHost').getPickerIRI()
		expect(path).toBe('https://testHost/api/picker')
	})
})
