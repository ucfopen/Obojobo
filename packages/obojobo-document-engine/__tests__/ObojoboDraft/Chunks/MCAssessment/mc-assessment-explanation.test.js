import React from 'react'
import renderer from 'react-test-renderer'
import MCAssessmentExplanation from '../../../../ObojoboDraft/Chunks/MCAssessment/mc-assessment-explanation'
import focus from '../../../../src/scripts/common/page/focus'

jest.mock('../../../../src/scripts/common/page/focus')

describe('MCAssessmentExplanation', () => {
	const MockComponent = () => <div>Mock Component</div>

	test('MCAssessmentExplanation renders with isShowingExplanation=false', () => {
		const component = renderer.create(
			<MCAssessmentExplanation
				animationTransitionTime={1000}
				isShowingExplanation={false}
				solutionModel={{
					getComponentClass: () => MockComponent
				}}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentExplanation renders with isShowingExplanation=true', () => {
		const component = renderer.create(
			<MCAssessmentExplanation
				animationTransitionTime={1000}
				isShowingExplanation={true}
				solutionModel={{
					getComponentClass: () => MockComponent
				}}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})

	test('MCAssessmentExplanation focusOnExplanation focuses on the explanation', () => {
		const component = renderer.create(
			<MCAssessmentExplanation
				animationTransitionTime={1000}
				isShowingExplanation={true}
				solutionModel={{
					getComponentClass: () => MockComponent
				}}
			/>
		)

		component.getInstance().focusOnExplanation()
		expect(focus).toHaveBeenCalledWith(component.getInstance().refSolutionContainer)
	})
})
