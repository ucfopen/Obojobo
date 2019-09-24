jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Code editor script', () => {
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
		      "data": Object {},
		      "isVoid": false,
		      "nodes": Array [
		        Object {
		          "data": Object {
		            "content": Object {
		              "indent": 0,
		            },
		          },
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
		          "type": "ObojoboDraft.Chunks.Code.CodeLine",
		        },
		      ],
		      "object": "block",
		      "type": "ObojoboDraft.Chunks.Code",
		    },
		  },
		  "menuLabel": "Code",
		  "name": "ObojoboDraft.Chunks.Code",
		  "plugins": Object {
		    "onKeyDown": [Function],
		    "onPaste": [Function],
		    "queries": Object {
		      "createCodeLinesFromText": [Function],
		    },
		    "renderNode": [Function],
		    "renderPlaceholder": [Function],
		    "schema": Object {
		      "blocks": Object {
		        "ObojoboDraft.Chunks.Code": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "type": "ObojoboDraft.Chunks.Code.CodeLine",
		                },
		              ],
		              "min": 1,
		            },
		          ],
		          "normalize": [Function],
		        },
		        "ObojoboDraft.Chunks.Code.CodeLine": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "object": "text",
		                },
		              ],
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
