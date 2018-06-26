import React from 'react'
import renderer from 'react-test-renderer'

import ScoreAction from '../../../../../ObojoboDraft/Sections/Assessment/post-assessment/score-actions'

describe('score-actions', () => {
	test('constructor builds with no attributes', () => {
		let action = new ScoreAction(null)

		expect(action).toEqual({
			actions: [],
			originalActions: null
		})
	})

	test('constructor builds with legacy attributes', () => {
		let action = new ScoreAction([
			{
				from: '0',
				to: '100',
				page: 'mockPage'
			}
		])

		expect(action).toEqual({
			actions: [
				{
					page: 'mockPage',
					range: {
						isMaxInclusive: true,
						isMinInclusive: true,
						max: '100',
						min: '0'
					}
				}
			],
			originalActions: [{ from: '0', page: 'mockPage', to: '100' }]
		})
	})

	test('constructor builds with current attributes', () => {
		let action = new ScoreAction([
			{
				for: '[0,100]',
				page: 'mockPage'
			}
		])

		expect(action).toEqual({
			actions: [
				{
					page: 'mockPage',
					range: {
						isMaxInclusive: true,
						isMinInclusive: true,
						max: '100',
						min: '0'
					}
				}
			],
			originalActions: [{ for: '[0,100]', page: 'mockPage' }]
		})
	})

	test('getActionForScore returns action that matches the score', () => {
		let action = new ScoreAction([
			{
				for: '[90,100]',
				page: 'mockPage'
			},
			{
				for: '[0,90)',
				page: 'mockPage'
			}
		])

		let foundAction = action.getActionForScore(80)

		expect(foundAction).toEqual({
			page: 'mockPage',
			range: {
				isMaxInclusive: false,
				isMinInclusive: true,
				max: '90',
				min: '0'
			}
		})
	})

	test('getActionForScore returns null when no action matches the score', () => {
		let action = new ScoreAction([
			{
				for: '[0,90)',
				page: 'mockPage'
			}
		])

		let foundAction = action.getActionForScore(91)

		expect(foundAction).toEqual(null)
	})

	test('toObject builds an object representation', () => {
		let action = new ScoreAction([
			{
				for: '[0,90)',
				page: 'mockPage'
			}
		])

		let obj = action.toObject()

		expect(obj).toEqual([{ for: '[0,90)', page: 'mockPage' }])
	})

	test('clone creates a copy', () => {
		let action = new ScoreAction([
			{
				for: '[0,90)',
				page: 'mockPage'
			}
		])

		let clone = action.clone()

		expect(clone).not.toBe(action)
		expect(clone).toEqual(action)
	})
})
