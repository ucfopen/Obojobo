// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorNode from './editor'
import Rubric from './components/rubric/editor'
import PostAssessment from './post-assessment/editor'

// register
Common.Registry.registerEditorModel(EditorNode)
Common.Registry.registerEditorModel(Rubric)
Common.Registry.registerEditorModel(PostAssessment)
