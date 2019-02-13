import React from 'react'
import renderer from 'react-test-renderer'
import MCAssessmentResults from '../../../../ObojoboDraft/Chunks/MCAssessment/mc-assessment-results'

describe('MCAssessmentResults', () => {
	test('MCAssessmentResults renders with score=0, isTypePickAll=false, isForScreenReader=false', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={0}
				isTypePickAll={false}
				isForScreenReader={false}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=50, isTypePickAll=false, isForScreenReader=false', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={50}
				isTypePickAll={false}
				isForScreenReader={false}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=100, isTypePickAll=false, isForScreenReader=false', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={100}
				isTypePickAll={false}
				isForScreenReader={false}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=0, isTypePickAll=true, isForScreenReader=false', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={0}
				isTypePickAll={true}
				isForScreenReader={false}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=50, isTypePickAll=true, isForScreenReader=false', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={50}
				isTypePickAll={true}
				isForScreenReader={false}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=100, isTypePickAll=true, isForScreenReader=false', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={100}
				isTypePickAll={true}
				isForScreenReader={false}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=0, isTypePickAll=false, isForScreenReader=true', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={0}
				isTypePickAll={false}
				isForScreenReader={true}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=50, isTypePickAll=false, isForScreenReader=true', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={50}
				isTypePickAll={false}
				isForScreenReader={true}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=100, isTypePickAll=false, isForScreenReader=true', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={100}
				isTypePickAll={false}
				isForScreenReader={true}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=0, isTypePickAll=true, isForScreenReader=true', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={0}
				isTypePickAll={true}
				isForScreenReader={true}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=50, isTypePickAll=false, isForScreenReader=true', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={50}
				isTypePickAll={true}
				isForScreenReader={true}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentResults renders with score=100, isTypePickAll=false, isForScreenReader=true', () => {
		const component = renderer.create(
			<MCAssessmentResults
				correctLabel="correct-label"
				incorrectLabel="incorrect-label"
				pickAllIncorrectMessage="message"
				score={100}
				isTypePickAll={true}
				isForScreenReader={true}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})
})
