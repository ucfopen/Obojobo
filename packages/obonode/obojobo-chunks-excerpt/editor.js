// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorNode from './editor-registration'

// console.log('registering editor model for excerpt')
// register
Common.Registry.registerEditorModel(EditorNode)
