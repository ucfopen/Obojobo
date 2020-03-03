jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

jest.mock('./editor-registration', () => ({
	EditorNode: 1
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Action Button editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		require('./editor')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(1)

		expect(Common.Registry.registerEditorModel.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "EditorNode": 1,
		}
	`)
	})
})
