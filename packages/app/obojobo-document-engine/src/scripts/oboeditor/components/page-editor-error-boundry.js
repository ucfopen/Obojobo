import React from 'react'

class PageEditorErrorBoundry extends React.Component {
	componentDidCatch() {
		if (this.props.editorRef) {
			this.props.editorRef.undo()
		}
	}

	render() {
		return this.props.children
	}
}

export default PageEditorErrorBoundry
