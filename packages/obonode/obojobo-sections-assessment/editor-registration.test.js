jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn(),
		getItemForType: jest.fn()
	}
}))
jest.mock('./editor-component', () => global.mockReactComponent(this, 'Assessment'))
jest.mock('./components/settings/editor-component', () =>
	global.mockReactComponent(this, 'Settings')
)
jest.mock('./schema', () => ({ mock: 'schema' }))
jest.mock('./converter', () => ({ mock: 'converter' }))
jest.mock('slate-react')

import Common from 'obojobo-document-engine/src/scripts/common'
import { Block } from 'slate'
import Assessment from './editor-registration'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'
const PAGE_NODE = 'ObojoboDraft.Pages.Page'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const ACTIONS_NODE = 'ObojoboDraft.Sections.Assessment.ScoreActions'

describe('Assessment editor', () => {
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
		const model = {
			parent: {
				children: {
					models: [{ get: () => true }]
				}
			},
			title: 'Test Title'
		}

		expect(Assessment.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Test Title',
			path: ['test-title'],
			showChildren: false,
			showChildrenOnNavigation: false
		})

		model.title = null
		expect(Assessment.getNavItem(model)).toEqual({
			type: 'link',
			label: 'Assessment',
			path: ['assessment'],
			showChildren: false,
			showChildrenOnNavigation: false
		})
	})

	test('getPasteNode extracts content', () => {
		const assessment = {
			object: 'block',
			type: ASSESSMENT_NODE,
			nodes: [
				{
					object: 'block',
					type: PAGE_NODE,
					nodes: [
						{
							object: 'block',
							type: 'mock-node'
						}
					]
				},
				{
					object: 'block',
					type: QUESTION_BANK_NODE
				},
				{
					object: 'block',
					type: ACTIONS_NODE,
					nodes: [
						{
							object: 'block',
							type: 'mock-action-node',
							nodes: [
								{
									object: 'block',
									type: PAGE_NODE,
									nodes: [
										{
											object: 'block',
											type: 'mock-node'
										}
									]
								}
							]
						}
					]
				}
			]
		}
		Common.Registry.getItemForType.mockReturnValueOnce({ getPasteNode: node => node })

		expect(Assessment.getPasteNode(Block.create(assessment))).toMatchSnapshot()
	})

	test('getPasteNode extracts partial qbs', () => {
		const assessment = {
			object: 'block',
			type: ASSESSMENT_NODE,
			nodes: [
				{
					object: 'block',
					type: QUESTION_BANK_NODE
				}
			]
		}
		Common.Registry.getItemForType.mockReturnValueOnce({ getPasteNode: node => [node] })

		expect(Assessment.getPasteNode(Block.create(assessment))).toMatchSnapshot()
	})

	test('getPasteNode extracts no nodes', () => {
		const assessment = {
			object: 'block',
			type: ASSESSMENT_NODE,
			nodes: [
				{
					object: 'block',
					type: 'mock-node'
				}
			]
		}
		expect(Assessment.getPasteNode(Block.create(assessment))).toEqual([])
	})
})
