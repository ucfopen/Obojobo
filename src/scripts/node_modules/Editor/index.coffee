module.exports =
	components:
		EditorApp: require 'Editor/components/editorapp'
	chunk:
		BaseCommandHandler: require 'Editor/chunk/basecommandhandler'
		focusableChunk:
			FocusableCommandHandler: require 'Editor/chunk/focusablechunk/focusablecommandhandler'
			ToggleCommandHandler: require 'Editor/chunk/focusablechunk/togglecommandhandler'
		textChunk:
			TextGroupCommandHandler: require 'Editor/chunk/textchunk/textgroupcommandhandler'