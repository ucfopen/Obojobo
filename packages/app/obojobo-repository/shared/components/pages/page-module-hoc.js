const Module = require('./page-module.jsx')
const connect = require('react-redux').connect
const mapStoreStateToProps = state => state

module.exports = connect(mapStoreStateToProps, null)(Module)
