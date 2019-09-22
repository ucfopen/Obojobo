// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorNode from './editor'
import MCAnswer from './MCAnswer/editor'
import MCChoice from './MCChoice/editor'
import MCFeedback from './MCFeedback/editor'

// register
Common.Registry.registerEditorModel(EditorNode)
Common.Registry.registerEditorModel(MCAnswer)
Common.Registry.registerEditorModel(MCChoice)
Common.Registry.registerEditorModel(MCFeedback)
