jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Text editor script', () => {
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
		            "indent": 0,
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
		          "type": "ObojoboDraft.Chunks.Text.TextLine",
		        },
		      ],
		      "object": "block",
		      "type": "ObojoboDraft.Chunks.Text",
		    },
		  },
		  "menuLabel": "Text",
		  "name": "ObojoboDraft.Chunks.Text",
		  "plugins": Object {
		    "onKeyDown": [Function],
		    "onPaste": [Function],
		    "queries": Object {
		      "createTextLinesFromText": [Function],
		    },
		    "renderNode": [Function],
		    "renderPlaceholder": [Function],
		    "schema": Object {
		      "blocks": Object {
		        "ObojoboDraft.Chunks.Text": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "type": "ObojoboDraft.Chunks.Text.TextLine",
		                },
		              ],
		              "min": 1,
		            },
		          ],
		          "normalize": [Function],
		        },
		        "ObojoboDraft.Chunks.Text.TextLine": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "object": "text",
		                },
		              ],
		            },
		          ],
		          "normalize": [Function],
		        },
		      },
		    },
		  },
		}
	`)
	})
})
