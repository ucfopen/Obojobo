const PageModule = require('./page-module')
const connect = require('react-redux').connect
/* istanbul ignore next */
const mapStoreStateToProps = state => state
module.exports = connect(
	mapStoreStateToProps,
	{}
)(PageModule)
