import React from 'react'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true })
		// eslint-disable-next-line no-console
		console.log(error)
		// eslint-disable-next-line no-console
		console.log(info)
	}

	render() {
		if (this.state.hasError) {
			// Remove loading screen of the viewer
			const loadingEl = document.getElementById('viewer-app-loading')
			if (loadingEl && loadingEl.parentElement) {
				document.getElementById('viewer-app').classList.add('is-loaded')
				loadingEl.parentElement.removeChild(loadingEl)
			}

			return <h1>Something went wrong. Please try again.</h1>
		}

		return this.props.children
	}
}

export default ErrorBoundary
