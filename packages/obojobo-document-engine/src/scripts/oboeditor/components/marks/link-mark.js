function linkMark(options) {
	const { type, render } = options

	return {
		// This plugin's version of onKeyDown(event, change) has been moved to
		// page-editor as a workaround for Slate's synchronous keyDown plugins
		// When we upgrade Slate to 0.43+, the keyDown event should be moved back
		// here for consistency
		renderMark(props) {
			switch (props.mark.type) {
				case type:
					return render(props)
			}
		}
	}
}

export default linkMark
