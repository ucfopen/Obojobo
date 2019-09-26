jest.mock('obojobo-document-engine/src/scripts/common', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

jest.mock('./editor-registration', () => ({ EditorNode: 1 }))
jest.mock('./components/rubric/editor-registration', () => ({ RubricNode: 1 }))
jest.mock('./post-assessment/editor-registration', () => ({ PostAssessmentNode: 1 }))

import Common from 'obojobo-document-engine/src/scripts/common'

describe('Assessment editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		require('./editor')
		const AssessmentReg = require('./editor-registration')
		const RubricReg = require('./components/rubric/editor-registration')
		const PostAssessmentReg = require('./post-assessment/editor-registration')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(3)

		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(AssessmentReg)
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(RubricReg)
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledWith(PostAssessmentReg)
	})
})
