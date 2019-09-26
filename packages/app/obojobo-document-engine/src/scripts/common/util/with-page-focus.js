import focus from '../page/focus'
import React from 'react'

function getDisplayName(BaseComponent) {
	return BaseComponent.displayName || BaseComponent.name || 'Component'
}

function withPageFocus(BaseComponent) {
	class WithPageFocus extends React.Component {
		render() {
			// Assign the custom prop "forwardedRef" as a ref
			// see forwardRef
			const { forwardedRef, ...rest } = this.props
			return <BaseComponent {...rest} ref={forwardedRef} focus={focus} withPageFocus={true} />
		}
	}

	WithPageFocus.displayName = `WithPageFocus(${getDisplayName(BaseComponent)})`

	// Note the second param "ref" provided by React.forwardRef.
	// We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
	// And it can then be attached to the Component.
	return React.forwardRef((props, ref) => {
		return <WithPageFocus {...props} forwardedRef={ref} />
	})
}

export default withPageFocus
