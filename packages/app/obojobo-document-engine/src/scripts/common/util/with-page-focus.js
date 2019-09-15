import focus from '../page/focus'
import React from 'react'

function getDisplayName(BaseComponent) {
	return BaseComponent.displayName || BaseComponent.name || 'Component'
}

function withPageFocus(BaseComponent) {
	class WithPageFocus extends React.Component {
		render() {
			return <BaseComponent {...this.props} focus={focus} withPageFocus={true} />
		}
	}

	WithPageFocus.displayName = `WithPageFocus(${getDisplayName(BaseComponent)})`
}

export default withPageFocus
