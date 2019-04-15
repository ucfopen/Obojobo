import React from 'react'
import Common from 'obojobo-document-engine/src/scripts/common'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import SlateReact from 'slate-react'
jest.mock('slate-react')

jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn()
	},
	components: {
		Button: jest.fn(),
		modal: {
			SimpleDialog: jest.fn()
		}
	},
	util: {
		RangeParsing: {
			getParsedRange: jest.fn()
		}
	}
}))
jest.mock('obojobo-pages-page/editor')
jest.mock('obojobo-chunks-question-bank/editor')
jest.mock('./components/rubric/editor')
jest.mock('./post-assessment/editor-component')

import Assessment from './editor'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'

describe('Assessment editor', () => {
	test('Node component', () => {
		const Node = Assessment.components.Node
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: {
						size: 5
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Node component adds child', () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		const Node = Assessment.components.Node
		const component = shallow(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					},
					nodes: { size: 0 }
				}}
				editor={editor}
			/>
		)
		const tree = component.html()

		component
			.find('button')
			.at(0)
			.simulate('click')

		expect(tree).toMatchSnapshot()
	})

	test('ModList component', () => {
		const Node = Assessment.components.Settings
		const component = renderer.create(
			<Node
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('slateToObo converts a Slate node to an OboNode with content', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => {
					return {}
				}
			},
			nodes: [
				{
					type: PAGE_NODE
				},
				{
					type: QUESTION_BANK_NODE
				},
				{
					type: ACTIONS_NODE
				},
				{
					type: RUBRIC_NODE
				},
				{
					type: SETTINGS_NODE,
					nodes: {
						get: () => {
							return {
								text: 'mockText',
								data: {
									get: jest.fn()
								}
							}
						}
					}
				}
			]
		}
		const oboNode = Assessment.helpers.slateToObo(slateNode)

		expect(oboNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node', () => {
		const oboNode = {
			get: jest.fn().mockReturnValueOnce({}),
			attributes: {
				children: [
					{
						type: PAGE_NODE
					},
					{
						type: QUESTION_BANK_NODE
					}
				]
			}
		}
		const slateNode = Assessment.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node', () => {
		const oboNode = {
			get: jest.fn().mockReturnValueOnce({ rubric: 'mockRubric' }),
			attributes: {
				children: [
					{
						type: PAGE_NODE
					},
					{
						type: QUESTION_BANK_NODE
					}
				]
			}
		}
		const slateNode = Assessment.helpers.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('plugins.onPaste pastes anything other than an Assessment', () => {
		SlateReact.getEventTransfer.mockReturnValueOnce({
			type: 'fragment',
			fragment: {
				nodes: {
					get: () => ({ type: 'mockNode'})
				}
			}
		})
		const next = jest.fn()

		Assessment.plugins.onPaste(null, null, next)

		expect(next).toHaveBeenCalled()
	})

	test('plugins.onPaste pastes an Assessment', () => {
		const assessmentMock = {
			type: ASSESSMENT_NODE,
			toJSON: jest.fn().mockReturnValueOnce('mock assessment')
		}

		SlateReact.getEventTransfer.mockReturnValueOnce({
			type: 'fragment',
			fragment: {
				nodes: {
					get: () => (assessmentMock)
				}
			}
		})

		const editor = {
			insertFragment: jest.fn()
		}

		Assessment.plugins.onPaste(null, editor, jest.fn())

		expect(editor.insertFragment).toHaveBeenCalled()
	})

	test('plugins.renderNode renders the Assessment when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: ASSESSMENT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Assessment.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders Settings when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: SETTINGS_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Assessment.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode calls next', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(Assessment.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('getNavItem returns expected object', () => {
		const assessmentMock = Common.Registry.registerModel.mock.calls[0][1]

		const model = {
			parent: {
				children: {
					models: [{ get: () => true }]
				}
			},
			title: 'Test Title'
		}

		expect(assessmentMock.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Test Title',
			path: ['test-title'],
			showChildren: false,
			showChildrenOnNavigation: false
		})

		model.title = null
		expect(assessmentMock.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Assessment',
			path: ['assessment'],
			showChildren: false,
			showChildrenOnNavigation: false
		})
	})
})
