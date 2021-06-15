const Stats = require('./stats')
const connect = require('react-redux').connect
const { loadModuleAssessmentAnalytics } = require('../actions/stats-actions')
const mapStoreStateToProps = state => state
const mapActionsToProps = {
	loadModuleAssessmentAnalytics
}
module.exports = connect(
	mapStoreStateToProps,
	mapActionsToProps
)(Stats)
