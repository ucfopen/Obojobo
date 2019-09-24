jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerEditorModel: jest.fn()
	}
}))

import Common from 'obojobo-document-engine/src/scripts/common/index'

describe('Break editor script', () => {
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
		          "width": "normal",
		        },
		      },
		      "isVoid": true,
		      "object": "block",
		      "type": "ObojoboDraft.Chunks.Break",
		    },
		  },
		  "menuLabel": "Horizontal Line",
		  "name": "ObojoboDraft.Chunks.Break",
		  "plugins": Object {
		    "renderNode": [Function],
		    "schema": Object {
		      "blocks": Object {
		        "ObojoboDraft.Chunks.Break": Object {
		          "isVoid": true,
		        },
		      },
		    },
		  },
		}
	`)
	})
})
