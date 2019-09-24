jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('List editor script', () => {
	test('registers node', () => {
		// shouldn't have been called yet
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(0)

		const EditorClientEntry = require('./editor')

		// the editor script should have registered the model
		expect(Common.Registry.registerEditorModel).toHaveBeenCalledTimes(1)

		expect(Common.Registry.registerEditorModel.mock.calls[0][0]).toMatchInlineSnapshot(`
		Object {
		  "helpers": Object {
		    "isType": [Function],
		    "oboToSlate": [Function],
		    "slateToObo": [Function],
		  },
		  "icon": [Function],
		  "isInsertable": true,
		  "json": Object {
		    "emptyNode": Object {
		      "data": Object {
		        "content": Object {
		          "listStyles": Object {
		            "type": "unordered",
		          },
		        },
		      },
		      "isVoid": false,
		      "nodes": Array [
		        Object {
		          "data": Object {
		            "content": Object {
		              "bulletStyle": "disc",
		              "type": "unordered",
		            },
		          },
		          "isVoid": false,
		          "nodes": Array [
		            Object {
		              "data": Object {},
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
		              "type": "ObojoboDraft.Chunks.List.Line",
		            },
		          ],
		          "object": "block",
		          "type": "ObojoboDraft.Chunks.List.Level",
		        },
		      ],
		      "object": "block",
		      "type": "ObojoboDraft.Chunks.List",
		    },
		  },
		  "menuLabel": "List",
		  "name": "ObojoboDraft.Chunks.List",
		  "plugins": Object {
		    "normalizeNode": [Function],
		    "onKeyDown": [Function],
		    "onPaste": [Function],
		    "queries": Object {
		      "createListLinesFromText": [Function],
		    },
		    "renderNode": [Function],
		    "renderPlaceholder": [Function],
		    "schema": Object {
		      "blocks": Object {
		        "ObojoboDraft.Chunks.List": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "type": "ObojoboDraft.Chunks.List.Level",
		                },
		              ],
		              "min": 1,
		            },
		          ],
		          "normalize": [Function],
		        },
		        "ObojoboDraft.Chunks.List.Level": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "type": "ObojoboDraft.Chunks.List.Level",
		                },
		                Object {
		                  "type": "ObojoboDraft.Chunks.List.Line",
		                },
		              ],
		              "min": 1,
		            },
		          ],
		          "normalize": [Function],
		        },
		        "ObojoboDraft.Chunks.List.Line": Object {
		          "nodes": Array [
		            Object {
		              "match": Array [
		                Object {
		                  "object": "text",
		                },
		              ],
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
