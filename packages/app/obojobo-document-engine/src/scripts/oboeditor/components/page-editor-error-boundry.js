import React from 'react'

class ErrorBoundary extends React.Component {
	componentDidCatch() {
		if (this.props.editorRef.current) {
			this.props.editorRef.current.undo()
		}
	}

	render() {
		return this.props.children
	}
}

export default ErrorBoundary
