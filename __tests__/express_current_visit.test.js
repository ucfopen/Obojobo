let mockArgs // array of mocked express middleware request arguments
const userFunctions = ['getCurrentVisitFromRequest']

jest.mock('test_node')
jest.mock('../models/visit')

const MockVisitModel = oboRequire('models/visit')

describe('current user middleware', () => {
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

			oboRequire('express_current_visit')(req, res, mockNext)
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
		expect.assertions(userFunctions.length * 2)

		let [res, req, mockJson, mockStatus, mockNext] = mockArgs

		userFunctions.forEach(func => {
			expect(req).toHaveProperty(func)
			expect(req[func]).toBeInstanceOf(Function)
		})
	})

	test('getCurrentVisitFromRequest resolves if already loaded', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		req.currentVisit = {}
		return req.getCurrentVisitFromRequest().then(result => {
			expect(result).toBeUndefined()
			expect(MockVisitModel.fetchById).not.toHaveBeenCalled()
		})
	})

	test('getCurrentVisitFromRequest finds visitId in body, loads from db, and resolves', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		req.body = {
			visitId: 'mock-visit-id-8'
		}
		return req.getCurrentVisitFromRequest().then(result => {
			expect(result).toBeUndefined()
			expect(req.currentVisit).toBeInstanceOf(MockVisitModel)
			expect(MockVisitModel.fetchById).toHaveBeenCalledWith('mock-visit-id-8')
		})
	})

	test('getCurrentVisitFromRequest finds visitId in body event, loads from db, and resolves', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		req.body = {
			event: {
				visitId: 'mock-visit-id-9'
			}
		}
		return req.getCurrentVisitFromRequest().then(result => {
			expect(result).toBeUndefined()
			expect(req.currentVisit).toBeInstanceOf(MockVisitModel)
			expect(MockVisitModel.fetchById).toHaveBeenCalledWith('mock-visit-id-9')
		})
	})

	test('getCurrentVisitFromRequest rejects when visitId isnt in req', () => {
		let [res, req, mockJson, mockStatus, mockNext] = mockArgs
		return req.getCurrentVisitFromRequest().catch(error => {
			expect(error).toBeInstanceOf(Error)
			expect(error.message).toContain('Missing required Visit Id')
		})
	})
})
