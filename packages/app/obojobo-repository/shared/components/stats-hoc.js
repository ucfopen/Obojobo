const Stats = require('./stats')
const connect = require('react-redux').connect
const { loadUserModuleList, loadModuleAssessmentDetails } = require('../actions/stats-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	loadUserModuleList,
	loadModuleAssessmentDetails
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Stats)
