import React from 'react'
import renderer from 'react-test-renderer'
import AssessmentScoreDataDialog from './assessment-score-data-dialog'

jest.mock('react-data-table-component', () => ({
	default: props => (
		<div {...props} className="react-data-table-component">
			react-data-table-component
		</div>
	)
}))

describe('AssessmentScoreDataDialog', () => {
	const getTestProps = () => ({
		draftId: 'mock-draft-id',
		title: 'mock-title',
		onClose: jest.fn(),
		isHistoryLoading: true,
		attempts: []
	})

	test('AssessmentScoreDataDialog renders correctly when history is loading', () => {
		const component = renderer.create(<AssessmentScoreDataDialog {...getTestProps()} />)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreDataDialog renders correctly when no attempt data', () => {
		const component = renderer.create(
			<AssessmentScoreDataDialog {...getTestProps()} isHistoryLoading={false} />
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('AssessmentScoreDataDialog renders correctly with attempts', () => {
		const component = renderer.create(
			<AssessmentScoreDataDialog
				{...getTestProps()}
				isHistoryLoading={false}
				attempts={[{ attemptId: 'mock-id' }]}
			/>
		)

		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Clicking the close button calls onClose', () => {
		const onClose = jest.fn()
		const component = renderer.create(
			<AssessmentScoreDataDialog {...getTestProps()} onClose={onClose} />
		)

		expect(onClose).not.toHaveBeenCalled()
		component.root
			.findByProps({ className: 'close-button' })
			.props.onClick({ target: 'mock-target' })
		expect(onClose).toHaveBeenCalledWith({ target: 'mock-target' })
	})
})
