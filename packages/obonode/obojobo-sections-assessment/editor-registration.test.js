jest.mock('./editor-component', () => global.mockReactComponent(this, 'Assessment'))
jest.mock('./components/settings/editor-component', () =>
	global.mockReactComponent(this, 'Settings')
)
jest.mock('./schema', () => ({ mock: 'schema' }))
jest.mock('./converter', () => ({ mock: 'converter' }))
jest.mock('slate-react')

import SlateReact from 'slate-react'
import Assessment from './editor-registration'

const ASSESSMENT_NODE = 'ObojoboDraft.Sections.Assessment'
const SETTINGS_NODE = 'ObojoboDraft.Sections.Assessment.Settings'

describe('Assessment editor', () => {
	test.skip('plugins.onPaste pastes anything other than an Assessment', () => {
		SlateReact.getEventTransfer.mockReturnValueOnce({
			type: 'fragment',
			fragment: {
				nodes: {
					get: () => ({ type: 'mockNode' })
				}
			}
		})
		const next = jest.fn()

		Assessment.plugins.onPaste(null, null, next)

		expect(next).toHaveBeenCalled()
	})

	test.skip('plugins.onPaste pastes an Assessment', () => {
		const assessmentMock = {
			type: ASSESSMENT_NODE,
			toJSON: jest.fn().mockReturnValueOnce('mock assessment')
		}

		SlateReact.getEventTransfer.mockReturnValueOnce({
			type: 'fragment',
			fragment: {
				nodes: {
					get: () => assessmentMock
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
})
