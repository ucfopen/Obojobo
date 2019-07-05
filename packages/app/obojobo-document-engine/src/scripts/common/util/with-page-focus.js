import focus from '../page/focus'

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withPageFocus(BaseComponent){
	class WithPageFocus extends React.Component{
		render(){
			return <BaseComponent {...this.props} focus={focus} />
		}
	}
	WithPageFocus.displayName = `WithPageFocus(${getDisplayName(BaseComponent)})`
	return WithPageFocus
}

export default withPageFocus
