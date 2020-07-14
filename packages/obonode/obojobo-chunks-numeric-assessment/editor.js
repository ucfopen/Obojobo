// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
import EditorNode from './editor-registration'
import NumericAnswer from './NumericAnswer/editor-registration'

import { NUMERIC_CHOICE_NODE, NUMERIC_FEEDBACK_NODE } from './constants'

Common.Registry.registerEditorModel(EditorNode)
Common.Registry.registerEditorModel(NumericAnswer)

// These allow the JSON to be procesed properly
Common.Registry.registerEditorModel({ name: NUMERIC_CHOICE_NODE })
Common.Registry.registerEditorModel({ name: NUMERIC_FEEDBACK_NODE })
