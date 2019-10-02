import Schema from './schema'
import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'

const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const { CHILD_TYPE_INVALID, CHILD_MIN_INVALID } = SchemaViolations

describe('Page editor schema', () => {
	test('plugins.schema.normalize adds required children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize adds required children', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		Schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: { key: 'mockKey' },
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('plugins.schema.normalize handles invalid children types', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			withoutNormalizing: jest.fn()
		}

		// call normalize against an invalid child
		Schema.blocks[PAGE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: { key: 'mockKey' },
			child: { key: 'mockChildKey' },
			index: 0
		})

		expect(editor.insertNodeByKey).not.toHaveBeenCalled()
		expect(editor.withoutNormalizing).toHaveBeenCalled()

		// grab the callback function
		const woNormalizingCallback = editor.withoutNormalizing.mock.calls[0][0]

		// callback should take one argument
		expect(woNormalizingCallback).toHaveLength(1)

		// prep args for the callback
		const callbackArgs = {
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		// call the callback
		woNormalizingCallback(callbackArgs)

		expect(callbackArgs.insertNodeByKey).toHaveBeenCalledTimes(1)
		expect(callbackArgs.insertNodeByKey.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  "mockKey",
		  0,
		  Immutable.Record {
		    "data": Immutable.Map {},
		    "key": "4",
		    "nodes": Immutable.List [
		      Immutable.Record {
		        "data": Immutable.Map {},
		        "key": "5",
		        "nodes": Immutable.List [],
		        "type": "ObojoboDraft.Chunks.Text",
		      },
		    ],
		    "type": "oboeditor.component",
		  },
		]
	`)
	})
})
