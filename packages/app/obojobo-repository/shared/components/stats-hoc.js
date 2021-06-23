const Stats = require('./stats')
const connect = require('react-redux').connect
const { loadModuleAssessmentDetails } = require('../actions/stats-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	loadModuleAssessmentDetails
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Stats)
