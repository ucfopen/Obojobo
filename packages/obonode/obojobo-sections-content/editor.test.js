jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Conetent editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		const EditorClientEntry = require('./editor')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(1)

		expect(Common.Registry.registerEditorModel.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "getNavItem": [Function],
		  "helpers": Object {
		    "oboToSlate": [Function],
		    "slateToObo": [Function],
		  },
		  "ignore": true,
		  "isInsertable": false,
		  "name": "ObojoboDraft.Sections.Content",
		  "plugins": null,
		}
	`)
	})
})
