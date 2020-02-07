// Class which modifies a slate plugins object to add methods which will
// cancel any input and pasting.

const isType = (editor, nodeType) => {
	return editor.value.blocks.some(block => block.type === nodeType)
}

export default (nodeType, pluginsConfig) => {
	// See issue https://github.com/ucfopen/Obojobo/issues/1054
	// To fix slate moving focus around and scrolling the page you can
	// give a void-like slate node a text node child. This solves the
	// issue but we don't really want any content to be put in this node,
	// it's only there to give slate something to focus on. So we
	// prevent any meaningful input to keep the node blank:
	pluginsConfig.onBeforeInput = (event, editor, next) => {
		if (isType(editor, nodeType)) {
			event.preventDefault()
		}

		return next()
	}

	// @HACK: There isn't a way to prevent pasting in this version of
	// slate, so if the user is focused on our blank node and pastes
	// we need to cancel it. The hack du jour is undoing the paste action.
	pluginsConfig.onPaste = (event, editor, next) => {
		if (isType(editor, nodeType)) {
			return
		}

		return next()
	}

	return pluginsConfig
}
