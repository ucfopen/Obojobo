jest.mock('obojobo-express/db')

describe('AssessmentModel', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {})
	afterEach(() => {})

	// test('constructor initializes expected properties', () => {
	// 	const draftTree = {}
	// 	const initFn = jest.fn()
	// 	const d = new DraftNode(draftTree, mockRawDraft.content, initFn)
	// 	expect(d.draftTree).toBe(draftTree)
	// 	expect(d.node).toEqual(
	// 		expect.objectContaining({
	// 			id: 666,
	// 			content: { nothing: true }
	// 		})
	// 	)
	// 	expect(d.node).not.toBe(mockRawDraft)
	// 	expect(d.node).not.toHaveProperty('children')
	// 	expect(d.init).toBe(initFn)
	// 	expect(d.children).toBeInstanceOf(Array)
	// 	expect(d.children).toHaveLength(0)
	// })

	// test('init calls passed init function', () => {
	// 	const draftTree = {}
	// 	const initFn = jest.fn()
	// 	const d = new DraftNode(draftTree, mockRawDraft.content, initFn)
	// 	expect(d.init).toBe(initFn)
	// 	d.init()
	// 	expect(initFn).toHaveBeenCalledTimes(1)
	// })

	// test('get childrenSet builds childrenSet as expected', () => {
	// 	const d = new DraftNode({}, mockRawDraft.content, jest.fn())
	// 	d.children.push({
	// 		node: { id: 999 },
	// 		children: [{ node: { id: 777 }, children: [] }]
	// 	})
	// 	d.children.push({ node: { id: 888 }, children: [] })

	// 	const childrenSet = d.childrenSet
	// 	expect(childrenSet.has(999)).toBe(true)
	// 	expect(childrenSet.has(888)).toBe(true)
	// 	expect(childrenSet.has(777)).toBe(true)
	// 	expect(childrenSet.has(333)).toBe(false)
	// })

	// test('get childrenSet throws error if child has no id', () => {
	// 	const d = new DraftNode({}, mockRawDraft.content, jest.fn())
	// 	d.children.push({
	// 		node: { id: 999 },
	// 		children: [{ node: { id: 777 }, children: [] }]
	// 	})
	// 	d.children.push({ node: { id: null }, children: [] })

	// 	const getChildrenIds = () => d.childrenSet
	// 	expect(getChildrenIds).toThrowError('Unable to add child node with missing id')
	// })

	// test('get immediateChildrenSet builds immediateChildrenSet as expected', () => {
	// 	const d = new DraftNode({}, mockRawDraft.content, jest.fn())
	// 	d.children.push({
	// 		node: { id: 999 },
	// 		children: [{ node: { id: 777 }, children: [] }]
	// 	})
	// 	d.children.push({ node: { id: 888 }, children: [] })
	// 	const iChildrenSet = d.immediateChildrenSet
	// 	expect(iChildrenSet.has(999)).toBe(true)
	// 	expect(iChildrenSet.has(888)).toBe(true)
	// 	expect(iChildrenSet.has(777)).toBe(false)
	// 	expect(iChildrenSet.has(333)).toBe(false)
	// })

	// test('registerEvents sets up listeners', () => {
	// 	const d = new DraftNode({}, mockRawDraft.content, jest.fn())
	// 	const eventFn = jest.fn()

	// 	d.registerEvents({ test: eventFn, test2: eventFn })

	// 	expect(d._listeners.size).toBe(2)

	// 	d.registerEvents({ test: eventFn, test3: eventFn })

	// 	expect(d._listeners.size).toBe(3)
	// })

	// test('contains finds child nodes', () => {
	// 	const d = new Draft(null, mockRawDraft.content)
	// 	expect(d.root.contains({ id: 999 })).toBe(true)
	// 	expect(d.root.contains({ id: 888 })).toBe(true)
	// 	expect(d.root.contains({ id: 777 })).toBe(true)
	// 	expect(d.root.contains({ id: 333 })).toBe(false)
	// })

	// test('yells returns an array of empty promises with no children', () => {
	// 	const d = new DraftNode({}, mockRawDraft.content, jest.fn())
	// 	const promises = d.yell()
	// 	expect(promises).toBeInstanceOf(Array)
	// 	expect(promises).toHaveLength(0)
	// })

	// test('yells to children', () => {
	// 	expect.assertions(3)
	// 	const d = new Draft(null, mockRawDraft.content)

	// 	const node = d.getChildNodeById(666)

	// 	// mock each draftNode's yell function
	// 	node.children.forEach(c => {
	// 		jest.spyOn(c, 'yell')
	// 		c.children.forEach(child => {
	// 			jest.spyOn(child, 'yell')
	// 		})
	// 	})

	// 	node.yell('test')

	// 	// make sure each draftNode.yell was called
	// 	node.children.forEach(c => {
	// 		expect(c.yell).toBeCalledWith('test')

	// 		c.children.forEach(child => {
	// 			expect(child.yell).toBeCalledWith('test')
	// 		})
	// 	})
	// })

	// test('yell fires named event listeners', () => {
	// 	const draftTree = {}
	// 	const eventFn = jest.fn().mockImplementation(() => {
	// 		return 5
	// 	})
	// 	const d = new DraftNode(draftTree, mockRawDraft.content)
	// 	d.registerEvents({ test: eventFn })
	// 	d.yell('test')
	// 	expect(eventFn).toHaveBeenCalled()
	// })

	// test('yell does not fire unnamed events', () => {
	// 	const draftTree = {}
	// 	const eventFn = jest.fn().mockImplementation(() => {
	// 		return 5
	// 	})
	// 	const d = new DraftNode(draftTree, mockRawDraft.content)
	// 	d.registerEvents({ test: eventFn })
	// 	d.yell('mocktest')
	// 	expect(eventFn).not.toHaveBeenCalled()
	// })

	// test('yell does not return rejected promises', () => {
	// 	const draftTree = {}
	// 	const eventFn = jest.fn().mockReturnValueOnce(false)
	// 	const d = new DraftNode(draftTree, mockRawDraft.content)
	// 	d.registerEvents({ test: eventFn })
	// 	d.yell('test')
	// 	expect(eventFn).toHaveBeenCalled()
	// })

	// test('toObject converts itself to an object', () => {
	// 	const draftTree = {}
	// 	const initFn = jest.fn()
	// 	const d = new DraftNode(draftTree, mockRawDraft.content, initFn)
	// 	d.children.push({
	// 		toObject: jest.fn().mockReturnValueOnce({
	// 			node: { id: 888 },
	// 			children: []
	// 		})
	// 	})

	// 	const obj = d.toObject()
	// 	expect(obj).toEqual(
	// 		expect.objectContaining({
	// 			content: { nothing: true },
	// 			children: [{ node: { id: 888 }, children: [] }],
	// 			id: 666
	// 		})
	// 	)
	// })
	// @TODO moved to model
	test.skip('getCompletedAssessmentAttemptHistory calls db', () => {
		Assessment.getCompletedAssessmentAttemptHistory(0, 1, 2)

		expect(db.manyOrNone).toHaveBeenCalled()
		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			userId: 0,
			draftId: 1,
			assessmentId: 2
		})
	})

	// @TODO moved to AssessmentModel.fetchAttemptHistory
	test.skip('getAttempts returns attempts object without response history', () => {
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// there's no response history
		jest.spyOn(Assessment, 'getResponseHistory').mockResolvedValue({})

		// there's no lti state
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', null, null, 'mockAssessmentId').then(
			result => {
				expect(result).toMatchSnapshot()
			}
		)
	})

	// @TODO moved to AssessmentModel.fetchAttemptHistory
	test.skip('getAttempts returns attempts object without assessmentId', () => {
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// there's no response history
		jest.spyOn(Assessment, 'getResponseHistory')
		Assessment.getResponseHistory.mockResolvedValueOnce({})

		// there's no lti state
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({})

		return Assessment.getAttempts('mockUserId', 'mockDraftId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	// @TODO moved to AssessmentModel.fetchAttemptHistory
	test.skip('getAttempts returns empty object if assessment isnt found', () => {
		db.manyOrNone.mockResolvedValueOnce([])

		// there's no response history
		jest.spyOn(Assessment, 'getResponseHistory').mockResolvedValueOnce({})

		// there's no lti state
		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({})

		return Assessment.getAttempts('mockUserId', 'mockDraftId', false, null, 'badAssessmentId').then(
			result => {
				expect(result).toMatchSnapshot()
			}
		)
	})

	// @TODO moved to AssessmentModel.fetchAttemptHistory
	test.skip('getAttempts returns attempts object with response history', () => {
		// mock the results of the query to just return an object in an array
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		const mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockAssessmentId',
					attempt_id: 'mockAttemptId',
					question_id: 'mockQuestionId',
					response: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts(
			'mockUserId',
			'mockDraftId',
			false,
			null,
			'mockAssessmentId'
		).then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	// @TODO moved to AssessmentModel.fetchAttemptHistory
	test.skip('getAttempts returns multiple attempts with same assessment', () => {
		// mock the results of the query to just return an object in an array
		const first = makeMockAttempt()
		first.attempt_id = 'mockFirst'
		const second = makeMockAttempt()
		second.attempt_id = 'mockSecond'
		db.manyOrNone.mockResolvedValueOnce([first, second])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		const mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockAssessmentId',
					response: 'mockResponse',
					attempt_id: 'mockAttemptId',
					question_id: 'mockQuestionId'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts(
			'mockUserId',
			'mockDraftId',
			false,
			null,
			'mockAssessmentId'
		).then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	// @TODO moved to AssessmentModel.fetchAttemptHistory
	test.skip('getAttempts returns no history when assessmentIds for attempt and history dont match', () => {
		// mock the results of the query to just return an object in an array
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		const mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockOtherAssessmentId',
					repsonse: 'mockResponse',
					attempt_id: 'mockAttemptId',
					question_id: 'mockQuestionId',
					response: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts('mockUserId', 'mockDraftId').then(result => {
			expect(result).toMatchSnapshot()
		})
	})

	// @TODO moved to AssessmentModel.fetchAttemptHistory
	test.skip('getAttempts throws error if attempt is not found', () => {
		// mock the results of the query to just return an object in an array
		db.manyOrNone.mockResolvedValueOnce([makeMockAttempt()])

		// create a mock history
		jest.spyOn(Assessment, 'getResponseHistory')
		const mockHistory = {
			mockAttemptId: [
				{
					id: 'mockResponseId',
					assessment_id: 'mockAssessmentId',
					repsonse: 'mockResponse',
					attempt_id: 'mockBadAttemptId',
					question_id: 'mockQuestionId',
					response: 'mockResponse'
				}
			]
		}
		Assessment.getResponseHistory.mockResolvedValueOnce(mockHistory)

		lti.getLTIStatesByAssessmentIdForUserAndDraftAndResourceLinkId.mockResolvedValueOnce({
			mockAssessmentId: {
				scoreSent: 0,
				sentDate: 'mockSentDate',
				status: 'mockStatus',
				gradebookStatus: 'mockGradeBookStatus',
				statusDetails: 'mockStatusDetails'
			}
		})

		return Assessment.getAttempts(
			'mockUserId',
			'mockDraftId',
			false,
			null,
			'mockAssessmentId'
		).then(result => {
			expect(result).toMatchSnapshot()
			expect(logger.warn).toHaveBeenCalledWith(
				"Couldn't find an attempt I was looking for ('mockUserId', 'mockDraftId', 'mockAttemptId', 'mockResponseId', 'mockAssessmentId') - Shouldn't get here!"
			)
		})
	})

	// @TODO moved to AssessmentModel
	test.skip('getAttemptIdsForUserForDraft calls db with expected fields', () => {
		Assessment.getAttemptIdsForUserForDraft('mockUserId', 'mockDraftId')

		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			userId: 'mockUserId',
			draftId: 'mockDraftId'
		})
	})

	// @TODO moved to AssessmentModel
	test.skip('removeAllButLastIncompleteAttempts handles empty array', () => {
		const attempts = []
		const res = Assessment.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(0)
	})

	// @TODO moved to AssessmentModel
	test.skip('removeAllButLastIncompleteAttempts returns all completed attempts', () => {
		const attempts = [
			{
				isFinished: true,
				finishTime: new Date(),
				startTime: new Date()
			}
		]
		const res = Assessment.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(1)
		expect(res).toEqual(attempts)
	})

	// @TODO moved to AssessmentModel
	test.skip('removeAllButLastIncompleteAttempts sorts completed attempts', () => {
		const attempts = [
			{
				isFinished: true,
				finishTime: new Date(301),
				startTime: new Date(300)
			},
			{
				isFinished: true,
				finishTime: new Date(101),
				startTime: new Date(100)
			},
			{
				isFinished: true,
				finishTime: new Date(201),
				startTime: new Date(200)
			}
		]
		const res = Assessment.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(3)
		expect(res[0]).toBe(attempts[1])
		expect(res[1]).toBe(attempts[2])
		expect(res[2]).toBe(attempts[0])
	})

	// @TODO moved to AssessmentModel
	test.skip('removeAllButLastIncompleteAttempts handles 1 incomplete attempt', () => {
		const attempts = [
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(300)
			}
		]
		const res = Assessment.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(1)
		expect(res).toEqual(attempts)
	})

	// @TODO moved to AssessmentModel
	test.skip('removeAllButLastIncompleteAttempts only returns the newest incomplete attempt', () => {
		const attempts = [
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(300)
			},
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(600)
			},
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(200)
			}
		]
		const res = Assessment.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(1)
		expect(res[0]).toBe(attempts[1])
	})

	// @TODO moved to AssessmentModel
	test.skip('removeAllButLastIncompleteAttempts removes incomplete attempts before the last completed attempt', () => {
		const attempts = [
			{
				isFinished: true,
				finishTime: new Date(302),
				startTime: new Date(300)
			},
			{
				isFinished: true,
				finishTime: new Date(102),
				startTime: new Date(100)
			},
			{
				isFinished: true,
				finishTime: new Date(202),
				startTime: new Date(200)
			},
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(301) // this is just before the finishTime of the last attempt
			}
		]
		const res = Assessment.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(3)
		expect(res[0]).toBe(attempts[1])
		expect(res[1]).toBe(attempts[2])
		expect(res[2]).toBe(attempts[0])
	})

	// @TODO moved to AssessmentModel
	test.skip('removeAllButLastIncompleteAttempts removes incomplete attempts before the last completed attempt but retains the most recent incompleted attempt if it has been started after the last completed attempt', () => {
		const attempts = [
			{
				isFinished: true,
				finishTime: new Date(302),
				startTime: new Date(300)
			},
			{
				isFinished: true,
				finishTime: new Date(102),
				startTime: new Date(100)
			},
			{
				isFinished: true,
				finishTime: new Date(202),
				startTime: new Date(200)
			},
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(600)
			},
			{
				isFinished: false,
				finishTime: null,
				startTime: new Date(301) // this is just before the finishTime of the last attempt
			}
		]
		const res = Assessment.removeAllButLastIncompleteAttempts(attempts)
		expect(res).not.toBe(attempts) // must be a new array
		expect(res).toHaveLength(4)
		expect(res[0]).toBe(attempts[1])
		expect(res[1]).toBe(attempts[2])
		expect(res[2]).toBe(attempts[0])
		expect(res[3]).toBe(attempts[3])
	})

	test.skip('getAttemptNumber returns the attempt_number property', () => {
		jest.spyOn(Assessment, 'getAttemptIdsForUserForDraft')
		Assessment.getAttemptIdsForUserForDraft.mockResolvedValueOnce([
			{ id: 3, attempt_number: 999 },
			{ id: 'attemptId', attempt_number: 777 },
			{ id: 111, attempt_number: 227 }
		])

		return Assessment.getAttemptNumber('userId', 'draftId', 'attemptId').then(result => {
			expect(result).toEqual(777)
		})
	})

	test.skip('getAttemptNumber returns null when theres no matching attemptId', () => {
		jest.spyOn(Assessment, 'getAttemptIdsForUserForDraft')
		Assessment.getAttemptIdsForUserForDraft.mockResolvedValueOnce([
			{ id: 3, attempt_number: 999 },
			{ id: 999, attempt_number: 777 },
			{ id: 111, attempt_number: 227 }
		])

		return Assessment.getAttemptNumber('userId', 'draftId', 'attemptId').then(result => {
			expect(result).toEqual(null)
		})
	})

	test.skip('getAttempt retrieves the Attempt by its id', () => {
		Assessment.getAttempt('mockAttemptId')

		expect(db.oneOrNone.mock.calls[0][1]).toEqual({
			attemptId: 'mockAttemptId'
		})
	})

	test.skip('fetchResponsesForAttempts calls the database and loops through the result', done => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				attempt_id: 'mockAttemptId'
			},
			{
				attempt_id: 'secondMockAttemptId'
			}
		])

		return Assessment.fetchResponsesForAttempts('mockUserId', 'mockDraftId').then(result => {
			expect(db.manyOrNone.mock.calls[0][1]).toEqual({
				userId: 'mockUserId',
				draftId: 'mockDraftId',
				optionalAssessmentId: null
			})

			expect(result).toEqual({
				mockAttemptId: [{ attempt_id: 'mockAttemptId' }],
				secondMockAttemptId: [{ attempt_id: 'secondMockAttemptId' }]
			})

			return done()
		})
	})

	test.skip('fetchResponsesForAttempts returns array with identical attemptIds', done => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				attempt_id: 'mockAttemptId',
				question_id: 'mockQuestionId'
			},
			{
				attempt_id: 'secondMockAttemptId',
				question_id: 'mockQuestionId'
			},
			{
				attempt_id: 'secondMockAttemptId',
				question_id: 'mockOtherQuestionId'
			}
		])

		return Assessment.fetchResponsesForAttempts('mockUserId', 'mockDraftId').then(result => {
			expect(db.manyOrNone.mock.calls[0][1]).toEqual({
				userId: 'mockUserId',
				draftId: 'mockDraftId',
				optionalAssessmentId: null
			})

			expect(result).toEqual({
				mockAttemptId: [
					{
						attempt_id: 'mockAttemptId',
						question_id: 'mockQuestionId'
					}
				],
				secondMockAttemptId: [
					{
						attempt_id: 'secondMockAttemptId',
						question_id: 'mockQuestionId'
					},
					{
						attempt_id: 'secondMockAttemptId',
						question_id: 'mockOtherQuestionId'
					}
				]
			})

			return done()
		})
	})

	test.skip('fetchResponsesForAttempts calls the database with optionalAssessmentId', done => {
		db.manyOrNone.mockResolvedValueOnce([
			{
				attempt_id: 'mockAttemptId'
			},
			{
				attempt_id: 'secondMockAttemptId'
			}
		])

		return Assessment.fetchResponsesForAttempts(
			'mockUserId',
			'mockDraftId',
			false,
			'mockResourceLinkId',
			'mockAssessmentId'
		).then(result => {
			expect(db.manyOrNone.mock.calls[0][1]).toEqual({
				userId: 'mockUserId',
				draftId: 'mockDraftId',
				isPreview: false,
				optionalAssessmentId: 'mockAssessmentId',
				resourceLinkId: 'mockResourceLinkId'
			})

			expect(result).toEqual({
				mockAttemptId: [{ attempt_id: 'mockAttemptId' }],
				secondMockAttemptId: [{ attempt_id: 'secondMockAttemptId' }]
			})

			return done()
		})
	})

	test.skip('fetchResponsesForAttempts calls the database with the expected value', () => {
		Assessment.fetchResponsesForAttempts('mockAttemptId')

		expect(db.manyOrNone.mock.calls[0][1]).toEqual({
			attemptId: 'mockAttemptId'
		})
	})

	test.skip('insertNewAttempt', () => {
		Assessment.insertNewAttempt(
			'mockUserId',
			'mockDraftId',
			'mockAssessmentId',
			'mockState',
			'mockPreviewing'
		)

		expect(db.one).toHaveBeenCalled()
		expect(db.one.mock.calls[0][1]).toEqual({
			assessmentId: 'mockState',
			contentId: 'mockAssessmentId',
			draftId: 'mockDraftId',
			isPreview: undefined, //eslint-disable-line
			state: 'mockPreviewing',
			userId: 'mockUserId'
		})
	})

	test.skip('completeAttempt calls UPDATE/INSERT queries with expected values and returns data object', () => {
		expect.assertions(3)
		db.one.mockResolvedValueOnce('attemptData')
		db.one.mockResolvedValueOnce({ id: 'assessmentScoreId' })

		return Assessment.completeAttempt(1, 2, 3, 4, {}, {}, false).then(result => {
			expect(result).toEqual({
				assessmentScoreId: 'assessmentScoreId',
				attemptData: 'attemptData'
			})

			expect(db.one.mock.calls[0][0]).toContain('UPDATE attempts')
			expect(db.one.mock.calls[1][0]).toContain('INSERT INTO assessment_scores')
		})
	})

	test.skip('updateAttemptState calls db', () => {
		Assessment.updateAttemptState(0, {})

		expect(db.none).toHaveBeenCalled()
		expect(db.none.mock.calls[0][1]).toEqual({
			state: {},
			attemptId: 0
		})
	})
})
