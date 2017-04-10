let oboPath = require('./obo_path')

module.exports = function(name) {
	return require(oboPath.expand(name));
}