// Main entrypoint for editor
import Common from 'obojobo-document-engine/src/scripts/common'
// import Answer from './Answer/editor-registration'
import Choice from './Choice/editor-registration'
import Feedback from './Feedback/editor-registration'

// Register - Answer is registered by inheriting components
Common.Registry.registerEditorModel(Choice)
Common.Registry.registerEditorModel(Feedback)

// Note: AbstractAssessment does not directly register a model
// to the Common.Registry; inheriting components that implement
// specific behaviors are expected to register themselves.
