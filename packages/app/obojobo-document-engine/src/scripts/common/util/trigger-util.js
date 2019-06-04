/*
	Returns new updated triggers
	newTriggers is keyed by trigger type
	with a value of an action (object)
	or multiple actions (array of objects)
	Example newTriggers:
		{
			onStartAttempt: { type: 'nav:lock', someValue: 3 },
			onEndAttempt: [{ type: 'nav:unlock' }, {type: 'someType'}]
		}
*/
export const getTriggersWithActionsAdded = (triggers, newTriggers) => {
	// triggersToAdd will keep track of the new triggers to add from newTriggers
	// If a trigger already exists we'll remove it from triggersToAdd
	const triggersToAdd = new Set(Object.keys(newTriggers))

	const updatedTriggers = triggers.map(trigger => {
		// the actions to add for this trigger type
		let newActions = newTriggers[trigger.type]
		if (!newActions) return trigger

		// if newActions is object, it is converted to array here
		newActions = [].concat(newActions)
		// get an array of all action types for given trigger
		const newActionTypes = newActions.map(action => action.type)
		// get an array of all actions that are not part of newTriggers
		const existingActions = trigger.actions.filter(action => !newActionTypes.includes(action.type))

		// can remove from set, knowing the trigger has been used
		triggersToAdd.delete(trigger.type)

		return {
			...trigger,
			actions: [...existingActions, ...newActions]
		}
	})

	// if the trigger type did not exist in triggers
	// make sure to add it to triggers
	triggersToAdd.forEach(triggerType => {
		// if newTriggers[triggerType] is object, it is converted to array here
		const actions = [].concat(newTriggers[triggerType])
		updatedTriggers.push({ type: triggerType, actions })
	})

	return updatedTriggers
}

/*
	Returns true if triggers has trigger type with action type
	Returns false otherwise
*/
export const hasTriggerTypeWithActionType = (triggers, triggerType, actionType) => {
	if (!triggers) return false

	return !!triggers.find(
		trigger =>
			trigger.type === triggerType &&
			trigger.actions &&
			trigger.actions.find(action => action.type === actionType)
	)
}

/*
	Returns new updated triggers
	triggersToRemove is keyed by trigger type
	with a value of an action type (string)
	or multiple action types (array of strings)
	Example triggersToRemove:
		{
			onStartAttempt: 'nav:lock',
			onEndAttempt: ['nav:unlock', 'someOtherActionType']
		}
	Note: triggers without actions (empty triggers) will not be returned
*/
export const getTriggersWithActionsRemoved = (triggers, triggersToRemove) => {
	// array of trigger indices that don't have actions
	const triggersWithNoActions = []

	const updatedTriggers = triggers.map((trigger, triggerIndex) => {
		// the actions to remove for this trigger type
		let actionsToRemove = triggersToRemove[trigger.type]
		if (!actionsToRemove) return trigger

		// if actions is string, it is converted to array here
		actionsToRemove = [].concat(actionsToRemove)
		// get all actions that are not part of actionsToRemove
		const actionsToKeep = trigger.actions.filter(action => {
			return !actionsToRemove.includes(action.type)
		})
		if (actionsToKeep.length === 0) {
			// if actions is empty after filtering, flag the trigger for removal
			triggersWithNoActions.push(triggerIndex)
		}
		return {
			...trigger,
			actions: actionsToKeep
		}
	})

	// Remove all triggers with no actions.
	// Splicing indices, instead of filtering by trigger type
	// allows duplicate trigger types to exist
	triggersWithNoActions.forEach((current, index) => {
		// Ensures proper trigger is removed,
		// as removing a trigger will update indices
		updatedTriggers.splice(current - index, 1)
	})

	return updatedTriggers
}
