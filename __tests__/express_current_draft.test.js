let mockArgs // array of mocked express middleware request arguments
const draftFunctions = [
	'setCurrentDraft',
	'getCurrentDraft',
	'requireCurrentDraft',
	'resetCurrentDraft'
]

jest.mock('test_node')
jest.mock('../models/draft')

describe('current draft middleware', () => {
	beforeAll(() => {})
	afterAll(() => {})
	beforeEach(() => {
		mockArgs = (() => {
			let res = {}
			let req = { session: {} }
			let mockJson = jest.fn().mockImplementation(obj => {
				return true
			})
			let mockStatus = jest.fn().mockImplementation(code => {
				return { json: mockJson }
			})
			let mockNext = jest.fn()
			res.status = mockStatus

			let currentDraftMiddleware = oboRequire('express_current_draft')
			currentDraftMiddleware(req, res, mockNext)
			return [res, req, mockJson, mockStatus, mockNext]
		})()
	})
	afterEach(() => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		mockNext.mockClear()
		mockStatus.mockClear()
		mockJson.mockClear()
	})

	test('calls next', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		expect(mockNext).toBeCalledWith()
	})

	test('sets the expected properties on req', () => {
		expect.assertions(draftFunctions.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		draftFunctions.forEach(func => {
			expect(req).toHaveProperty(func)
			expect(req[func]).toBeInstanceOf(Function)
		})
	})

	test('sets the current draft on req.currentDraft', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')
		let mockDraft = new Draft({
			draftId: 999,
			contentId: 12
		})
		req.setCurrentDraft(mockDraft)
		expect(req.currentDraft).toBeInstanceOf(Draft)
	})

	test('unsets the curent draft', () => {
		expect.assertions(2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')
		let mockDraft = new Draft({
			draftId: 999,
			contentId: 12
		})
		req.setCurrentDraft(mockDraft)
		expect(req.currentDraft).toBeInstanceOf(Draft)
		req.resetCurrentDraft()
		expect(req.currentDraft).toBe(null)
	})

	test('setCurrentDraft throws when not using a Draft', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let mockDraft = {}
		expect(() => {
			req.setCurrentDraft(mockDraft)
		}).toThrow('Invalid Draft for Current draft')
	})

	test('getCurrentDraft gets the current draft', () => {
		expect.assertions(2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')
		let mockDraft = new Draft({
			draftId: 999,
			contentId: 12
		})
		req.setCurrentDraft(mockDraft)

		return req.getCurrentDraft().then(draft => {
			expect(draft.draftId).toBe(999)
			expect(draft).toBeInstanceOf(Draft)
		})
	})

	test('getCurrentDraft loads the draft from params when one is avalible', () => {
		expect.assertions(2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')
		req.params = {
			draftId: 1
		}

		return req.getCurrentDraft().then(draft => {
			expect(draft.draftId).toBe(1)
			expect(draft).toBeInstanceOf(Draft)
		})
	})

	test('getCurrentDraft loads the draft from body when one is avalible', () => {
		expect.assertions(2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')
		req.body = {
			draftId: 1
		}

		return req.getCurrentDraft().then(draft => {
			expect(draft.draftId).toBe(1)
			expect(draft).toBeInstanceOf(Draft)
		})
	})

	test('getCurrentDraft rejects when no Draft is set', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')

		return req
			.getCurrentDraft()
			.then(user => {
				expect(false).toBe('never_called')
			})
			.catch(err => {
				expect(err.message).toBe('Draft Required')
			})
	})

	test('requireCurrentDraft sucessfully gets the draft', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')
		let mockDraft = new Draft({
			draftId: 999,
			contentId: 12
		})
		req.setCurrentDraft(mockDraft)

		return req
			.requireCurrentDraft()
			.then(draft => {
				expect(draft).toBeInstanceOf(Draft)
			})
			.catch(err => {
				expect(err.message).toBe('not_called')
			})
	})

	test('requireCurrentDraft rejects if no draft is set', () => {
		expect.assertions(1)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		let Draft = oboRequire('models/draft')

		return req
			.requireCurrentDraft()
			.then(draft => {
				expect(draft).toBe('not_called')
			})
			.catch(err => {
				expect(err.message).toBe('Draft Required')
			})
	})
})
