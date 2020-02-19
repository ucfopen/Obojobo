import Converter from './converter'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
import Common from 'obojobo-document-engine/src/scripts/common'

// Page
Common.Registry.registerEditorModel({
	name: PAGE_NODE,
	isInsertable: false,
	supportsChildren: true,
	helpers: {
		slateToObo: () => 'PageChild',
		oboToSlate: () => 'PageOboToSlate'
	}
})

describe('PostAssessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			id: 'mockKey',
			type: 'mockType',
			content: {},
			children: [
				{
					content: {},
					children: [
						{
							key: 'mockPage'
						}
					]
				}
			]
		}

		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "for": undefined,
		    "page": "PageChild",
		  },
		]
	`)
	})

	test('oboToSlate converts an OboComponent to a Slate node', () => {
		const oboNode = [
			{
				for: 'dummyRange',
				page: 'dummyPage'
			}
		]

		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchInlineSnapshot(`
		Object {
		  "children": Array [
		    Object {
		      "children": Array [
		        "PageOboToSlate",
		      ],
		      "content": Object {
		        "for": "dummyRange",
		      },
		      "subtype": "ObojoboDraft.Sections.Assessment.ScoreAction",
		      "type": "ObojoboDraft.Sections.Assessment.ScoreActions",
		    },
		  ],
		  "type": "ObojoboDraft.Sections.Assessment.ScoreActions",
		}
	`)
	})

	test('oboToSlate converts a legacy OboComponent to a Slate node', () => {
		const oboNode = [
			{
				from: '0',
				to: '100',
				page: 'dummyPage'
			}
		]

		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchInlineSnapshot(`
		Object {
		  "children": Array [
		    Object {
		      "children": Array [
		        "PageOboToSlate",
		      ],
		      "content": Object {
		        "for": "[0,100]",
		      },
		      "subtype": "ObojoboDraft.Sections.Assessment.ScoreAction",
		      "type": "ObojoboDraft.Sections.Assessment.ScoreActions",
		    },
		  ],
		  "type": "ObojoboDraft.Sections.Assessment.ScoreActions",
		}
	`)
	})
})
