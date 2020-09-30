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
			text: () => JSON.stringify(mockJsonResult),
			headers: {
				get: () => 'mockContentId'
			}
		})

		postWithFormat = jest.spyOn(API, 'postWithFormat')
		postWithFormat.mockResolvedValueOnce({
			json: () => mockJsonResult,
			text: () => JSON.stringify(mockJsonResult),
			headers: {
				get: () => 'mockContentId'
			}
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
		expect(res).toEqual({ body: '{}', contentId: 'mockContentId' })
	})

	test('getFullDraft fetches with the correct args with format', async () => {
		const res = await EditorAPI.getFullDraft('mock-draft-id', 'application/xml')

		expect(get).toHaveBeenCalledWith('/api/drafts/mock-draft-id/full', 'application/xml')
		expect(res).toEqual({ body: '{}', contentId: 'mockContentId' })
	})

	test('postDraft fetches with the correct args', async () => {
		const res = await EditorAPI.postDraft('mock-draft-id', 'contents')

		expect(postWithFormat).toHaveBeenCalledWith(
			'/api/drafts/mock-draft-id',
			'contents',
			'application/json'
		)
		expect(res).toEqual({ result: {}, contentId: 'mockContentId' })
	})

	test('postDraft fetches with the correct args with format', async () => {
		const res = await EditorAPI.postDraft('mock-draft-id', 'contents', 'application/xml')

		expect(postWithFormat).toHaveBeenCalledWith(
			'/api/drafts/mock-draft-id',
			'contents',
			'application/xml'
		)
		expect(res).toEqual({ result: {}, contentId: 'mockContentId' })
	})

	test('createNewDraft fetches with the correct args', async () => {
		const res = await EditorAPI.createNewDraft('mock_content', 'mock_format')

		expect(post).toHaveBeenCalledWith('/api/drafts/new', {
			content: 'mock_content',
			format: 'mock_format'
		})
		expect(res).toEqual(mockJsonResult)
	})

	test('deleteDraft fetches with the correct args', async () => {
		const res = await EditorAPI.deleteDraft('draft-id')

		expect(deleteMethod).toHaveBeenCalledWith('/api/drafts/draft-id')
		expect(res).toBe(mockJsonResult)
	})

	test('copyDraft fetches with the correct args', async () => {
		const res = await EditorAPI.copyDraft('draft-id', 'new-title')

		expect(post).toHaveBeenCalledWith('/api/drafts/draft-id/copy', { title: 'new-title' })
		expect(res).toBe(mockJsonResult)
	})

	test('createNewDraft calls fetch and returns', () => {
		expect.hasAssertions()

		return EditorAPI.createNewDraft('mock_content', 'mock_format').then(result => {
			expect(post).toHaveBeenCalledWith('/api/drafts/new', {
				content: 'mock_content',
				format: 'mock_format'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('deleteDraft calls fetch and returns', async () => {
		expect.hasAssertions()

		return EditorAPI.deleteDraft('mock-draft-id').then(result => {
			expect(deleteMethod).toHaveBeenCalledWith('/api/drafts/mock-draft-id')
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('copyDraft calls post and returns', async () => {
		expect.hasAssertions()

		return EditorAPI.copyDraft('mock-draft-id', 'new title').then(result => {
			expect(post).toHaveBeenCalledWith('/api/drafts/mock-draft-id/copy', { title: 'new title' })
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('getDraftRevision calls fetch and returns', async () => {
		expect.hasAssertions()

		return EditorAPI.getDraftRevision('mock-draft-id', 'mock-revision-id').then(result => {
			expect(get).toHaveBeenCalledWith('/api/drafts/mock-draft-id/revisions/mock-revision-id')
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('requestEditLock calls fetch and returns', async () => {
		expect.hasAssertions()

		return EditorAPI.requestEditLock('mock-draft-id', 'mock-revision-id').then(result => {
			expect(post).toHaveBeenCalledWith('/api/locks/mock-draft-id', {
				contentId: 'mock-revision-id'
			})
			expect(result).toEqual(mockJsonResult)
		})
	})

	test('deleteLockBeacon calls sendBeacon', () => {
		expect.hasAssertions()
		navigator.sendBeacon = jest.fn()
		EditorAPI.deleteLockBeacon('mock-draft-id')

		expect(navigator.sendBeacon).toHaveBeenCalledWith('/api/locks/mock-draft-id/delete')
	})
})
