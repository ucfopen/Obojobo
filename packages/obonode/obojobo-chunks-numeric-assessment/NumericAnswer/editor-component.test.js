/* eslint-disable no-undefined */

import React from 'react'
import renderer from 'react-test-renderer'

import NumericAnswer from './editor-component'
import { Transforms } from 'slate'

jest.mock('slate-react', () => ({
	ReactEditor: { findPath: jest.fn().mockReturnValue('mock-path') }
}))
jest.mock('slate', () => ({
	Editor: {
		withoutNormalizing: (editor, cb) => {
			cb()
		},
		nodes: jest.fn()
	},
	Transforms: {
		setNodes: jest.fn()
	}
}))

jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/with-slate-wrapper',
	() => item => item
)
jest.mock(
	'obojobo-document-engine/src/scripts/oboeditor/components/node/editor-component',
	() => props => <div>{props.children}</div>
)
jest.mock('obojobo-document-engine/src/scripts/common/util/debounce', () => (ms, fn) => fn)

jest.useFakeTimers()

describe('NumericAnswer Editor Node', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	test.each`
		requirement | type          | answer       | margin  | start         | end
		${'exact'}  | ${null}       | ${'1'}       | ${null} | ${null}       | ${null}
		${'exact'}  | ${null}       | ${'1/2'}     | ${null} | ${null}       | ${null}
		${'exact'}  | ${null}       | ${'0.5'}     | ${null} | ${null}       | ${null}
		${'exact'}  | ${null}       | ${'1.23e14'} | ${null} | ${null}       | ${null}
		${'exact'}  | ${null}       | ${'0xFF'}    | ${null} | ${null}       | ${null}
		${'exact'}  | ${null}       | ${'0o77'}    | ${null} | ${null}       | ${null}
		${'exact'}  | ${null}       | ${'0b1101'}  | ${null} | ${null}       | ${null}
		${'margin'} | ${'percent'}  | ${'1'}       | ${5}    | ${null}       | ${null}
		${'margin'} | ${'percent'}  | ${'1/2'}     | ${5}    | ${null}       | ${null}
		${'margin'} | ${'percent'}  | ${'0.5'}     | ${5}    | ${null}       | ${null}
		${'margin'} | ${'percent'}  | ${'1.23e14'} | ${5}    | ${null}       | ${null}
		${'margin'} | ${'percent'}  | ${'0xFF'}    | ${5}    | ${null}       | ${null}
		${'margin'} | ${'percent'}  | ${'0o77'}    | ${5}    | ${null}       | ${null}
		${'margin'} | ${'percent'}  | ${'0b1101'}  | ${5}    | ${null}       | ${null}
		${'margin'} | ${'absolute'} | ${'1'}       | ${5}    | ${null}       | ${null}
		${'margin'} | ${'absolute'} | ${'1/2'}     | ${5}    | ${null}       | ${null}
		${'margin'} | ${'absolute'} | ${'0.5'}     | ${5}    | ${null}       | ${null}
		${'margin'} | ${'absolute'} | ${'1.23e14'} | ${5}    | ${null}       | ${null}
		${'margin'} | ${'absolute'} | ${'0xFF'}    | ${5}    | ${null}       | ${null}
		${'margin'} | ${'absolute'} | ${'0o77'}    | ${5}    | ${null}       | ${null}
		${'margin'} | ${'absolute'} | ${'0b1101'}  | ${5}    | ${null}       | ${null}
		${'range'}  | ${null}       | ${null}      | ${null} | ${'-1'}       | ${'1'}
		${'range'}  | ${null}       | ${null}      | ${null} | ${'-1/2'}     | ${'1/2'}
		${'range'}  | ${null}       | ${null}      | ${null} | ${'-0.5'}     | ${'0.5'}
		${'range'}  | ${null}       | ${null}      | ${null} | ${'-1.23e14'} | ${'1.23e14'}
		${'range'}  | ${null}       | ${null}      | ${null} | ${'0x1'}      | ${'0xFF'}
		${'range'}  | ${null}       | ${null}      | ${null} | ${'0o1'}      | ${'0o77'}
		${'range'}  | ${null}       | ${null}      | ${null} | ${'0b1'}      | ${'0b1101'}
	`(
		'NumericAnswer (requirement="$requirement",type="$type",answer="$answer",margin="$margin",start="$start",end="$end") matches snapshot',
		({ requirement, type, answer, margin, start, end }) => {
			const props = {
				editor: {},
				element: {
					content: {
						requirement,
						type,
						answer,
						margin,
						start,
						end
					}
				}
			}
			const component = renderer.create(<NumericAnswer {...props} />)
			const tree = component.toJSON()
			expect(tree).toMatchSnapshot()
		}
	)

	test('onHandleInputChange updates state, updates node from state', () => {
		const event = {
			preventDefault: jest.fn(),
			stopPropagation: jest.fn(),
			target: {
				name: 'mockName',
				value: 'mockValue'
			}
		}
		const thisValue = {
			state: {},
			setState: jest.fn(),
			updateNodeFromState: jest.fn()
		}

		NumericAnswer.prototype.onHandleInputChange.bind(thisValue)(event)

		expect(event.preventDefault).toBeCalled()
		expect(event.stopPropagation).toBeCalled()
		expect(thisValue.setState).toBeCalledWith({ ...thisValue.state, mockName: 'mockValue' })
		expect(thisValue.updateNodeFromState).toBeCalled()
	})

	test('getAnswerFromState returns the expected value', () => {
		expect(NumericAnswer.prototype.getAnswerFromState({})).toBe('1')
		expect(NumericAnswer.prototype.getAnswerFromState({ answer: '2' })).toBe('2')
		expect(NumericAnswer.prototype.getAnswerFromState({ start: '3' })).toBe('3')
		expect(NumericAnswer.prototype.getAnswerFromState({ answer: '2', start: '3' })).toBe('2')
		expect(NumericAnswer.prototype.getAnswerFromState({ answer: null, start: null })).toBe('1')
		expect(NumericAnswer.prototype.getAnswerFromState({ answer: '2', start: null })).toBe('2')
		expect(NumericAnswer.prototype.getAnswerFromState({ start: '3', answer: null })).toBe('3')
	})

	test.each`
		requirement | newRequirement       | type          | answer  | margin  | start   | end     | expectedState
		${'exact'}  | ${'Margin of error'} | ${null}       | ${'1'}  | ${null} | ${null} | ${null} | ${{ requirement: 'margin', type: 'percent', margin: '0', answer: '1', start: undefined, end: undefined }}
		${'exact'}  | ${'Within a range'}  | ${null}       | ${'1'}  | ${null} | ${null} | ${null} | ${{ requirement: 'range', start: '1', end: '1', answer: undefined, type: undefined, margin: undefined }}
		${'margin'} | ${'Within a range'}  | ${'percent'}  | ${'2'}  | ${5}    | ${null} | ${null} | ${{ requirement: 'range', start: '2', end: '2', answer: undefined, type: undefined, margin: undefined }}
		${'margin'} | ${'Exact answer'}    | ${'percent'}  | ${'2'}  | ${5}    | ${null} | ${null} | ${{ requirement: 'exact', answer: '2', start: undefined, end: undefined, type: undefined, margin: undefined }}
		${'margin'} | ${'Within a range'}  | ${'absolute'} | ${'2'}  | ${5}    | ${null} | ${null} | ${{ requirement: 'range', start: '2', end: '2', answer: undefined, type: undefined, margin: undefined }}
		${'margin'} | ${'Exact answer'}    | ${'absolute'} | ${'2'}  | ${5}    | ${null} | ${null} | ${{ requirement: 'exact', answer: '2', start: undefined, end: undefined, type: undefined, margin: undefined }}
		${'range'}  | ${'Exact answer'}    | ${null}       | ${null} | ${null} | ${'-3'} | ${'3'}  | ${{ requirement: 'exact', answer: '-3', start: undefined, end: undefined, type: undefined, margin: undefined }}
		${'range'}  | ${'Margin of error'} | ${null}       | ${null} | ${null} | ${'-3'} | ${'3'}  | ${{ requirement: 'margin', type: 'percent', margin: '0', answer: '-3', start: undefined, end: undefined }}
	`(
		'getStateForRequirement $requirement->$newRequirement (type="$type",answer="$answer",margin="$margin",start="$start",end="$end") returns expected value',
		({ requirement, newRequirement, type, answer, margin, start, end, expectedState }) => {
			const props = {
				editor: {},
				element: {
					content: {
						requirement,
						type,
						answer,
						margin,
						start,
						end
					}
				}
			}
			const component = renderer.create(<NumericAnswer {...props} />)

			expect(component.getInstance().getStateForRequirement(newRequirement)).toEqual(expectedState)
		}
	)

	test('onHandleSelectChange updates state to expected values', () => {
		const event = {
			preventDefault: jest.fn(),
			stopPropagation: jest.fn()
		}
		const thisValue = {
			setState: jest.fn(),
			getStateForRequirement: jest.fn().mockImplementation(value => ({ mockState: value }))
		}

		event.target = {
			name: 'requirement',
			value: 'mockValue'
		}
		NumericAnswer.prototype.onHandleSelectChange.bind(thisValue)(event)

		expect(event.preventDefault).toBeCalled()
		expect(event.stopPropagation).toBeCalled()
		expect(thisValue.setState).toBeCalledWith({ mockState: 'mockValue' })

		event.target = {
			name: 'margin-type',
			value: 'Within a range'
		}
		NumericAnswer.prototype.onHandleSelectChange.bind(thisValue)(event)

		expect(event.preventDefault).toBeCalled()
		expect(event.stopPropagation).toBeCalled()
		expect(thisValue.setState).toBeCalledWith({ type: 'range' })
	})

	test('updateNodeFromState calls Transforms.setNodes and restores selection with document.activeElement, returns true if successful', () => {
		const props = {
			editor: {},
			element: {
				content: {}
			}
		}
		const component = renderer.create(<NumericAnswer {...props} />)
		const spy = jest.spyOn(NumericAnswer.prototype, 'restoreSelection')
		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		const mockEl = {
			selectionStart: 'mockSelStart',
			selectionEnd: 'mockSelEnd'
		}
		Object.defineProperty(document, 'activeElement', {
			value: mockEl,
			enumerable: true,
			configurable: true
		})

		expect(Transforms.setNodes).not.toHaveBeenCalled()
		expect(spy).not.toHaveBeenCalled()

		expect(component.getInstance().updateNodeFromState()).toBe(true)
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: {} },
			{ at: 'mock-path' }
		)
		expect(spy).toHaveBeenCalledWith(mockEl, mockEl.selectionStart, mockEl.selectionEnd)

		spy.mockRestore()
		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
	})

	test('updateNodeFromState calls Transforms.setNodes and restores selection without document.activeElement, returns true if successful', () => {
		const props = {
			editor: {},
			element: {
				content: {}
			}
		}
		const component = renderer.create(<NumericAnswer {...props} />)
		const spy = jest.spyOn(NumericAnswer.prototype, 'restoreSelection')
		// Mock document.activeElement:
		const origActiveElement = document.activeElement
		Object.defineProperty(document, 'activeElement', {
			value: null,
			enumerable: true,
			configurable: true
		})

		expect(Transforms.setNodes).not.toHaveBeenCalled()
		expect(spy).not.toHaveBeenCalled()

		expect(component.getInstance().updateNodeFromState()).toBe(true)
		expect(Transforms.setNodes).toHaveBeenCalledWith(
			props.editor,
			{ content: {} },
			{ at: 'mock-path' }
		)
		expect(spy).toHaveBeenCalledWith(null, null, null)

		spy.mockRestore()
		// Restore overrides:
		Object.defineProperty(document, 'activeElement', {
			value: origActiveElement
		})
	})

	test('updateNodeFromState returns false if an error is thrown', () => {
		const props = {
			editor: {},
			element: {
				content: {}
			}
		}
		const component = renderer.create(<NumericAnswer {...props} />)
		const spy = jest.spyOn(NumericAnswer.prototype, 'restoreSelection').mockImplementation(() => {
			throw 'Error'
		})

		expect(component.getInstance().updateNodeFromState()).toBe(false)

		spy.mockRestore()
	})

	test('restoreSelection returns false when element is falsy', () => {
		expect(NumericAnswer.prototype.restoreSelection(null)).toBe(false)
		expect(NumericAnswer.prototype.restoreSelection({})).toBe(false)
	})

	test('restoreSelection returns true and calls methods on element when given element', () => {
		const el = {
			select: jest.fn(),
			focus: jest.fn(),
			setSelectionRange: jest.fn()
		}
		expect(NumericAnswer.prototype.restoreSelection(el, 'mock-start', 'mock-end')).toBe(true)

		jest.runAllTimers()

		expect(el.focus).toHaveBeenCalled()
		expect(el.setSelectionRange).toHaveBeenCalledWith('mock-start', 'mock-end')
	})
})
