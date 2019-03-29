/*
Sets properties on targetObject using values from sourceObject.
If transformValueFn is set then the value is modified by transformValueFn.
Set value on sourceObject if value ∈ allowedValues (or allowedValues is empty)
Finally, set value on sourceObject to defaultValue if all other steps failed

Example 1:
setProp({}, {a:'100'}, 'a', 1, p => parseInt(p), [1, 100])
1. Set value = p('100') = 100
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
1. Set value = p('2') = 2
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
		// ...filter sourceObject[propName] through transformValueFn
		const value = transformValueFn(sourceObject[propName])

		// If value ∈ allowedValues (or allowedValues was not specified)...
		if (allowedValues === null || allowedValues.indexOf(value) > -1) {
			// ...set the value on targetObject
			targetObject[propName] = value
		}
	}

	// If value on targetObject is still null set it to the default value
	if (targetObject[propName] === null) {
		targetObject[propName] = defaultValue
	}
}
