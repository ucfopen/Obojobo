jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Table editor script', () => {
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
		      "data": Object {
		        "content": Object {
		          "header": true,
		          "numCols": 1,
		          "textGroup": Object {
		            "numCols": 1,
		            "numRows": 1,
		          },
		        },
		      },
		      "isVoid": false,
		      "nodes": Array [
		        Object {
		          "data": Object {
		            "content": Object {
		              "header": true,
		              "numCols": 1,
		            },
		          },
		          "isVoid": false,
		          "nodes": Array [
		            Object {
		              "data": Object {
		                "content": Object {
		                  "header": true,
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
		              "type": "ObojoboDraft.Chunks.Table.Cell",
		            },
		          ],
		          "object": "block",
		          "type": "ObojoboDraft.Chunks.Table.Row",
		        },
		      ],
		      "object": "block",
		      "type": "ObojoboDraft.Chunks.Table",
		    },
		  },
		  "menuLabel": "Table",
		  "name": "ObojoboDraft.Chunks.Table",
		  "plugins": Object {
		    "normalizeNode": [Function],
		    "onCut": [Function],
		    "onKeyDown": [Function],
		    "onPaste": [Function],
		    "renderNode": [Function],
		    "schema": Object {
		      "blocks": Object {
		        "ObojoboDraft.Chunks.Table": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "type": "ObojoboDraft.Chunks.Table.Row",
		                },
		              ],
		              "min": 1,
		            },
		          ],
		          "normalize": [Function],
		        },
		        "ObojoboDraft.Chunks.Table.Cell": Object {
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
		        "ObojoboDraft.Chunks.Table.Row": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "type": "ObojoboDraft.Chunks.Table.Cell",
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
		}
	`)
	})
})
