jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import EditorClientEntry from './editor'
import Common from 'obojobo-document-engine/src/scripts/common/index'
const HEADING_NODE = 'ObojoboDraft.Chunks.Heading'

describe('Heading editor script', () => {
	test('registers node', () => {
		expect(Client.Registry.registerEditorModel).toHaveBeenCalled()
		expect(Common.Registry.registerEditorModel.mock.calls).toMatchInlineSnapShot()

	})
})
