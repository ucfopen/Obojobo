import React from 'react'
import renderer, { act } from 'react-test-renderer'
import Button from '../button'
import AssessmentStatsSearchControls from './assessment-stats-search-controls'

jest.mock('obojobo-document-engine/src/scripts/common/util/debounce', () => (ms, fn) => fn)

describe('AssessmentStatsSearchControls', () => {
	test('AssessmentStatsSearchControls renders correctly', () => {})

	test('Inputs and select tags work as expected', () => {
		const onChangeSearchSettings = jest.fn()
		const onChangeSearchContent = jest.fn()

		const component = renderer.create(
			<AssessmentStatsSearchControls
				filterSettings={{
					showIncompleteAttempts: false,
					showPreviewAttempts: false,
					showAdvancedFields: false
				}}
				onChangeSearchSettings={onChangeSearchSettings}
				onChangeSearchContent={onChangeSearchContent}
			/>
		)

		const select = component.root.findByProps({
			id: 'repository--assessment-stats-search-controls--search-by'
		})

		expect(onChangeSearchSettings).not.toHaveBeenCalled()
		expect(onChangeSearchContent).not.toHaveBeenCalled()

		// Change select option
		act(() => {
			select.props.onChange({ target: { value: 'user-first-name' } })
		})
		expect(onChangeSearchSettings).toHaveBeenCalledTimes(1)

		// Change input based on select option
		const textInput = component.root.findByProps({ type: 'text' })
		act(() => {
			textInput.props.onChange({ target: { value: 'test' } })
		})
		act(() => {
			textInput.props.onChange({ target: { value: '' } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(2)

		// Change date inputs
		let dateStart = component.root.findAllByProps({ type: 'date' })[0]
		act(() => {
			dateStart.props.onChange({ target: { value: new Date() } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(3)

		// Clear date input
		dateStart = component.root.findAllByProps({ type: 'date' })[0]
		act(() => {
			dateStart.props.onChange({ target: { value: new Date() } })
		})
		expect(dateStart.props.value).not.toBe('')
		act(() => {
			component.root.findAllByType(Button)[0].props.onClick()
		})
		expect(dateStart.props.value).toBe('')
		expect(onChangeSearchContent).toHaveBeenCalledTimes(4)

		let dateEnd = component.root.findAllByProps({ type: 'date' })[1]
		act(() => {
			dateEnd.props.onChange({ target: { value: new Date() } })
		})
		expect(onChangeSearchContent).toHaveBeenCalledTimes(5)

		dateEnd = component.root.findAllByProps({ type: 'date' })[1]
		act(() => {
			dateEnd.props.onChange({ target: { value: new Date() } })
		})
		expect(dateEnd.props.value).not.toBe('')
		act(() => {
			component.root.findAllByType(Button)[1].props.onClick()
		})
		expect(dateEnd.props.value).toBe('')
		expect(onChangeSearchContent).toHaveBeenCalledTimes(6)
	})
})
