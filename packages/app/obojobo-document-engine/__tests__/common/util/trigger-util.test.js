/* eslint-disable no-undefined */

import {
	addActionsToTriggers,
	hasTriggerTypeWithActionType,
	removeActionsFromTriggers
} from '../../../src/scripts/common/util/trigger-util'

describe('trigger-util', () => {
	describe('addActionsToTriggers', () => {
		test('adds action to trigger with existing actions (triggerMap uses object for action)', () => {
			const triggers = [{ type: 'someTrigger', actions: [{ type: 'actionType' }] }]
			const triggerMap = { someTrigger: { type: 'someOtherType' } }

			addActionsToTriggers(triggers, triggerMap)
			expect(triggers).toEqual([
				{ type: 'someTrigger', actions: [{ type: 'actionType' }, { type: 'someOtherType' }] }
			])
		})

		test('adds actions to trigger with existing actions (triggerMap uses array for actions)', () => {
			const triggers = [{ type: 'someTrigger', actions: [{ type: 'actionType' }] }]
			const triggerMap = { someTrigger: [{ type: 'someOtherType' }] }

			addActionsToTriggers(triggers, triggerMap)
			expect(triggers).toEqual([
				{ type: 'someTrigger', actions: [{ type: 'actionType' }, { type: 'someOtherType' }] }
			])
		})

		test('adds action to trigger without existing actions', () => {
			const triggers = [{ type: 'someTrigger' }]
			const triggerMap = { someTrigger: { type: 'someOtherType' } }

			addActionsToTriggers(triggers, triggerMap)
			expect(triggers).toEqual([{ type: 'someTrigger', actions: [{ type: 'someOtherType' }] }])
		})

		test('creates trigger when it does not exist and adds to triggers', () => {
			const triggers = [{ type: 'someNotUsedTrigger' }]
			const triggerMap = {
				someTrigger: { type: 'someActionType', value: 'someValue' }
			}

			addActionsToTriggers(triggers, triggerMap)
			expect(triggers).toEqual([
				{ type: 'someNotUsedTrigger' },
				{ type: 'someTrigger', actions: [{ type: 'someActionType', value: 'someValue' }] }
			])
		})

		test('creates trigger when it does not exists and adds to triggers (using array in trigger map)', () => {
			const triggers = []
			const triggerMap = {
				someTrigger: [{ type: 'someActionType', value: 'someValue' }]
			}

			addActionsToTriggers(triggers, triggerMap)
			expect(triggers).toEqual([
				{ type: 'someTrigger', actions: [{ type: 'someActionType', value: 'someValue' }] }
			])
		})
	})

	describe('hasTriggerTypeWithActionType', () => {
		test('returns false when triggers is undefined', () => {
			const result = hasTriggerTypeWithActionType(undefined, null, null)
			expect(result).toBe(false)
		})

		test('returns true when triggers has trigger type with action type', () => {
			const triggers = [{ type: 'someTriggerType', actions: [{ type: 'someActionType' }] }]
			const result = hasTriggerTypeWithActionType(triggers, 'someTriggerType', 'someActionType')
			expect(result).toBe(true)
		})

		test('returns false when triggers has trigger type with no action type', () => {
			const triggers = [{ type: 'someTriggerType' }]
			const result = hasTriggerTypeWithActionType(triggers, 'someTriggerType', 'someActionType')
			expect(result).toBe(false)
		})

		test('returns false when triggers does not have trigger type', () => {
			const triggers = [{ type: 'someOtherType' }]
			const result = hasTriggerTypeWithActionType(triggers, 'someTriggerType', 'someActionType')
			expect(result).toBe(false)
		})
	})

	describe('removeActionsFromTriggers', () => {
		test('does not affect triggers if triggers is undefined', () => {
			const triggers = undefined
			removeActionsFromTriggers(triggers, null)
			expect(triggers).toBe(undefined)
		})

		test('removes action from trigger (triggerMap uses string)', () => {
			const triggers = [
				{
					type: 'someTriggerType',
					actions: [{ type: 'someActionType' }, { type: 'someOtherType' }]
				},
				{ type: 'otherTrigger' }
			]
			const triggerMap = {
				someTriggerType: 'someActionType'
			}
			removeActionsFromTriggers(triggers, triggerMap)
			expect(triggers).toEqual([
				{ type: 'someTriggerType', actions: [{ type: 'someOtherType' }] },
				{ type: 'otherTrigger' }
			])
		})

		test('removes action from trigger (triggerMap uses array)', () => {
			const triggers = [
				{
					type: 'someTriggerType',
					actions: [{ type: 'someActionType' }, { type: 'someOtherType' }]
				},
				{ type: 'otherTrigger' }
			]
			const triggerMap = {
				someTriggerType: ['someActionType']
			}
			removeActionsFromTriggers(triggers, triggerMap)
			expect(triggers).toEqual([
				{ type: 'someTriggerType', actions: [{ type: 'someOtherType' }] },
				{ type: 'otherTrigger' }
			])
		})

		test('removes trigger that already has no actions', () => {
			const triggers = [{ type: 'triggerType' }]
			const triggerMap = {
				triggerType: 'someAction'
			}
			removeActionsFromTriggers(triggers, triggerMap)
			expect(triggers).toEqual([])
		})

		test('removes action from trigger and then removes trigger with empty actions array', () => {
			const triggers = [{ type: 'someTriggerType', actions: [{ type: 'someActionType' }] }]
			const triggerMap = {
				someTriggerType: 'someActionType'
			}
			removeActionsFromTriggers(triggers, triggerMap)
			expect(triggers).toEqual([])
		})
	})
})
