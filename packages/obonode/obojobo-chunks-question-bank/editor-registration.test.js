jest.mock('obojobo-document-engine/src/scripts/common/index', () => ({
	Registry: {
		registerModel: jest.fn(),
		getItemForType: jest.fn()
	}
}))

jest.mock('./editor-component', () => global.mockReactComponent(this, 'QuestionBank'))
jest.mock('./icon', () => global.mockReactComponent(this, 'Icon'))
jest.mock('./components/settings/editor-component', () =>
	global.mockReactComponent(this, 'Settings')
)
jest.mock('./schema', () => ({ mock: 'schema' }))
jest.mock('./converter', () => ({ mock: 'converter' }))
import Common from 'obojobo-document-engine/src/scripts/common'
import QuestionBank from './editor-registration'
const QUESTION_BANK_NODE = 'ObojoboDraft.Chunks.QuestionBank'
const SETTINGS_NODE = 'ObojoboDraft.Chunks.QuestionBank.Settings'
const QUESTION_NODE = 'ObojoboDraft.Chunks.Question'

describe('QuestionBank editor', () => {
	test('plugins.renderNode renders a question bank when passed', () => {
		const props = {
			attributes: { dummy: 'dummyData' },
			node: {
				type: QUESTION_BANK_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(QuestionBank.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
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

		expect(QuestionBank.plugins.renderNode(props, null, next)).toMatchSnapshot()
	})

	test('plugins.renderNode renders settings when passed', () => {
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

		expect(QuestionBank.plugins.renderNode(props)).toMatchSnapshot()
	})

	test('plugins.getPasteNode returns qb', () => {
		const qb = {
			nodes: {
				size: 2
			}
		}

		expect(QuestionBank.getPasteNode(qb)).toEqual(qb)
	})

	test('plugins.getPasteNode returns question', () => {
		const question = { 'type': QUESTION_NODE }
		const qb = {
			nodes: {
				size: 1,
				get: () => question
			}
		}
		Common.Registry.getItemForType.mockReturnValueOnce({ getPasteNode: node => node })

		expect(QuestionBank.getPasteNode(qb)).toEqual(question)
	})

	test('plugins.getPasteNode returns text from settings', () => {
		const qb = {
			nodes: {
				size: 1,
				get: () => ({
					nodes: [
						{
							nodes: [
								{
									toJSON:() => ({ object: 'block', type: 'mockNode' })
								}
							]
						}
					]
				})
			}
		}

		expect(QuestionBank.getPasteNode(qb)).toMatchSnapshot()
	})
})
