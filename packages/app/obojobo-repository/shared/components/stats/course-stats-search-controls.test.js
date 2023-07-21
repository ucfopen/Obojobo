import React from 'react'
import { create, act } from 'react-test-renderer'
import CourseStatsSearchControls from './course-stats-search-controls'

const SEARCH_INPUT_DEBOUNCE_MS = 500
const RESOURCE_LINK_TITLE = 'resource-link-title'
const USER_FIRST_NAME = 'user-first-name'
const USER_LAST_NAME = 'user-last-name'

describe('CourseStatsSearchControls', () => {
	const standardProps = {
		searchSettings: '',
		onChangeSearchSettings: jest.fn(),
		onChangeSearchContent: jest.fn()
	}

	beforeEach(() => {
		jest.resetAllMocks()
	})

	test('search controls element renders properly', () => {
		const component = create(<CourseStatsSearchControls {...standardProps} />)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('selecting a search mode calls the onChangeSearchSettings function', () => {
		const component = create(<CourseStatsSearchControls {...standardProps} />)

		const selectField = component.root.findByType('select')
		act(() => {
			selectField.props.onChange({ target: { value: RESOURCE_LINK_TITLE } })
			selectField.props.onChange({ target: { value: USER_FIRST_NAME } })
			selectField.props.onChange({ target: { value: USER_LAST_NAME } })
		})
		expect(standardProps.onChangeSearchSettings).toHaveBeenCalledTimes(3)
	})

	test('changing the search text DOES NOT immediately call onChangeSearchContent (debounces)', async () => {
		const component = create(
			<CourseStatsSearchControls {...standardProps} searchSettings={RESOURCE_LINK_TITLE} />
		)

		jest.useFakeTimers()
		jest.spyOn(global, 'setTimeout')

		const textField = component.root.findAllByType('input')[0]
		act(() => {
			textField.props.onChange({ target: { value: 'mock-search-content' } })
		})
		expect(setTimeout).toHaveBeenCalledTimes(1)
		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), SEARCH_INPUT_DEBOUNCE_MS)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(0)

		jest.runAllTimers()
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(1)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: 'mock-search-content',
			date: { end: '', start: '' }
		})
	})

	test('changing the search text DOES call onChangeSearchContent (debounce off)', () => {
		const component = create(
			<CourseStatsSearchControls
				{...standardProps}
				searchSettings={RESOURCE_LINK_TITLE}
				debounceSearch={false}
			/>
		)

		const textField = component.root.findAllByType('input')[0]
		expect(textField.props.className).toBe('text-input')
		act(() => {
			textField.props.onChange({ target: { value: 'mock-search-content' } })
		})
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(1)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: 'mock-search-content',
			date: { end: '', start: '' }
		})
		expect(textField.props.className).toBe('text-input filter-active')

		act(() => {
			textField.props.onChange({ target: { value: '' } })
		})
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(2)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: '',
			date: { end: '', start: '' }
		})
		expect(textField.props.className).toBe('text-input')
	})

	test('multiple quick searches resets the debounce timer', () => {
		const component = create(
			<CourseStatsSearchControls {...standardProps} searchSettings={RESOURCE_LINK_TITLE} />
		)

		const textField = component.root.findAllByType('input')[0]
		expect(textField.props.className).toBe('text-input')
		act(() => {
			textField.props.onChange({ target: { value: 'mock-search-content' } })
			textField.props.onChange({ target: { value: '' } })
		})
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(1)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: '',
			date: { end: '', start: '' }
		})
		expect(textField.props.className).toBe('text-input')
	})

	test("clicking the text input's clear filter button clears text search (debounce off)", () => {
		const component = create(
			<CourseStatsSearchControls
				{...standardProps}
				searchSettings={RESOURCE_LINK_TITLE}
				debounceSearch={false}
			/>
		)

		const mockClick = {
			preventDefault: jest.fn()
		}

		const textField = component.root.findAllByType('input')[0]
		const textClearButton = component.root
			.findByProps({ className: 'search-by-text' })
			.findByType('button')

		// Puts something in the text field and verifies that it's active/highlighted
		act(() => {
			textField.props.onChange({ target: { value: 'mock-search-content' } })
		})
		expect(textField.props.className).toBe('text-input filter-active')
		expect(textClearButton.props.disabled).toBe(false)

		// Clicks the clear button, then verifies that the field is no longer active/highlighted

		act(() => {
			textClearButton.props.onClick(mockClick)
		})
		expect(textField.props.className).toBe('text-input')
		expect(textClearButton.props.disabled).toBe(true)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(2)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: '',
			date: { end: '', start: '' }
		})
	})

	test('changing the start date and clearing the start date both call onChangeSearchContent', () => {
		const component = create(
			<CourseStatsSearchControls {...standardProps} searchSettings={RESOURCE_LINK_TITLE} />
		)

		const mockClick = {
			preventDefault: jest.fn()
		}

		const startDateField = component.root
			.findByProps({ className: 'search-by-date' })
			.findAllByType('input')[0]
		const startDateClearButton = component.root
			.findByProps({ className: 'search-by-date' })
			.findAllByType('button')[0]

		// Adding a start date calls onChangeSearchContent
		expect(startDateClearButton.props.disabled).toBe(true)
		act(() => {
			startDateField.props.onChange({ target: { value: 'mock-start-date' } })
		})
		expect(startDateClearButton.props.disabled).toBe(false)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(1)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: '',
			date: { end: '', start: 'mock-start-date' }
		})

		// Clicking the clear button calls onChangeSearchContent
		act(() => {
			startDateClearButton.props.onClick(mockClick)
		})
		expect(startDateClearButton.props.disabled).toBe(true)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(2)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: '',
			date: { end: '', start: '' }
		})
	})

	test('changing the end date and clearing the end date both call onChangeSearchContent', () => {
		const component = create(
			<CourseStatsSearchControls {...standardProps} searchSettings={RESOURCE_LINK_TITLE} />
		)

		const mockClick = {
			preventDefault: jest.fn()
		}

		const endDateField = component.root
			.findByProps({ className: 'search-by-date' })
			.findAllByType('input')[1]
		const endDateClearButton = component.root
			.findByProps({ className: 'search-by-date' })
			.findAllByType('button')[1]

		// Adding a start date calls onChangeSearchContent
		expect(endDateClearButton.props.disabled).toBe(true)
		act(() => {
			endDateField.props.onChange({ target: { value: 'mock-end-date' } })
		})
		expect(endDateClearButton.props.disabled).toBe(false)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(1)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: '',
			date: { end: 'mock-end-date', start: '' }
		})

		// Clicking the clear button calls onChangeSearchContent
		act(() => {
			endDateClearButton.props.onClick(mockClick)
		})
		expect(endDateClearButton.props.disabled).toBe(true)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledTimes(2)
		expect(standardProps.onChangeSearchContent).toHaveBeenCalledWith({
			text: '',
			date: { end: '', start: '' }
		})
	})
})
