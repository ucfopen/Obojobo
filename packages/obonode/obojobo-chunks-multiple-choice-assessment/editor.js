// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorNode from './editor-registration'
import MCAnswer from './MCAnswer/editor-registration'
import MCChoice from './MCChoice/editor-registration'
import MCFeedback from './MCFeedback/editor-registration'

// register
Common.Registry.registerEditorModel(EditorNode)
Common.Registry.registerEditorModel(MCAnswer)
Common.Registry.registerEditorModel(MCChoice)
Common.Registry.registerEditorModel(MCFeedback)