jest.mock('obojobo-document-engine/src/scripts/viewer/util/api')

let API

const APIUtil = require('./api-util')

describe('repository apiutil', () => {
	// 'global' is 'window' in Node
	// we can't use 'window.location' here, have to replace it
	// store the original so we can replace it when we're done
	const originalLocation = global.location
	// same for 'window.alert'
	const originalAlert = global.alert

	beforeAll(() => {
		delete global.location
		delete global.alert
	})

	beforeEach(() => {
		jest.resetAllMocks()

		API = require('obojobo-document-engine/src/scripts/viewer/util/api')

		global.location = {
			assign: jest.fn()
		}
		global.alert = jest.fn()
	})

	afterAll(() => {
		global.location = originalLocation
		global.alert = originalAlert
	})

	test('browser is redirected to /dashboard when API post replies with "success"', () => {
		expect.hasAssertions()

		API.post.mockResolvedValueOnce({ status: 200 })

		return APIUtil.copyModule('mockDraftId').then(() => {
			expect(API.post).toHaveBeenCalledWith('/api/drafts/mockDraftId/copy', { readOnly: false })
			expect(global.location.assign).toHaveBeenCalledWith('/dashboard')
		})
	})

	test('the correct alert message is displayed when API post replies with "unauthorized"', () => {
		expect.hasAssertions()

		API.post.mockResolvedValueOnce({ status: 401 })

		return APIUtil.copyModule('mockDraftId').then(() => {
			expect(API.post).toHaveBeenCalledWith('/api/drafts/mockDraftId/copy', { readOnly: false })
			expect(global.location.assign).not.toHaveBeenCalled()
			expect(global.alert).toHaveBeenCalledTimes(1)
			expect(global.alert).toHaveBeenCalledWith('You are not authorized to copy this module')
		})
	})

	test('the correct alert message is displayed when API post replies with anything else', () => {
		expect.hasAssertions()

		API.post.mockResolvedValueOnce({ status: 500 })

		return APIUtil.copyModule('mockDraftId').then(() => {
			expect(API.post).toHaveBeenCalledWith('/api/drafts/mockDraftId/copy', { readOnly: false })
			expect(global.location.assign).not.toHaveBeenCalled()
			expect(global.alert).toHaveBeenCalledTimes(1)
			expect(global.alert).toHaveBeenCalledWith('Something went wrong while copying')
		})
	})
})
