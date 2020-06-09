import Button from '../../common/components/button'

class EditorErrorBoundry extends React.Component {

	constructor(props) {
		super(props);
		this.state = { hasError: false }
		this.tryagain = this.tryagain.bind(this)
	}

	static getDerivedStateFromError(error) {
		return { hasError: true }
	}

	tryagain(){
		this.setState({hasError: false})
	}
	componentDidCatch(error, info) {
		console.error(error.message) //eslint-disable-line no-console
		console.error(info.componentStack) //eslint-disable-line no-console
	}

	// componentDidUpdate(prevProps, prevState) {
	// 	const isRecovering = !prevState.hasError && this.state.hasError
	// }

	render() {
		if (this.state.hasError) {
			return (
				<div>
					<h1>Opps. There was a problem.</h1>
					<div>
						The editor just experienced a fatal error. It's been reported so we can look into fixing it asap.
					</div>
					<div>
						<p>If you wish, provide some context to what you were trying to do when the error occured:</p>
						<textarea></textarea>
					</div>
					<p>The editor may be able recover to the last known state before the error</p>
					<Button onClick={this.tryagain}>Recover!</Button>
				</div>
			)
		}

		return this.props.children
	}
}

export default EditorErrorBoundry
