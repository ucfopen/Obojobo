jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

// mock out each of the nodes  - we're just testing that assessment registers them
jest.mock('./editor-registration', () => ({
	EditorNode: 1
}))
jest.mock('./components/rubric/editor-registration', () => ({
	Rubric: 1
}))
jest.mock('./post-assessment/editor-registration', () => ({
	PostAssessment: 1
}))

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common'

describe('Assessment editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		const EditorClientEntry = require('./editor')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(3)

		expect(Common.Registry.registerEditorModel.mock.calls).toMatchInlineSnapshot(`
		Array [
		  Array [
		    Object {
		      "EditorNode": 1,
		    },
		  ],
		  Array [
		    Object {
		      "Rubric": 1,
		    },
		  ],
		  Array [
		    Object {
		      "PostAssessment": 1,
		    },
		  ],
		]
	`)
	})
})
