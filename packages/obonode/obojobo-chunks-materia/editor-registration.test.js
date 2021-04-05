jest.mock('./editor-component', () => global.mockReactComponent(this, 'MockMateria'))
jest.mock('slate')
jest.mock('./converter')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/text-util')
jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')

import Materia from './editor-registration'
import { Element, Node, Transforms } from 'slate'
import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'

const MATERIA_NODE = 'ObojoboDraft.Chunks.Materia'

describe('Materia editorRegistration', () => {
	test('has expected properties', () => {
		expect(Materia).toMatchInlineSnapshot(`
		Object {
		  "helpers": Object {
		    "oboToSlate": [MockFunction],
		    "slateToObo": [MockFunction],
		  },
		  "icon": Object {},
		  "isContent": true,
		  "isInsertable": true,
		  "json": Object {
		    "emptyNode": Object {
		      "children": Array [
		        Object {
		          "text": "",
		        },
		      ],
		      "content": Object {},
		      "type": "ObojoboDraft.Chunks.Materia",
		    },
		  },
		  "menuLabel": "Materia Widget",
		  "name": "ObojoboDraft.Chunks.Materia",
		  "plugins": Object {
		    "decorate": [Function],
		    "onKeyDown": [Function],
		    "renderNode": [Function],
		  },
		}
	`)
	})

	test('plugins.renderNode renders an Materia when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MATERIA_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Materia.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.decorate makes a placeholder', () => {
		Element.isElement.mockReturnValueOnce(true)
		Node.string.mockReturnValueOnce('')
		expect(Materia.plugins.decorate([null, null], {})).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "anchor": undefined,
		    "focus": undefined,
		    "placeholder": "Type a widget caption here",
		  },
		]
	`)
	})

	test('plugins.decorate does nothing when theres text', () => {
		Element.isElement.mockReturnValueOnce(true)
		Node.string.mockReturnValueOnce('mock-value')
		expect(Materia.plugins.decorate([null, null], {})).toMatchInlineSnapshot(`Array []`)
	})

	test('plugins.onKeyDown deals with no special key', () => {
		const event = {
			key: 'k',
			preventDefault: jest.fn()
		}

		Materia.plugins.onKeyDown([{}, [0]], {}, event)

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onKeyDown deals with [Enter]', () => {
		jest.spyOn(Transforms, 'insertText').mockReturnValueOnce(true)

		const event = {
			key: 'Enter',
			preventDefault: jest.fn()
		}

		Materia.plugins.onKeyDown([{}, [0]], {}, event)
		expect(KeyDownUtil.breakToText).toHaveBeenCalled()
	})
})
