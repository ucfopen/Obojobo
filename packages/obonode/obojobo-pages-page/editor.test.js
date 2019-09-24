jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Page editor script', () => {
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
		  "isInsertable": false,
		  "menuLabel": "Page",
		  "name": "ObojoboDraft.Pages.Page",
		  "plugins": Object {
		    "renderNode": [Function],
		    "schema": Object {
		      "blocks": Object {
		        "ObojoboDraft.Pages.Page": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "type": "oboeditor.component",
		                },
		              ],
		              "min": 1,
		            },
		          ],
		          "normalize": [Function],
		        },
		      },
		    },
		  },
		  "supportsChildren": true,
		}
	`)
	})
})
