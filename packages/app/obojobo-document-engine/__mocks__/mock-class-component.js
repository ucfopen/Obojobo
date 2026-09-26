import React from 'react'

// from MDN solution https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
const getCircularReplacer = () => {
	const seen = new WeakSet()
	return (key, updated) => {
		if (typeof updated === 'object' && updated !== null) {
			if (seen.has(updated)) {
				return
			}
			seen.add(updated)
		}
		return updated
	}
}

export default class MockClassComponent extends React.Component {
	render() {
		return (
			<div>MockClassComponent Props: {JSON.stringify(this.props, getCircularReplacer(), 2)}</div>
		)
	}
}
