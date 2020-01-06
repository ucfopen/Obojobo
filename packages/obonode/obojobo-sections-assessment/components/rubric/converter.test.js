/* eslint-disable no-undefined */

import Converter from './converter'

describe('Assessment Converter', () => {
	test('slateToObo converts a Slate node to an OboNode without set values', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => ({
					passedType: '$attempt_score',
					failedType: '$attempt_score',
					unableToPassType: 'no-value',
					mods: []
				})
			}
		}

		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchInlineSnapshot(`
		Object {
		  "failedResult": "$attempt_score",
		  "passedResult": "$attempt_score",
		  "unableToPassResult": null,
		}
	`)
	})

	test('slateToObo converts a Slate node to an OboNode with set values', () => {
		const slateNode = {
			key: 'mockKey',
			type: 'mockType',
			data: {
				get: () => ({
					passedType: 'set-value',
					passedResult: '100',
					failedType: 'set-value',
					failedResult: '100',
					unableToPassType: 'set-value',
					unableToPassResult: '100'
				})
			}
		}

		const oboNode = Converter.slateToObo(slateNode)

		expect(oboNode).toMatchInlineSnapshot(`
		Object {
		  "failedResult": "100",
		  "passedResult": "100",
		  "unableToPassResult": "100",
		}
	`)
	})

	test('oboToSlate converts an OboComponent to a Slate node with special types', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: '$attempt_score',
			failedResult: '$attempt_score',
			unableToPassResult: '$highest_attempt_score',
			mods: []
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node with no-scores', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: '$attempt_score',
			failedResult: 'no-score',
			unableToPassResult: 'no-score'
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node with no unableToPassResult', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: '$attempt_score',
			failedResult: 'no_score',
			unableToPassResult: null
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node with no unableToPassResult', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: '$attempt_score',
			failedResult: 'no_score',
			unableToPassResult: undefined
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})

	test('oboToSlate converts an OboComponent to a Slate node with numerical values', () => {
		const oboNode = {
			passingAttemptScore: 0,
			passedResult: 100,
			failedResult: 100,
			unableToPassResult: 100
		}
		const slateNode = Converter.oboToSlate(oboNode)

		expect(slateNode).toMatchSnapshot()
	})
})
