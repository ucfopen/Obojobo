// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorNode from './editor-registration'
import MCAnswer from './MCAnswer/editor-registration'

import { MC_CHOICE_NODE, MC_FEEDBACK_NODE } from './constants'

// register
Common.Registry.registerEditorModel(EditorNode)
Common.Registry.registerEditorModel(MCAnswer)

// TODO - Remove minimal declarations when obojobo node is refactored
// These allow the JSON to be procesed properly
Common.Registry.registerEditorModel({ name: MC_CHOICE_NODE })
Common.Registry.registerEditorModel({ name: MC_FEEDBACK_NODE })
