import React from 'react'

class VisualEditorErrorBoundry extends React.Component {
	componentDidCatch(error, info) {
		console.error(error.message) //eslint-disable-line no-console
		console.error(info.componentStack) //eslint-disable-line no-console

		// if the slate editor is present, attempt to undo
		if (this.props.editorRef) {
			try {
				this.props.editorRef.undo()
			} catch (error) {
				console.error('VisualEditorErrorBoundry attempt to undo threw an error') //eslint-disable-line no-console
			}
		}
	}

	render() {
		return this.props.children
	}
}

export default VisualEditorErrorBoundry
