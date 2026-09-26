/*
Sets properties on targetObject using values from sourceObject.
If transformValueFn is set then the updated is modified by transformValueFn.
Set updated on sourceObject if updated ∈ allowedValues (or allowedValues is empty)
Finally, set updated on sourceObject to defaultValue if all other steps failed

Example 1:
setProp({}, {a:'100'}, 'a', 1, p => parseInt(p), [1, 100])
1. Set updated = p('100') = 100
2. 100 ∈ [1, 100] so targetObject['a'] = 100
3. targetObject['a'] is set so do not use defaultValue
---
targetObject = {a:100}

Example 2:
setProp({}, {b:'1'}, 'c', 1, p => parseInt(p), [1, 100])
1. sourceObject['c'] does not exist so sourceObject['c'] = defaultValue
---
targetObject = {c:1}

Example 3:
setProp({}, {c:'2'}, 'c', 1, p => parseInt(p), [1, 100])
1. Set updated = p('2') = 2
2. 2 ∉ [1, 100] so targetObject is unmodified
3. targetObject['c'] is not set so use defaultValue instead
---
targetObject = {c:1}
*/

const identityFn = p => p

export default (
	targetObject,
	sourceObject,
	propName,
	defaultValue,
	transformValueFn = identityFn,
	allowedValues = null
) => {
	targetObject[propName] = null

	// If propName exists on sourceObject...
	if (typeof sourceObject[propName] !== 'undefined') {
		try {
			// ...filter sourceObject[propName] through transformValueFn
			const updated = transformValueFn(sourceObject[propName])

			// If updated ∈ allowedValues (or allowedValues was not specified)...
			if (allowedValues === null || allowedValues.indexOf(updated) > -1) {
				// ...set the updated on targetObject
				targetObject[propName] = updated
			}
		} catch (error) {
			// absorb the error, the updated should remain null
			// which will end up using the default updated
			console.error(`SetProp transformValueFn for "${propName}" errored.`) //eslint-disable-line no-console
			console.error(error) //eslint-disable-line no-console
		}
	}

	// If updated on targetObject is still null set it to the default updated
	if (targetObject[propName] === null) {
		targetObject[propName] = defaultValue
	}
}
