jest.mock('obojobo-chunks-materia/editor-component', () =>
	global.mockReactComponent(this, 'MockMateria')
)
jest.mock('slate')
jest.mock('obojobo-chunks-materia/converter')

import MateriaAssessment from './editor-registration'

describe('Materia editorRegistration', () => {
	test('has expected properties', () => {
		// The editor registration for the MateriaAssessment chunk basically extends the
		//  editor registration for the Materia chunk, so it should look the same
		expect(MateriaAssessment).toMatchInlineSnapshot(`
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
		      "type": "ObojoboDraft.Chunks.MateriaAssessment",
		    },
		  },
		  "menuLabel": "Materia Widget Assessment",
		  "name": "ObojoboDraft.Chunks.MateriaAssessment",
		  "plugins": Object {
		    "decorate": [Function],
		    "onKeyDown": [Function],
		    "renderNode": [Function],
		  },
		}
	`)
	})
})
