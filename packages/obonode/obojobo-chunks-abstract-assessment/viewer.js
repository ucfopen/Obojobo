// Any component that inherits AbstractAssessment should define their own
// Answer subcomponent
// import './Answer/viewer'
import './Choice/viewer'
import './Feedback/viewer'

// Note: AbstractAssessment does not Directly register a model
// to the Common.Registry; inheriting components that implement 
// specific behaviors are expected to register themselves. 