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
	},
})

describe('PostAssessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return null
				}
			},
			nodes: [
				{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: [
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
				    "for": Object {},
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
		  "nodes": Array [
		    Object {
		      "data": Object {
		        "for": "dummyRange",
		      },
		      "nodes": Array [
		        "PageOboToSlate",
		      ],
		      "object": "block",
		      "type": "ObojoboDraft.Sections.Assessment.ScoreAction",
		    },
		  ],
		  "object": "block",
		  "type": "ObojoboDraft.Sections.Assessment.ScoreActions",
		}
	`)
	})
})
