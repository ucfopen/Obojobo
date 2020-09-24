jest.mock('./editor-component', () => global.mockReactComponent(this, 'MockMateria'))
jest.mock('slate')
jest.mock('./converter')
import Materia from './editor-registration'
import { Element, Node } from 'slate'

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
})
