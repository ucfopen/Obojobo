import React from 'react'
import renderer from 'react-test-renderer'
import MCAssessmentExplanation from '../../../../ObojoboDraft/Chunks/MCAssessment/mc-assessment-results'

// has

describe('MCAssessmentExplanation', () => {
	test('MCAssessmentExplanation renders with isShowingExplanation=false', () => {
		const component = renderer.create(
			<MCAssessmentExplanation
				animationTransitionTime={1000}
				isShowingExplanation={false}
				solutionModel={{
					getComponentClass: () => jest.fn()
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
					getComponentClass: () => jest.fn()
				}}
			/>
		)

		expect(component.toJSON()).toMatchSnapshot()
	})
})
