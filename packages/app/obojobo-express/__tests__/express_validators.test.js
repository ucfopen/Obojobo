/* eslint-disable no-undefined */

jest.mock('test_node')
jest.mock('../server/models/user')
jest.mock('../server/logger')

let mockRes
let mockReq
let mockNext
let mockUser
let mockDocument

const Validators = oboRequire('server/express_validators')
const logger = oboRequire('server/logger')

describe('current user middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		logger.error.mockClear()

		mockUser = {
			id: 1,
			username: 'mock-user',
			hasPermission: perm => perm === 'canSeeThroughWalls'
		}

		mockDocument = {
			draftId: validUUID()
		}

		mockRes = {
			json: jest.fn(),
			notAuthorized: jest.fn(),
			badInput: jest.fn(),
			missing: jest.fn()
		}
		mockReq = {
			session: {},
			body: {},
			params: {}
		}
		mockNext = jest.fn()
	})

	// getCurrentUser tests

	test('getCurrentUser resolves with user from req.getCurrentUser', () => {
		mockReq.getCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return expect(Validators.getCurrentUser(mockReq, mockRes, mockNext)).resolves.toEqual(mockUser)
	})

	test('getCurrentUser calls next', () => {
		expect.assertions(1)

		mockReq.getCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.getCurrentUser(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalled()
		})
	})

	test('getCurrentUser resolves with user from req.getCurrentUser', () => {
		mockReq.getCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return expect(Validators.getCurrentUser(mockReq, mockRes, mockNext)).resolves.toEqual(mockUser)
	})

	test('getCurrentUser calls next', () => {
		expect.assertions(1)

		mockReq.getCurrentUser = jest.fn().mockRejectedValue('mock-error')
		return Validators.getCurrentUser(mockReq, mockRes, mockNext).catch(() => {
			expect(mockNext).not.toHaveBeenCalled()
		})
	})

	test('getCurrentUser rejects when req.getCurrentUser fails', () => {
		mockReq.getCurrentUser = jest.fn().mockRejectedValue('mock-error')
		return expect(Validators.getCurrentUser(mockReq, mockRes, mockNext)).rejects.toEqual(
			'mock-error'
		)
	})

	// requireCurrentUser tests

	test('requireCurrentUser resolves', () => {
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return expect(
			Validators.requireCurrentUser(mockReq, mockRes, mockNext)
		).resolves.toBeUndefined()
	})

	test('requireCurrentUser resolves when permission is valid', () => {
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return expect(
			Validators.requireCurrentUser(mockReq, mockRes, mockNext, 'canSeeThroughWalls')
		).resolves.toBeUndefined()
	})

	test('requireCurrentUser resolves when permission is invalid', () => {
		mockUser.hasPermission = () => false
		mockRes.notAuthorized = jest.fn()
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return expect(
			Validators.requireCurrentUser(mockReq, mockRes, mockNext, 'canSeeThroughWalls')
		).resolves.toEqual()
	})

	test('requireCurrentUser resolves when permission is invalid', () => {
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return expect(
			Validators.requireCurrentUser(mockReq, mockRes, mockNext, 'canSeeThroughWalls')
		).resolves.toEqual()
	})

	test('requireCurrentUser calls next when successful', () => {
		expect.assertions(1)
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCurrentUser(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalled()
		})
	})

	test('requireCurrentUser does NOT call next when permission is invalid', () => {
		expect.assertions(1)
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCurrentUser(mockReq, mockRes, mockNext, 'canSeeThroughWalls').then(
			() => {
				expect(mockNext).not.toHaveBeenCalled()
			}
		)
	})

	// requireCurrentDocument tests

	test('requireCurrentDocument resolves', () => {
		mockReq.requireCurrentDocument = jest.fn().mockResolvedValue(mockDocument)

		return expect(
			Validators.requireCurrentDocument(mockReq, mockRes, mockNext)
		).resolves.toBeUndefined()
	})

	test('requireCurrentDocument calls next', () => {
		expect.assertions(1)
		mockReq.currentDocument = mockDocument
		mockReq.requireCurrentDocument = jest.fn().mockResolvedValue()
		return Validators.requireCurrentDocument(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalled()
		})
	})

	test('requireCurrentDocument calls next when valid', () => {
		mockReq.requireCurrentDocument = jest.fn().mockRejectedValue('mock-error')

		return expect(
			Validators.requireCurrentDocument(mockReq, mockRes, mockNext)
		).resolves.toBeUndefined()
	})

	test('requireCurrentDocument calls missing when invalid', () => {
		expect.assertions(1)
		mockReq.requireCurrentDocument = jest.fn().mockRejectedValue('mock-error')
		return Validators.requireCurrentDocument(mockReq, mockRes, mockNext).then(() => {
			expect(mockRes.missing).toHaveBeenCalled()
		})
	})

	// requireDraftWritable tests

	test('requireDraftWritable resolves', () => {
		mockReq.requireDraftWritable = jest.fn().mockResolvedValue()

		return expect(
			Validators.requireDraftWritable(mockReq, mockRes, mockNext)
		).resolves.toBeUndefined()
	})

	test('requireDraftWritable calls next when valid', () => {
		mockReq.requireDraftWritable = jest.fn().mockResolvedValue()

		return Validators.requireDraftWritable(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalled()
		})
	})

	test('requireDraftWritable calls missing when invalid', () => {
		mockReq.requireDraftWritable = jest.fn().mockRejectedValue()

		return Validators.requireDraftWritable(mockReq, mockRes, mockNext).then(() => {
			expect(logger.error).toHaveBeenCalledWith('User tried editing read-only module')
			expect(mockRes.missing).toHaveBeenCalled()
		})
	})

	// requireDraftId tests

	test('requireDraftId resolves in body', () => {
		mockReq.body.draftId = validUUID()

		return expect(Validators.requireDraftId(mockReq, mockRes, mockNext)).resolves.toBeUndefined()
	})

	test('requireDraftId resolves in params', () => {
		mockReq.params.draftId = validUUID()

		return expect(Validators.requireDraftId(mockReq, mockRes, mockNext)).resolves.toBeUndefined()
	})

	test('requireDraftId rejects', () => {
		mockReq.body.draftId = 'not-a-valid-UUID'

		return Validators.requireDraftId(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(1)
			expect(mockReq['express-validator#contexts'][0]).toHaveProperty('_errors')
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid UUID',
				param: 'draftId',
				value: 'not-a-valid-UUID'
			})
		})
	})

	test('requireMultipleAttemptIds resolves in body', () => {
		mockReq.body.attemptIds = [validUUID()]

		const allChecks = Validators.requireMultipleAttemptIds.map(f => f(mockReq, mockRes, mockNext))

		return expect(Promise.all(allChecks)).resolves.toEqual([undefined, undefined])
	})

	test('requireMultipleAttemptIds resolves in body with multiple ids', () => {
		mockReq.body.attemptIds = [validUUID(), validUUID()]

		const allChecks = Validators.requireMultipleAttemptIds.map(f => f(mockReq, mockRes, mockNext))

		return expect(Promise.all(allChecks)).resolves.toEqual([undefined, undefined])
	})

	test('requireMultipleAttemptIds rejects when filled with non-uuids', () => {
		mockReq.body.attemptIds = ['Callie', 'Dega', validUUID()]
		const allChecks = Validators.requireMultipleAttemptIds.map(f => f(mockReq, mockRes, mockNext))

		return Promise.all(allChecks).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(2)
			expect(mockReq['express-validator#contexts'][0]).toHaveProperty('_errors')
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid UUID',
				param: 'attemptIds[0]',
				value: 'Callie'
			})
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid UUID',
				param: 'attemptIds[1]',
				value: 'Dega'
			})
		})
	})

	test('requireMultipleAttemptIds rejects when not defined', () => {
		delete mockReq.body.attemptIds
		const allChecks = Validators.requireMultipleAttemptIds.map(f => f(mockReq, mockRes, mockNext))

		return Promise.all(allChecks).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(2)
			expect(mockReq['express-validator#contexts'][1]).toHaveProperty('_errors')
			expect(mockReq['express-validator#contexts'][1]._errors).toContainEqual({
				location: 'body',
				msg: 'must be an array of UUIDs',
				param: 'attemptIds',
				value: undefined
			})
		})
	})

	test('requireMultipleAttemptIds rejects when given a uuid not in an array', () => {
		mockReq.body.attemptIds = validUUID()
		const allChecks = Validators.requireMultipleAttemptIds.map(f => f(mockReq, mockRes, mockNext))

		return Promise.all(allChecks).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(2)
			expect(mockReq['express-validator#contexts'][1]._errors).toContainEqual({
				location: 'body',
				msg: 'must be an array of UUIDs',
				param: 'attemptIds',
				value: mockReq.body.attemptIds
			})
		})
	})

	// @TODO: add in the future
	test.skip('requireMultipleAttemptIds rejects when empty', () => {
		mockReq.body.attemptIds = []
		const allChecks = Validators.requireMultipleAttemptIds.map(f => f(mockReq, mockRes, mockNext))

		return Promise.all(allChecks).then(() => {
			expect(mockReq).toHaveProperty('_validationErrors')
			expect(mockReq._validationErrors).toHaveLength(1)
			expect(mockReq._validationErrors).toContainEqual({
				location: 'body',
				msg: 'must be an array of UUIDs',
				param: 'attemptIds',
				value: undefined
			})
		})
	})

	// requireVisitId tests

	test('requireVisitId resolves in body', () => {
		mockReq.body.visitId = validUUID()

		return expect(Validators.requireVisitId(mockReq, mockRes, mockNext)).resolves.toBeUndefined()
	})

	test('requireVisitId resolves in params', () => {
		mockReq.params.visitId = validUUID()

		return expect(Validators.requireVisitId(mockReq, mockRes, mockNext)).resolves.toBeUndefined()
	})

	test('requireVisitId rejects', () => {
		mockReq.body.visitId = 'not-a-valid-UUID'

		return Validators.requireVisitId(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(1)
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid UUID',
				param: 'visitId',
				value: 'not-a-valid-UUID'
			})
		})
	})

	// requireEvent tests

	test('requireEvent resolves with valid event', () => {
		const d = new Date()
		mockReq.body.event = {
			action: 'mock-action',
			actor_time: d.toISOString(),
			draft_id: validUUID(),
			event_version: '1.0.0'
		}

		return expect(Promise.all(Validators.requireEvent)).resolves.toEqual(expect.any(Array))
	})

	test('requireEvent resolves with invalid event', () => {
		mockReq.body.event = {
			action: null,
			actor_time: '12/21/2002',
			draft_id: 'invalid-uuid',
			event_version: '1'
		}

		return expect(Promise.all(Validators.requireEvent)).resolves.toEqual(expect.any(Array))
	})

	test('requireEvent doesnt set _validationErrors with valid event', () => {
		expect.assertions(6)

		const d = new Date()
		mockReq.body.event = {
			action: 'mock-action',
			actor_time: d.toISOString(),
			draft_id: validUUID(),
			event_version: '1.0.0'
		}

		const allChecks = Validators.requireEvent.map(f => f(mockReq, mockRes, mockNext))

		return Promise.all(allChecks).then(() => {
			expect(mockReq['express-validator#contexts']).toHaveLength(4)
			mockReq['express-validator#contexts'].forEach(context => {
				expect(context._errors).toHaveLength(0)
			})
			expect(mockNext).toHaveBeenCalledTimes(4)
		})
	})

	test('requireEvent does set _validationErrors with invalid event', () => {
		expect.assertions(6)

		mockReq.body.event = {
			actor_time: '12/21/2002',
			draft_id: 'invalid-uuid',
			event_version: '1'
		}

		const allChecks = Validators.requireEvent.map(f => f(mockReq, mockRes, mockNext))

		return Promise.all(allChecks).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(4)
			expect(mockReq['express-validator#contexts']).toHaveLength(4)
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual(
				expect.objectContaining({ param: 'event.actor_time' })
			)
			expect(mockReq['express-validator#contexts'][1]._errors).toContainEqual(
				expect.objectContaining({ param: 'event.draft_id' })
			)
			expect(mockReq['express-validator#contexts'][2]._errors).toContainEqual(
				expect.objectContaining({ param: 'event.event_version' })
			)
			expect(mockReq['express-validator#contexts'][3]._errors).toContainEqual(
				expect.objectContaining({ param: 'event.action' })
			)
		})
	})

	// requireCanViewEditor tests

	test('requireCanViewEditor calls next and has no validation errors', () => {
		mockUser.hasPermission = perm => perm === 'canViewEditor'
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanViewEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(1)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(0)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	test('requireCanViewEditor doesnt call next and has errors', () => {
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanViewEditor(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(0)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(1)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	// requireCanCreateDrafts

	test('requireCanCreateDrafts calls next and has no validation errors', () => {
		mockUser.hasPermission = perm => perm === 'canCreateDrafts'
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanCreateDrafts(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(1)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(0)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	test('requireCanCreateDrafts doesnt call next and has errors', () => {
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanCreateDrafts(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(0)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(1)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	// requireCanDeleteDrafts

	test('requireCanDeleteDrafts calls next and has no validation errors', () => {
		mockUser.hasPermission = perm => perm === 'canDeleteDrafts'
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanDeleteDrafts(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(1)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(0)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	test('requireCanDeleteDrafts doesnt call next and has errors', () => {
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanDeleteDrafts(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(0)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(1)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	// requireCanPreviewDrafts

	test('requireCanPreviewDrafts calls next and has no validation errors', () => {
		mockUser.hasPermission = perm => perm === 'canPreviewDrafts'
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanPreviewDrafts(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(1)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(0)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	test('requireCanPreviewDrafts doesnt call next and has errors', () => {
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanPreviewDrafts(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(0)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(1)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	// requireCanViewStatsPage

	test('requireCanViewStatsPage calls next and has no validation errors', () => {
		mockUser.hasPermission = perm => perm === 'canViewStatsPage'
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanViewStatsPage(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(1)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(0)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	test('requireCanViewStatsPage doesnt call next and has errors', () => {
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanViewStatsPage(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(0)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(1)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	// requireCanViewSystemStats

	test('requireCanViewSystemStats calls next and has no validation errors', () => {
		mockUser.hasPermission = perm => perm === 'canViewSystemStats'
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanViewSystemStats(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(1)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(0)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	test('requireCanViewSystemStats doesnt call next and has errors', () => {
		mockUser.hasPermission = () => false
		mockReq.requireCurrentUser = jest.fn().mockResolvedValue(mockUser)
		return Validators.requireCanViewSystemStats(mockReq, mockRes, mockNext).then(() => {
			expect(mockNext).toHaveBeenCalledTimes(0)
			expect(mockRes.notAuthorized).toHaveBeenCalledTimes(1)
			expect(mockReq._validationErrors).toBeUndefined()
		})
	})

	// checkValidationRules

	test('checkValidationRules calls next with no errors', () => {
		Validators.checkValidationRules(mockReq, mockRes, mockNext)
		expect(mockNext).toHaveBeenCalledTimes(1)
		expect(mockRes.badInput).toHaveBeenCalledTimes(0)
	})

	test('checkValidationRules calls bad input', async () => {
		// force a failure
		mockReq.body.contentId = ['Maisie']
		await Validators.requireContentId(mockReq, mockRes, mockNext)

		// expect badInput to not have been called automatically
		expect(mockRes.badInput).toHaveBeenCalledTimes(0)

		// execute checkValidationRules
		Validators.checkValidationRules(mockReq, mockRes, mockNext)

		// expect badInput to have been called
		expect(mockRes.badInput).toHaveBeenCalledTimes(1)
		expect(mockRes.badInput).toHaveBeenCalledWith('contentId must be a valid UUID, got Maisie')
	})

	test('validImportedAssessmentScoreId resolves', () => {
		return expect(
			Validators.validImportedAssessmentScoreId(mockReq, mockRes, mockNext)
		).resolves.toBeUndefined()
	})

	test('validImportedAssessmentScoreId rejects', () => {
		mockReq.body.importedAssessmentScoreId = 'not-a-valid-INT'

		return Validators.validImportedAssessmentScoreId(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(1)
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid score id',
				param: 'importedAssessmentScoreId',
				value: 'not-a-valid-INT'
			})
		})
	})

	test('validImportedAssessmentScoreId passes with positive int', () => {
		mockReq.body.importedAssessmentScoreId = '50'

		return Validators.validImportedAssessmentScoreId(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts'][0]._errors).toHaveLength(0)
		})
	})

	test('validImportedAssessmentScoreId registers errors with negative int', () => {
		mockReq.body.importedAssessmentScoreId = '-10'

		return Validators.validImportedAssessmentScoreId(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(1)
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid score id',
				param: 'importedAssessmentScoreId',
				value: '-10'
			})
		})
	})

	test('validImportedAssessmentScoreId registers errors with 0', () => {
		mockReq.body.importedAssessmentScoreId = '0'

		return Validators.validImportedAssessmentScoreId(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(1)
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid score id',
				param: 'importedAssessmentScoreId',
				value: '0'
			})
		})
	})

	test('validImportedAssessmentScoreId registers errors when undefined', () => {
		return Validators.validImportedAssessmentScoreId(mockReq, mockRes, mockNext).then(() => {
			expect(mockReq).toHaveProperty('express-validator#contexts')
			expect(mockReq['express-validator#contexts']).toHaveLength(1)
			expect(mockReq['express-validator#contexts'][0]._errors).toContainEqual({
				location: 'body',
				msg: 'must be a valid score id',
				param: 'importedAssessmentScoreId',
				value: undefined
			})
		})
	})
})
