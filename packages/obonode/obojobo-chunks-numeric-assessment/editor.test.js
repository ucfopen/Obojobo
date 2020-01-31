import SchemaViolations from 'obojobo-document-engine/src/scripts/oboeditor/util/schema-violations'
const { CHILD_MIN_INVALID, CHILD_TYPE_INVALID } = SchemaViolations

import NumericAssessment from './editor'

import {
	NUMERIC_ASSESSMENT_NODE,
	NUMERIC_CHOICE_NODE,
	NUMERIC_ANSWER_NODE,
	NUMERIC_FEEDBACK_NODE
} from './constants'

describe('NumericAssessment editor', () => {
	test('plugins.renderNode calls next', () => {
		const props = {
			node: {
				attributes: { dummy: 'dummyData' },
				type: 'mockNode',
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		const next = jest.fn()

		expect(NumericAssessment.plugins.renderNode(props, null, next)).toMatchSnapshot()
		expect(next).toHaveBeenCalled()
	})

	test(`plugins.renderNode renders a ${NUMERIC_ANSWER_NODE} when passed`, () => {
		const props = {
			attributes: { dummy: 'some_attributes' },
			node: {
				type: NUMERIC_ANSWER_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(NumericAssessment.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test(`plugins.renderNode renders a ${NUMERIC_CHOICE_NODE} when passed`, () => {
		const props = {
			attributes: { dummy: 'some_attributes' },
			node: {
				type: NUMERIC_CHOICE_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(NumericAssessment.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test(`plugins.schema.normalize fixes invalid children for ${NUMERIC_CHOICE_NODE}`, () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_CHOICE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize adds required first child in ${NUMERIC_CHOICE_NODE}`, () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_CHOICE_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: {},
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize fixes invalid children for ${NUMERIC_CHOICE_NODE}`, () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_CHOICE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', type: NUMERIC_FEEDBACK_NODE },
			index: 1
		})

		expect(editor.wrapBlockByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize fixes too many children for ${NUMERIC_CHOICE_NODE}`, () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_CHOICE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 3
		})

		expect(editor.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test(`plugins.schema.normalize fixes extra children for ${NUMERIC_CHOICE_NODE}`, () => {
		const editor = {
			wrapBlockByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_CHOICE_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey', type: 'wrongType' },
			index: 1
		})

		expect(editor.wrapBlockByKey).not.toHaveBeenCalled()
	})

	test(`plugins.renderNode renders a ${NUMERIC_ASSESSMENT_NODE} when passed`, () => {
		const props = {
			attributes: { dummy: 'some_attributes' },
			node: {
				type: NUMERIC_ASSESSMENT_NODE,
				data: {
					get: () => {
						return {}
					}
				}
			}
		}

		expect(NumericAssessment.plugins.renderNode(props, null, jest.fn())).toMatchSnapshot()
	})

	test(`plugins.schema.normalize fixes invalid first child in ${NUMERIC_ASSESSMENT_NODE}`, () => {
		const editor = {
			withoutNormalizing: funct => funct(editor),
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 0
		})

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize fixes invalid second child in ${NUMERIC_ASSESSMENT_NODE}`, () => {
		const editor = {
			withoutNormalizing: funct => funct(editor),
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: 1
		})

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize adds required first child in ${NUMERIC_ASSESSMENT_NODE}`, () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize adds required first child in ${NUMERIC_ASSESSMENT_NODE}`, () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: {},
			child: null,
			index: 1
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize fixes invalid children in ${NUMERIC_ASSESSMENT_NODE}`, () => {
		const editor = {
			withoutNormalizing: funct => funct(editor),
			removeNodeByKey: jest.fn(),
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_TYPE_INVALID,
			node: {},
			child: { key: 'mockKey' },
			index: null
		})

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test(`plugins.schema.normalize adds required children in ${NUMERIC_ASSESSMENT_NODE}`, () => {
		const editor = {
			insertNodeByKey: jest.fn()
		}

		NumericAssessment.plugins.schema.blocks[NUMERIC_ASSESSMENT_NODE].normalize(editor, {
			code: CHILD_MIN_INVALID,
			node: {},
			child: null,
			index: 0
		})

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})
})
