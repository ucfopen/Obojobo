/* eslint no-extend-native: 0 */

const originalFetch = global.fetch
const API = require('../../../src/scripts/viewer/util/api')
const EditorAPI = require('../../../src/scripts/viewer/util/editor-api').default

describe('EditorAPI', () => {
	let mockJsonResult
	let post
	let postWithFormat
	let deleteMethod
	let get

	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		expect.hasAssertions()

		mockJsonResult = {}
		post = jest.spyOn(API, 'post')
		post.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		get = jest.spyOn(API, 'get')
		get.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		postWithFormat = jest.spyOn(API, 'postWithFormat')
		postWithFormat.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})

		deleteMethod = jest.spyOn(API, 'delete')
		deleteMethod.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult)
		})
	})

	beforeAll(() => {
		global.fetch = jest.fn()
	})
	afterAll(() => {
		global.fetch = originalFetch
	})

	test('getDraft fetches with the correct args', async () => {
		const res = await EditorAPI.getDraft('mock-draft-id')

		expect(get).toHaveBeenCalledWith('/api/drafts/mock-draft-id', 'json')
		expect(res).toBe(mockJsonResult)
	})

	test('getFullDraft fetches with the correct args', async () => {
		const res = await EditorAPI.getFullDraft('mock-draft-id')

		expect(get).toHaveBeenCalledWith('/api/drafts/mock-draft-id/full', 'json')
		expect(res).toBe('{}')
	})

	test('getFullDraft fetches with the correct args with format', async () => {
		const res = await EditorAPI.getFullDraft('mock-draft-id', 'application/xml')

		expect(get).toHaveBeenCalledWith('/api/drafts/mock-draft-id/full', 'application/xml')
		expect(res).toBe('{}')
	})

	test('postDraft fetches with the correct args', async () => {
		const res = await EditorAPI.postDraft('mock-draft-id', 'contents')

		expect(postWithFormat).toHaveBeenCalledWith(
			'/api/drafts/mock-draft-id',
			'contents',
			'application/json'
		)
		expect(res).toBe(mockJsonResult)
	})

	test('postDraft fetches with the correct args with format', async () => {
		const res = await EditorAPI.postDraft('mock-draft-id', 'contents', 'application/xml')

		expect(postWithFormat).toHaveBeenCalledWith(
			'/api/drafts/mock-draft-id',
			'contents',
			'application/xml'
		)
		expect(res).toBe(mockJsonResult)
	})

	test('createNewDraft fetches with the correct args', async () => {
		const res = await EditorAPI.createNewDraft()

		expect(post).toHaveBeenCalledWith('/api/drafts/new')
		expect(res).toBe(mockJsonResult)
	})

	test('deleteDraft fetches with the correct args', async () => {
		const res = await EditorAPI.deleteDraft('draft-id')

		expect(deleteMethod).toHaveBeenCalledWith('/api/drafts/draft-id')
		expect(res).toBe(mockJsonResult)
	})
})
