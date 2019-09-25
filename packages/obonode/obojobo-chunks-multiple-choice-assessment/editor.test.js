jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

jest.mock('./editor-registration', () => ({ EditorNode: 1 }))
jest.mock('./MCAnswer/editor-registration', () => ({ MCAnswerEditorNode: 1 }))
jest.mock('./MCChoice/editor-registration', () => ({ MCChoiceEditorNode: 1 }))
jest.mock('./MCFeedback/editor-registration', () => ({ MCFeedbackEditorNode: 1 }))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Multiple Choice editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		const EditorClientEntry = require('./editor')
		const EditorRegistration = require('./editor-registration')
		const MCAnswerReg = require('./MCAnswer/editor-registration')
		const MCChoiceReg = require('./MCChoice/editor-registration')
		const MCFeedbackReg = require('./MCFeedback/editor-registration')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(4)

		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(EditorRegistration)
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(MCAnswerReg)
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(MCChoiceReg)
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(MCFeedbackReg)
	})
})
