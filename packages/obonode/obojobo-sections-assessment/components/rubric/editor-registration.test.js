jest.mock('obojobo-document-engine/src/scripts/oboeditor/util/keydown-util')
jest.mock('slate-react')
jest.mock('./editor-component', () => global.mockReactComponent(this, 'Rubric'))
jest.mock('./mod', () => global.mockReactComponent(this, 'Mod'))
jest.mock('./mod-list', () => global.mockReactComponent(this, 'ModList'))
jest.mock('./schema', () => ({ mock: 'schema' }))
jest.mock('./converter', () => ({ mock: 'converter' }))

import KeyDownUtil from 'obojobo-document-engine/src/scripts/oboeditor/util/keydown-util'
import SlateReact from 'slate-react'
import Rubric from './editor-registration'

const RUBRIC_NODE = 'ObojoboDraft.Sections.Assessment.Rubric'
const MOD_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.Mod'
const MOD_LIST_NODE = 'ObojoboDraft.Sections.Assessment.Rubric.ModList'

describe('Rubric editor', () => {
	test('plugins.onPaste deals with no rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			}
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onPaste(event, editor, jest.fn())

		expect(event.preventDefault).not.toHaveBeenCalled()
	})

	test('plugins.onPaste deals with pasting into rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				}
			}
		}
		editor.insertText = jest.fn().mockReturnValueOnce(editor)

		SlateReact.getEventTransfer.mockReturnValueOnce({ text: 'mock text' })

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onPaste(event, editor, jest.fn())

		expect(editor.insertText).toHaveBeenCalled()
	})

	test('plugins.onCut deals with no rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			},
			extractTextToFragment: jest.fn()
		}
		editor.insertBlock = jest.fn().mockReturnValueOnce(editor)

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCut(event, editor, jest.fn())

		expect(editor.extractTextToFragment).not.toHaveBeenCalled()
		expect(KeyDownUtil.deleteNodeContents).not.toHaveBeenCalled()
	})

	test('plugins.onCut deals with cutting from rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				},
				fragment: { text: 'selected text' }
			},
			extractTextToFragment: jest.fn()
		}

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCut(event, editor, jest.fn())

		expect(editor.extractTextToFragment).toHaveBeenCalled()
		expect(KeyDownUtil.deleteNodeContents).toHaveBeenCalled()
	})

	test('plugins.onCopy deals with no rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: () => false
				}
			},
			extractTextToFragment: jest.fn()
		}

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCopy(event, editor, jest.fn())

		expect(editor.extractTextToFragment).not.toHaveBeenCalled()
	})

	test('plugins.onCopy deals with copying from rubric', () => {
		const editor = {
			value: {
				blocks: [
					{
						key: 'mockBlockKey'
					}
				],
				document: {
					getClosest: (key, funct) => {
						funct({ type: 'mockType' })
						return true
					}
				},
				fragment: { text: 'selected text' }
			},
			extractTextToFragment: jest.fn()
		}

		const event = {
			preventDefault: jest.fn()
		}

		Rubric.plugins.onCopy(event, editor, jest.fn())

		expect(editor.extractTextToFragment).toHaveBeenCalled()
	})

	test('plugins.renderNode renders the rubric when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: RUBRIC_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MOD_LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MOD_LIST_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test('plugins.renderNode renders a modlist when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: MOD_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(Rubric.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(Rubric.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test('extractTextToFragment copies the current text', () => {
		const editor = {
			value: {
				fragment: { text: 'selected text' }
			}
		}
		expect(Rubric.plugins.queries.extractTextToFragment(editor)).toMatchSnapshot()
	})
})
