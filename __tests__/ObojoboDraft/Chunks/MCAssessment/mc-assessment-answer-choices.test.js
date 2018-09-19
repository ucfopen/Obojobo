import React from 'react'
import renderer from 'react-test-renderer'
import MCAssessmentAnswerChoices from '../../../../ObojoboDraft/Chunks/MCAssessment/mc-assessment-answer-choices'
import focus from '../../../../src/scripts/common/page/focus'

jest.mock('../../../../src/scripts/common/page/focus')

describe('MCAssessmentAnswerChoices', () => {
	const MockReactComponent = () => <div />

	test('MCAssessmentAnswerChoices renders', () => {
		const component = renderer.create(
			<MCAssessmentAnswerChoices
				models={[
					{
						getComponentClass: () => MockReactComponent,
						get: () => 1
					},
					{
						getComponentClass: () => MockReactComponent,
						get: () => 2
					}
				]}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentAnswerChoices renders for score = null', () => {
		const component = renderer.create(
			<MCAssessmentAnswerChoices
				score={null}
				models={[
					{
						getComponentClass: () => MockReactComponent,
						get: () => 1
					},
					{
						getComponentClass: () => MockReactComponent,
						get: () => 2
					}
				]}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentAnswerChoices renders for type = "pick-all"', () => {
		const component = renderer.create(
			<MCAssessmentAnswerChoices
				responseType="pick-all"
				models={[
					{
						getComponentClass: () => MockReactComponent,
						get: () => 1
					},
					{
						getComponentClass: () => MockReactComponent,
						get: () => 2
					}
				]}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('focusOnResults calls focus', () => {
		const component = renderer.create(<MCAssessmentAnswerChoices models={[]} />)

		component.getInstance().focusOnResults()

		expect(focus).toHaveBeenCalledWith(component.getInstance().refs.results)
	})
})
