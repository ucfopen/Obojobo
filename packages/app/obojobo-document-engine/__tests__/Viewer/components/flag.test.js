import React from 'react'
import renderer from 'react-test-renderer'
import Flag from '../../../src/scripts/viewer/components/flag'

describe('Flag', () => {
	test('Renders CHOSEN_CORRECTLY', () => {
		const component = renderer.create(<Flag type={Flag.CHOSEN_CORRECTLY} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders CHOSEN_SURVEY', () => {
		const component = renderer.create(<Flag type={Flag.CHOSEN_SURVEY} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders SHOULD_NOT_HAVE_CHOSEN', () => {
		const component = renderer.create(<Flag type={Flag.SHOULD_NOT_HAVE_CHOSEN} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders COULD_HAVE_CHOSEN', () => {
		const component = renderer.create(<Flag type={Flag.COULD_HAVE_CHOSEN} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders SHOULD_HAVE_CHOSEN', () => {
		const component = renderer.create(<Flag type={Flag.SHOULD_HAVE_CHOSEN} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders UNCHOSEN_CORRECTLY', () => {
		const component = renderer.create(<Flag type={Flag.UNCHOSEN_CORRECTLY} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('Renders unexpected flag value', () => {
		const component = renderer.create(<Flag type={'someInvalidType'} />)
		const tree = component.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test.each`
		isUserCorrect | isACorrectChoice | isSelected | isASurveyQuestion | expected
		${false}      | ${false}         | ${false}   | ${false}          | ${'unchosen-correctly'}
		${false}      | ${false}         | ${false}   | ${true}           | ${'unchosen-correctly'}
		${false}      | ${false}         | ${true}    | ${false}          | ${'should-not-have-chosen'}
		${false}      | ${false}         | ${true}    | ${true}           | ${'chosen-survey'}
		${false}      | ${true}          | ${false}   | ${false}          | ${'should-have-chosen'}
		${false}      | ${true}          | ${false}   | ${true}           | ${'unchosen-correctly'}
		${false}      | ${true}          | ${true}    | ${false}          | ${'chosen-correctly'}
		${false}      | ${true}          | ${true}    | ${true}           | ${'chosen-survey'}
		${true}       | ${false}         | ${false}   | ${false}          | ${'unchosen-correctly'}
		${true}       | ${false}         | ${false}   | ${true}           | ${'unchosen-correctly'}
		${true}       | ${false}         | ${true}    | ${false}          | ${'should-not-have-chosen'}
		${true}       | ${false}         | ${true}    | ${true}           | ${'chosen-survey'}
		${true}       | ${true}          | ${false}   | ${false}          | ${'could-have-chosen'}
		${true}       | ${true}          | ${false}   | ${true}           | ${'unchosen-correctly'}
		${true}       | ${true}          | ${true}    | ${false}          | ${'chosen-correctly'}
		${true}       | ${true}          | ${true}    | ${true}           | ${'chosen-survey'}
	`(
		'Flag.getType($isUserCorrect, $isACorrectChoice, $isSelected, $isASurveyQuestion) = "$expected"',
		({ isUserCorrect, isACorrectChoice, isSelected, isASurveyQuestion, expected }) => {
			expect(Flag.getType(isUserCorrect, isACorrectChoice, isSelected, isASurveyQuestion)).toBe(
				expected
			)
		}
	)
})
