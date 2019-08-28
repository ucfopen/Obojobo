/* eslint-disable no-undefined */

import {
	getTriggersWithActionsAdded,
	getTriggersWithActionsRemoved,
	hasTriggerTypeWithActionType
} from '../../../src/scripts/common/util/trigger-util'

describe('trigger-util', () => {
	describe('getTriggersWithActionsAdded', () => {
		test('adds action to trigger with existing actions (newTriggers uses object for action)', () => {
			const triggers = [{ type: 'someTrigger', actions: [{ type: 'actionType' }] }]
			const newTriggers = { someTrigger: { type: 'someOtherType' } }

			const updatedTriggers = getTriggersWithActionsAdded(triggers, newTriggers)
			expect(updatedTriggers).toEqual([
				{ type: 'someTrigger', actions: [{ type: 'actionType' }, { type: 'someOtherType' }] }
			])
		})

		test('adds actions to trigger with existing actions (newTriggers uses array for actions)', () => {
			const triggers = [{ type: 'someTrigger', actions: [{ type: 'actionType' }] }]
			const newTriggers = { someTrigger: [{ type: 'someOtherType' }] }

			const updatedTriggers = getTriggersWithActionsAdded(triggers, newTriggers)
			expect(updatedTriggers).toEqual([
				{ type: 'someTrigger', actions: [{ type: 'actionType' }, { type: 'someOtherType' }] }
			])
		})

		test('creates trigger when it does not exist and adds to triggers', () => {
			const triggers = [{ type: 'someNotUsedTrigger' }]
			const newTriggers = {
				someTrigger: { type: 'someActionType', value: 'someValue' }
			}

			const updatedTriggers = getTriggersWithActionsAdded(triggers, newTriggers)
			expect(updatedTriggers).toEqual([
				{ type: 'someNotUsedTrigger' },
				{ type: 'someTrigger', actions: [{ type: 'someActionType', value: 'someValue' }] }
			])
		})

		test('creates trigger when it does not exists and adds to triggers (using array in trigger map)', () => {
			const triggers = []
			const newTriggers = {
				someTrigger: [{ type: 'someActionType', value: 'someValue' }]
			}

			const updatedTriggers = getTriggersWithActionsAdded(triggers, newTriggers)
			expect(updatedTriggers).toEqual([
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

	describe('getTriggersWithActionsRemoved', () => {
		test('removes action from trigger (triggersToRemove uses string)', () => {
			const triggers = [
				{
					type: 'someTriggerType',
					actions: [{ type: 'someActionType' }, { type: 'someOtherType' }]
				},
				{ type: 'otherTrigger' }
			]
			const triggersToRemove = {
				someTriggerType: 'someActionType'
			}
			const updatedTriggers = getTriggersWithActionsRemoved(triggers, triggersToRemove)
			expect(updatedTriggers).toEqual([
				{ type: 'someTriggerType', actions: [{ type: 'someOtherType' }] },
				{ type: 'otherTrigger' }
			])
		})

		test('removes action from trigger (triggersToRemove uses array) (only removes trigger with matching type and action type)', () => {
			const triggers = [
				{
					type: 'someTriggerType',
					actions: [{ type: 'someActionType' }, { type: 'someOtherType' }]
				},
				{ type: 'someTriggerType', actions: [{ type: 'someOtherType' }] }
			]
			const triggersToRemove = {
				someTriggerType: ['someActionType']
			}
			const updatedTriggers = getTriggersWithActionsRemoved(triggers, triggersToRemove)
			expect(updatedTriggers).toEqual([
				{ type: 'someTriggerType', actions: [{ type: 'someOtherType' }] },
				{ type: 'someTriggerType', actions: [{ type: 'someOtherType' }] }
			])
		})

		test('removes action from trigger and then removes trigger with empty actions array', () => {
			const triggers = [{ type: 'someTriggerType', actions: [{ type: 'someActionType' }] }]
			const triggersToRemove = {
				someTriggerType: 'someActionType'
			}
			const updatedTriggers = getTriggersWithActionsRemoved(triggers, triggersToRemove)
			expect(updatedTriggers).toEqual([])
		})
	})
})
