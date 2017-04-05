// Global for loading specialized Obojobo stuff
// use oboRequire('models/draft') to load draft models from any context
global.oboRequire = function(name) {
	return require(`${__dirname}/${name}`);
}
