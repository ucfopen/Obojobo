describe('Caliper event from req', () => {
	// make sure all Date objects use a static date
	mockStaticDate()

	const caliperEvent = require('../../../../routes/api/events/create_caliper_event')

	// some redundant values
	const id = 'testIdReq'
	const inactiveDuration = 'testInactiveDurationReq'
	const itemId = 'testItemIdReq'
	const lastActiveTime = 'testLastActiveTimeReq'
	const questionId = 'testQuestionIdReq'
	const relatedEventId = 'testRelatedEventIdreq'

	const buildMockReq = (action, payload) => ({
		currentUser: {
			id: 'testUserIdReq'
		},
		currentDocument: {
			draftId: 'testDraftIdReq',
			contentId: 'testContentIdReq'
		},
		session: {
			id: 'SessionIdReq',
			oboLti: {
				launchId: 'OboLtiLaunchIdReq'
			}
		},
		hostname: 'hostnameReq',
		body: {
			event: {
				action: action,
				draft_id: 'testDraftIdReq',
				payload: payload
			}
		}
	})

	// outline all the events to test with payload
	const eventsToTest = {
		'nav:goto': { from: 'fromReq', to: 'toReq' },
		'nav:open': {},
		'nav:close': {},
		'nav:toggle': { isOpen: true },
		'nav:lock': {},
		'nav:unlock': {},
		'question:view': { questionId },
		'question:hide': { questionId },
		'question:checkAnswer': { questionId },
		'question:showExplanation': { questionId },
		'question:hideExplanation': { questionId, actor: 'user' },
		'question:setResponse': {
			assessmentId: 'testAssessmentReq',
			attemptId: 'testAttemptIdReq',
			questionId
		},
		'score:set': { id, itemId, score: 'scoreReq' },
		'score:clear': { id, itemId },
		'question:retry': { questionId },
		'media:show': { id },
		'media:hide': { id, actor: 'user' },
		'media:setZoom': { id, zoom: 1.1, previousZoom: 1 },
		'media:resetZoom': { id, previousZoom: 2 },
		'viewer:inactive': { inactiveDuration, lastActiveTime },
		'viewer:returnFromInactive': { inactiveDuration, lastActiveTime, relatedEventId },
		'viewer:close': {},
		'viewer:leave': {},
		'viewer:return': { relatedEventId }
	}

	// test each event type
	Object.keys(eventsToTest).forEach(reqObjectKey => {
		test(`${reqObjectKey} returns the expected snapshot`, () => {
			const mockReq = buildMockReq(reqObjectKey, eventsToTest[reqObjectKey])
			expect(caliperEvent(mockReq)).toMatchSnapshot()
		})
	})

	test('actorFromType returns an object with the actor type and the current users id if given ACTOR_USER', () => {
		const mockReq = buildMockReq('viewer:close', eventsToTest['viewer:close'])
		const result = caliperEvent(mockReq)
		expect(result.actor).toBe('https://hostnameReq/api/user/testUserIdReq')
	})

	test('actorFromType returns an object with only the given type if the type is not ACTOR_USER', () => {
		const mockReq = buildMockReq('score:clear', eventsToTest['score:clear'])
		const result = caliperEvent(mockReq)
		expect(result.actor).toBe('https://hostnameReq/api/server')
	})
})
