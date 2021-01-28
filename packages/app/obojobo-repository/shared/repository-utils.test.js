describe('repository utils', () => {
	test('urlForEditor generates urls based on input', () => {
		const repositoryUtils = require('./repository-utils')
		const url = repositoryUtils.urlForEditor('mockEditorType', 'mockDraftId')
		expect(url).toBe('/editor/mockEditorType/mockDraftId')
	})
})
