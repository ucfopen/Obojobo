const PageModule = require('./page-module')
const connect = require('react-redux').connect
const mapStoreStateToProps = state => state
module.exports = connect(
	mapStoreStateToProps,
	{}
)(PageModule)
