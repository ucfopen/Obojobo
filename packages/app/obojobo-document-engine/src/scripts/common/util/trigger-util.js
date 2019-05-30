/*
	Mutates triggers
	triggerMap is keyed by trigger type
	with a value of an action (object)
	or multiple actions (array of objects)
	Example triggerMap:
		const triggerMap = {
			onStartAttempt: { type: 'nav:lock', someValue: 3 },
			onEndAttempt: [{ type: 'nav:unlock' }, {type: 'someType'}]
		}
*/
export const addActionsToTriggers = (triggers, triggerMap) => {
	const usesMap = { ...triggerMap }
	for (const type in usesMap) {
		usesMap[type] = false
	}

	for (const trigger of triggers) {
		let actions = triggerMap[trigger.type]
		if (actions) {
			if (!trigger.actions) trigger.actions = []
			// if just an object convert to array
			if (actions.constructor.name === 'Object') actions = [actions]
			const actionTypes = actions.map(action => action.type)
			const filteredActions = trigger.actions.filter(action => !actionTypes.includes(action.type))
			// due to filtering only one action with type from triggerMap can exist
			trigger.actions = [...filteredActions, ...actions]
			usesMap[trigger.type] = true
		}
	}

	for (const type in usesMap) {
		if (!usesMap[type]) {
			let actions = triggerMap[type]
			// if just an object convert to array
			if (actions.constructor.name === 'Object') actions = [actions]
			triggers.push({ type: type, actions })
			usesMap[type] = true
		}
	}
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
	Mutates triggers
	triggerMap is keyed by trigger type
	with a value of an action type (string)
	or multiple action types (array of strings)
	Example triggerMap:
		const triggerMap = {
			onStartAttempt: 'nav:lock',
			onEndAttempt: ['nav:unlock', 'someOtherActionType']
		}
	Note: also removes triggers themselves if they have no actions
*/
export const removeActionsFromTriggers = (triggers, triggerMap) => {
	if (!triggers) return
	const triggersToRemove = []

	triggers.forEach((trigger, index) => {
		let actions = triggerMap[trigger.type]
		if (actions) {
			// if we have actions set to remove but the trigger itself
			// does not have actions or has an empty array of actions
			// add trigger to removal array
			// if (!trigger.actions || (Array.isArray(trigger.actions) && !trigger.actions[0])) {
			if (!trigger.actions || trigger.actions.length === 0) {
				triggersToRemove.push(index)
			} else {
				if (typeof actions === 'string') actions = [actions]
				const filteredActions = trigger.actions.filter(action => !actions.includes(action.type))
				trigger.actions = filteredActions
				// if post-filtered actions is empty add trigger to removal array
				if (trigger.actions.length === 0) triggersToRemove.push(index)
			}
		}
	})
	// remove triggers with no actions
	triggersToRemove.forEach((current, idx) => {
		triggers.splice(current - idx, 1)
	})
}
