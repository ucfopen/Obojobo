jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

jest.mock('./editor-registration', () => ({ EditorNode: 1 }))
jest.mock('./NumericAnswer/editor-registration', () => ({ NumericAnswerNode: 1 }))

import Common from 'obojobo-document-engine/src/scripts/common/index'

import { NUMERIC_CHOICE_NODE, NUMERIC_FEEDBACK_NODE } from './constants'

describe('Multiple Choice editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		require('./editor')
		const EditorRegistration = require('./editor-registration')
		const NumericAnswer = require('./NumericAnswer/editor-registration')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(4)

		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(EditorRegistration)
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(NumericAnswer)
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith({ name: NUMERIC_CHOICE_NODE })
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith({
			name: NUMERIC_FEEDBACK_NODE
		})
	})
})
