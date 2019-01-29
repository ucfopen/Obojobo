const Enzyme = require('enzyme')
const EnzymeAdapter = require('enzyme-adapter-react-15')
// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() })

// Needed for the rather nested tests of Obojobo.Chunks.MCAssessment.MCChoice
const React = require('react')
React.addons = {
	CSSTransitionGroup: require('react-transition-group/CSSTransitionGroup')
}
