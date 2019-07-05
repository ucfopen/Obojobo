const PeopleSearchDialog = require('./people-search-dialog')
const connect = require('react-redux').connect
const { searchForUser, clearPeopleSearchResults }  = require('../actions/dashboard-actions')
const mapStoreStateToProps = state => ({people: state.searchPeople.items})
const mapActionsToProps = { onSearchChange: searchForUser, clearPeopleSearchResults }

module.exports = connect(mapStoreStateToProps, mapActionsToProps)(PeopleSearchDialog)
