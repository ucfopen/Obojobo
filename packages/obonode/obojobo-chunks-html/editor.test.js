jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('HTML editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		const EditorClientEntry = require('./editor')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(1)

		expect(Common.Registry.registerEditorModel.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "helpers": Object {
		    "oboToSlate": [Function],
		    "slateToObo": [Function],
		  },
		  "icon": [Function],
		  "isInsertable": true,
		  "json": Object {
		    "emptyNode": Object {
		      "isVoid": false,
		      "nodes": Array [
		        Object {
		          "leaves": Array [
		            Object {
		              "marks": Array [],
		              "object": "leaf",
		              "text": "",
		            },
		          ],
		          "object": "text",
		        },
		      ],
		      "object": "block",
		      "type": "ObojoboDraft.Chunks.HTML",
		    },
		  },
		  "menuLabel": "HTML",
		  "name": "ObojoboDraft.Chunks.HTML",
		  "plugins": Object {
		    "onKeyDown": [Function],
		    "renderNode": [Function],
		    "schema": Object {
		      "blocks": Object {
		        "ObojoboDraft.Chunks.HTML": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "object": "text",
		                },
		              ],
		              "max": 1,
		              "min": 1,
		            },
		          ],
		        },
		      },
		    },
		  },
		}
	`)
	})
})
