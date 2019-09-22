// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorNode from './editor-registration'
import Rubric from './components/rubric/editor-registration'
import PostAssessment from './post-assessment/editor-registration'

// register
Common.Registry.registerEditorModel(EditorNode)
Common.Registry.registerEditorModel(Rubric)
Common.Registry.registerEditorModel(PostAssessment)
